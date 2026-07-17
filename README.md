# Finance Tracker

A full-stack personal finance tracker: track income and expenses, set monthly
budgets, and visualize spending. A Spring Boot REST API backed by MySQL, with
a React (Vite) frontend.

## Tech Stack

**Backend** — Java 17 · Spring Boot 3.5 · Spring Security · JWT · Spring Data JPA · Hibernate · MySQL · Maven
**Frontend** — React 19 (Vite) · Tailwind CSS v4 · React Router · Axios · Recharts

## Status

Built in phases, each one runnable and reviewed before the next starts.

- [x] Phase 1 — Project setup, folder structure, dependencies, DB config
- [x] Phase 2 — Authentication (register, login, JWT, BCrypt)
- [x] Phase 3 — Transactions (CRUD)
- [x] Phase 4 — Budget
- [x] Phase 5 — Dashboard (summary cards, charts)
- [ ] Phase 6 — Reports (filters, trends)
- [ ] Phase 7 — User profile
- [ ] Phase 8 — Polish + full documentation

## Project Structure

```
finance-tracker/
├── backend/                Spring Boot API
│   └── src/main/java/com/financetracker/
│       ├── controller/      REST endpoints
│       ├── service/         Business logic
│       ├── repository/      Spring Data JPA repositories
│       ├── entity/          JPA entities
│       ├── dto/             Request/response payloads
│       ├── security/        JWT filter, UserDetailsService, etc.
│       ├── config/          Spring configuration beans
│       ├── exception/       Global exception handling
│       └── util/            Helpers
└── frontend/                React (Vite) client
    └── src/
        ├── components/       Reusable UI pieces
        ├── pages/             Route-level views
        ├── layouts/           Shared page shells (navbar, sidebar, etc.)
        ├── services/          Axios calls per resource
        ├── hooks/             Custom React hooks
        ├── context/           React context providers (auth, theme, ...)
        └── utils/             Helpers
```

## Getting Started

### Prerequisites
- Java 17
- Maven 3.9+
- Node.js 20+
- MySQL 8+

### Backend
```bash
cd backend
# MySQL will auto-create the finance_tracker schema on first run
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=a-long-random-secret-at-least-32-bytes
mvn spring-boot:run
```
Runs on **http://localhost:8080**. Run `mvn test` to run the test suite (uses an in-memory H2 database, no MySQL needed for tests).

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Runs on **http://localhost:5173**.

## Notes on version choices

- **Spring Boot 3.5.16 on Java 17** — the final patch on the 3.x line (3.x
  reached OSS end-of-life on 2026-06-30) targeting Java 17, Spring Boot 3's
  original baseline JDK. Spring Boot 4.1 is current if you'd rather move to
  that line later - it's a version bump plus some Spring Security config
  changes, not a rewrite.
- **Tailwind CSS v4** — configured via the `@tailwindcss/vite` plugin
  (no `tailwind.config.js`/PostCSS needed); theme and dark-mode variant
  live directly in `src/index.css`.
- **Recharts** over Chart.js for the dashboard charts — composes more
  naturally as React components. Easy to swap if you'd prefer Chart.js.

## License

Add a license (MIT is a common default for portfolio projects) once you push this to GitHub.
