import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import create_engine, pool

from alembic import context

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import Base  # noqa: E402
from app.models import *  # noqa: E402,F401,F403


def _database_url() -> str:
    """Resolve the migration target, preferring DATABASE_URL_SYNC from the environment.

    A migration needs exactly one connection string. It has no use for the SMTP,
    JWT or seed-admin settings, so requiring a full .env just to run one is a trap
    on a deployed host: .env is gitignored, so a git-based deploy never ships it.
    Reading the variable directly means `DATABASE_URL_SYNC=... alembic upgrade head`
    works anywhere. Falling back to Settings keeps plain `alembic upgrade head`
    working locally, where .env does exist.
    """
    url = os.getenv("DATABASE_URL_SYNC")
    if url:
        return url.strip()
    from app.core.config import settings  # noqa: PLC0415 — needs a complete .env

    return settings.database_url_sync


config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=_database_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = create_engine(_database_url(), poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
