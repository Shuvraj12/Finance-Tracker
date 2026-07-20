# Installation Guide

## Prerequisites

| Tool | Version | Check with |
|---|---|---|
| Java | 17 | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 20+ | `node --version` |
| MySQL | 8+ | `mysql --version` |

## 1. MySQL

Make sure a MySQL server is running locally, and that you have credentials for a user that can create databases. The default config assumes `root` with no extra setup:

```sql
-- Optional: only if you'd rather use a dedicated user instead of root
CREATE USER 'finance_tracker'@'localhost' IDENTIFIED BY 'a-password-you-choose';
GRANT ALL PRIVILEGES ON finance_tracker.* TO 'finance_tracker'@'localhost';
FLUSH PRIVILEGES;
```

You don't need to create the `finance_tracker` database itself - the backend's connection string includes `createDatabaseIfNotExist=true`, so it's created automatically on first run.

## 2. Backend

```bash
cd backend

export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=$(openssl rand -hex 32)

mvn spring-boot:run
```

The API is now running on `http://localhost:8080`. `mvn spring-boot:run` also creates/updates all three tables on startup (`ddl-auto: update`) - nothing else to run manually.

To run just the test suite (uses an in-memory H2 database, so it doesn't touch MySQL or need the env vars above):

```bash
mvn test
```

## 3. Frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app is now running on `http://localhost:5173`. `.env`'s default (`VITE_API_BASE_URL=http://localhost:8080/api`) already matches the backend's default port, so no edits are needed for a standard local setup.

## Environment variables

| Variable | Where | Default | Notes |
|---|---|---|---|
| `DB_USERNAME` | backend | `root` | MySQL username |
| `DB_PASSWORD` | backend | `root` | MySQL password |
| `JWT_SECRET` | backend | a dev-only placeholder | Override this to anything real. Must be at least 32 bytes (256 bits) - `openssl rand -hex 32` generates a good one |
| `CORS_ALLOWED_ORIGINS` | backend | `http://localhost:5173` | Comma-separated if you need more than one origin |
| `VITE_API_BASE_URL` | frontend (`.env`) | `http://localhost:8080/api` | Where the frontend sends API requests |

The backend variables all have working defaults for local dev *except* `DB_PASSWORD`, which you'll need to set to whatever your actual MySQL password is.

## Troubleshooting

**`Communications link failure` / connection refused on backend startup**
MySQL isn't running, or `DB_USERNAME`/`DB_PASSWORD` don't match a real account. Confirm MySQL is up with `mysql -u root -p`, using the same credentials.

**`Port 8080 was already in use`**
Something else is already running on 8080. Either stop it, or override the backend's port: add `server.port: 8081` to `application.yml` (and update `VITE_API_BASE_URL` to match).

**Frontend loads, but every request fails with a CORS error in the browser console**
The backend's `CORS_ALLOWED_ORIGINS` doesn't include whatever origin the frontend is actually running on. This usually happens if you changed the frontend's port (Vite will auto-increment to 5174, 5175, etc. if 5173 is taken) without updating the backend's env var to match.

**Suddenly logged out / `401` on every request after restarting the backend**
`JWT_SECRET` changed between runs (e.g. you didn't `export` it in the new terminal session, so it fell back to the dev default). Every token issued under the old secret stops validating. Re-login fixes it; setting `JWT_SECRET` in a `.env`-style file you consistently source avoids it happening again.

**`mvn: command not found`**
Maven isn't installed, or isn't on your `PATH`. Install it via your OS package manager (`brew install maven`, `apt install maven`, etc.) or download it from [maven.apache.org](https://maven.apache.org/download.cgi).

**`npm install` fails or hangs**
Confirm Node is 20+ (`node --version`) - older versions aren't guaranteed to work with this Vite/React version. If a previous install is in a bad state, delete `node_modules` and `package-lock.json` and try again.
