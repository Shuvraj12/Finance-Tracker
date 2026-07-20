# API Documentation

Base URL (local dev): `http://localhost:8080/api`

## Authentication

Every endpoint requires a JWT **except** `POST /auth/register` and `POST /auth/login`. Send the token from either of those responses as a header on every other request:

```
Authorization: Bearer <token>
```

Tokens expire after 24 hours (`jwt.expiration-ms` in `application.yml`). There's no refresh-token flow - the client just needs to log in again once a token expires.

## Error responses

Every error (validation failure, auth failure, not found, etc.) returns the same shape, produced by `GlobalExceptionHandler`:

```json
{
  "timestamp": "2026-07-19T10:15:30",
  "status": 400,
  "error": "Validation Failed",
  "message": "One or more fields are invalid",
  "path": "/api/transactions",
  "fieldErrors": {
    "amount": "Amount must be greater than 0"
  }
}
```

`fieldErrors` is only present for request-body validation failures (400s from `@Valid`) - every other error omits it entirely rather than sending it as `null`.

| Status | Meaning in this API |
|---|---|
| 400 | Validation failed, malformed JSON, an invalid enum value, or a query param out of range |
| 401 | Missing/invalid/expired token, or wrong password |
| 404 | Resource doesn't exist, or doesn't belong to you (transactions/budgets never leak whether an id exists for someone else - it's a 404 either way) |
| 409 | Conflict - email already registered, or a budget already exists for that month |

---

## Auth

### `POST /auth/register`

No token required.

**Request**
```json
{
  "name": "Shuvraj Singh",
  "email": "shuvraj@example.com",
  "password": "at-least-8-chars"
}
```

**Response** `201 Created`
```json
{
  "token": "eyJhbGciOi...",
  "type": "Bearer",
  "id": 1,
  "name": "Shuvraj Singh",
  "email": "shuvraj@example.com"
}
```

Errors: `400` (validation), `409` (email already registered).

### `POST /auth/login`

No token required.

**Request**
```json
{ "email": "shuvraj@example.com", "password": "at-least-8-chars" }
```

**Response** `200 OK` - same shape as register's response.

Errors: `400` (validation), `401` (wrong email/password).

---

## Transactions

All four endpoints act on the authenticated user's own transactions only - `userId` always comes from the JWT, never from the request.

### `GET /transactions`

Returns every transaction for the current user, most recent first.

**Response** `200 OK`
```json
[
  {
    "id": 42,
    "amount": 1250.00,
    "transactionType": "EXPENSE",
    "category": "FOOD",
    "note": "Groceries",
    "date": "2026-07-15",
    "createdAt": "2026-07-15T18:32:01"
  }
]
```

### `POST /transactions`

**Request**
```json
{
  "amount": 1250.00,
  "transactionType": "EXPENSE",
  "category": "FOOD",
  "note": "Groceries",
  "date": "2026-07-15"
}
```

- `transactionType`: `INCOME` or `EXPENSE`
- `category` must be valid for the given `transactionType` (e.g. `SALARY` is only valid with `INCOME`; `OTHERS` works with either) - see [DATABASE.md](DATABASE.md#categories) for the full list per type
- `note` is optional (omit or send `""`)

**Response** `201 Created` - the created transaction, same shape as the GET list items.

Errors: `400` (validation, or a category/type mismatch).

### `PUT /transactions/{id}`

Same request body as POST. Full replacement, not a partial update - send all fields.

**Response** `200 OK` - the updated transaction.

Errors: `400`, `404` (not found, or it's not yours).

### `DELETE /transactions/{id}`

**Response** `204 No Content`

Errors: `404` (not found, or it's not yours).

---

## Dashboard

### `GET /dashboard`

One call, everything the dashboard needs.

**Response** `200 OK`
```json
{
  "totalBalance": 45230.50,
  "totalIncome": 120000.00,
  "totalExpenses": 74769.50,
  "savings": 8500.00,
  "budget": {
    "id": 7,
    "amount": 20000.00,
    "month": 7,
    "year": 2026,
    "spent": 14200.00,
    "remaining": 5800.00,
    "exceeded": false
  },
  "recentTransactions": [ /* up to 5, same shape as Transactions */ ],
  "expenseByCategory": [
    { "category": "FOOD", "total": 6200.00 },
    { "category": "RENT", "total": 8000.00 }
  ],
  "monthlyTrend": [
    { "month": 2, "year": 2026, "label": "Feb 2026", "income": 20000.00, "expenses": 12500.00 }
  ]
}
```

Scope of each field:
- `totalBalance` / `totalIncome` / `totalExpenses` - **all time**
- `savings` - **this month** (income minus expenses for the current month)
- `budget` - **this month's** budget, or `null` if nothing's been set yet (not an error - the frontend shows a "set a budget" prompt for it)
- `expenseByCategory` - **this month's** expenses, grouped by category
- `monthlyTrend` - always the **last 6 calendar months**, regardless of anything else on this response

---

## Budget

Unlike Transactions, there's no `{id}` in any of these paths - a budget is identified by `(user, month, year)`, not a database id.

### `GET /budget`

Query params `month` (1-12) and `year` are both optional - omit both to get the current month. Both, if provided, must be sent together.

```
GET /budget
GET /budget?month=6&year=2026
```

**Response** `200 OK`
```json
{
  "id": 7,
  "amount": 20000.00,
  "month": 7,
  "year": 2026,
  "spent": 14200.00,
  "remaining": 5800.00,
  "exceeded": false
}
```

`spent`/`remaining`/`exceeded` are computed fresh from actual transactions on every call - never stored, so they can't drift out of sync.

Errors: `404` (nothing set for that month), `400` (month/year out of range).

### `POST /budget`

Creates a new budget. Fails if one already exists for that month.

**Request**
```json
{ "amount": 20000.00, "month": 7, "year": 2026 }
```

**Response** `201 Created` - same shape as GET.

Errors: `400`, `409` (a budget for that month already exists - use PUT instead).

### `PUT /budget`

Updates an existing budget's amount. Fails if nothing's been set for that month yet.

**Request** - same shape as POST.

**Response** `200 OK` - same shape as GET.

Errors: `400`, `404` (nothing set for that month yet - use POST instead).

---

## Reports

### `GET /reports`

```
GET /reports?period=MONTH
```

`period` is one of `TODAY`, `WEEK`, `MONTH`, `YEAR` (defaults to `MONTH` if omitted). `WEEK` means a rolling last-7-days window, not the current calendar week.

**Response** `200 OK`
```json
{
  "period": "MONTH",
  "startDate": "2026-07-01",
  "endDate": "2026-07-31",
  "totalIncome": 20000.00,
  "totalExpenses": 14200.00,
  "categoryDistribution": [
    { "category": "FOOD", "total": 6200.00 }
  ],
  "monthlyTrend": [ /* always the last 12 months, independent of `period` */ ]
}
```

`totalIncome`, `totalExpenses`, and `categoryDistribution` are scoped to `[startDate, endDate]`. `monthlyTrend` is always a fixed last-12-months window regardless of which `period` is selected - it'd be a strange UX for that chart to jump around every time the filter above it changes.

Errors: `400` (an invalid `period` value).

---

## Profile

### `PUT /profile`

Updates name/email, and optionally the password - both flow through this one endpoint since that's the only PUT the User resource has.

**Request**
```json
{
  "name": "Shuvraj Saxena",
  "email": "shuvraj@example.com",
  "currentPassword": "your-current-password",
  "newPassword": "only-if-changing-it"
}
```

- `currentPassword` is **always required**, even if you're only changing your name - it confirms it's really you before any change goes through
- `newPassword` is optional - omit it (don't send `""`) to leave your password unchanged

**Response** `200 OK` - same shape as login/register, **with a freshly issued token**. Email is the JWT's subject, so if you changed it, your old token would otherwise go stale the moment this request completes - swap to the new token immediately.

Errors: `400`, `401` (current password is wrong), `409` (that email belongs to another account).

### `DELETE /profile`

Permanently deletes the account and every transaction and budget attached to it. Requires your password even though you're already authenticated, since this is irreversible.

**Request**
```json
{ "currentPassword": "your-current-password" }
```

**Response** `204 No Content`

Errors: `400`, `401` (wrong password).
