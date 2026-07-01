# Flat Productions — Backend

FastAPI + PostgreSQL backend for the Flat Productions site (`../flatproduction`).

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in real secrets
```

Create the database once:

```bash
psql -h localhost -U postgres -c "CREATE DATABASE flatproduction_db;"
```

Run migrations and seed default content + first admin:

```bash
alembic upgrade head
python -m scripts.seed
```

## Run

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Seeded admin login

- Email: value of `SEED_ADMIN_EMAIL` in `.env`
- Password: value of `SEED_ADMIN_PASSWORD` in `.env`
- OTP: a real 6-digit code is emailed on login. `OTP_BYPASS_CODE` in `.env` (default `555555`) also always works — remove it for production.

## Notes

- Uploaded images are written to `uploads/` and served at `/uploads/*`.
- The frontend (`../flatproduction`) proxies `/api` and `/uploads` to this server in dev via `vite.config.ts` — no CORS setup needed locally.
