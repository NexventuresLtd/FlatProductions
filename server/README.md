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

## Applying migrations to production

Migrations are additive: they only create tables/columns and backfill from rows
that are already there. Nothing existing is updated, deleted or dropped, so this
is safe to run against the live database with real content in it.

A migration needs **only a database URL** — not the SMTP, JWT or seed-admin
settings. `alembic` reads `DATABASE_URL_SYNC` straight from the environment, so
this works on a deployed host that has no `.env` (a git deploy never ships one,
since `.env` is gitignored).

```bash
cd /var/www/flatproduction/FlatProductions/server
git pull
conda activate fastapi_setup          # or: source .venv/bin/activate
pip install -r requirements.txt

export PROD_SYNC="postgresql://USER:PASSWORD@HOST:5432/DBNAME"   # add ?sslmode=require for hosted Postgres

# 1. where are we now?
DATABASE_URL_SYNC="$PROD_SYNC" alembic current

# 2. back up first
pg_dump "$PROD_SYNC" > backup_$(date +%Y%m%d_%H%M).sql

# 3. apply
DATABASE_URL_SYNC="$PROD_SYNC" alembic upgrade head

# 4. verify
DATABASE_URL_SYNC="$PROD_SYNC" alembic current      # prints the newest revision + (head)
psql "$PROD_SYNC" -c "SELECT count(*) FROM portfolio_items;"   # unchanged from before
psql "$PROD_SYNC" -c "SELECT kind, name, order_index FROM content_categories ORDER BY kind, order_index;"
```

Then restart the API so it picks up the new code.

Migrating before deploying the code is safe: the new column has a server default
and the new table is simply ignored by the old code, so the site keeps working in
the gap between the two steps.

If the server already has a populated `.env`, plain `alembic upgrade head` works
too — `DATABASE_URL_SYNC` from the environment just takes precedence.

### Finding the production database URL

If you do not have it to hand, it is wherever the running API gets its config:

```bash
systemctl cat flatproduction        # look for Environment= / EnvironmentFile=
cat /var/www/flatproduction/FlatProductions/server/.env 2>/dev/null
ps -eo args | grep -i uvicorn
```

### Rolling back

```bash
DATABASE_URL_SYNC="$PROD_SYNC" alembic downgrade -1
```

`downgrade` only removes what the migration added; content rows are untouched.
To undo everything, restore the dump from step 2.

### Do not run the content scripts on production

`scripts/seed.py` and `scripts/apply_arrangement.py` **change content**, unlike
migrations. `apply_arrangement.py` in particular renames the "Web & Digital"
portfolio project to "Podcast" and reorders services. Only run it if that is what
you want. Migrations alone never touch content.

## Notes

- Uploaded images are written to `uploads/` and served at `/uploads/*`.
- The frontend (`../flatproduction`) proxies `/api` and `/uploads` to this server in dev via `vite.config.ts` — no CORS setup needed locally.
