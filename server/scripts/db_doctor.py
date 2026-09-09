"""Read-only check that the database schema matches what this code needs.

Compares the alembic revision the database claims against the tables and columns
that actually exist, then prints the exact command to fix any mismatch. Useful
when the API raises UndefinedColumn / UndefinedTable after a deploy.

Writes nothing. Needs only a database URL:

    DATABASE_URL_SYNC="postgresql://user:pass@host:5432/db" python -m scripts.db_doctor
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, inspect, text  # noqa: E402

# (revision that introduces it, table, column or None for the whole table)
EXPECTED = [
    ("a1f4c7b20e91", "gallery_items", "updated_at"),
    ("d5b93a1c7e42", "content_categories", None),
]
HEAD = "d5b93a1c7e42"


def _url() -> str:
    url = os.getenv("DATABASE_URL_SYNC")
    if url:
        return url
    from app.core.config import settings  # needs a complete .env

    return settings.database_url_sync


def main() -> int:
    engine = create_engine(_url())
    with engine.connect() as conn:
        host = conn.execute(text("SELECT current_database()")).scalar_one()
        try:
            revision = conn.execute(text("SELECT version_num FROM alembic_version")).scalar_one_or_none()
        except Exception:
            revision = None

        insp = inspect(conn)
        tables = set(insp.get_table_names())

        print(f"database         : {host}")
        print(f"alembic says     : {revision or '(no alembic_version row)'}")
        print(f"code needs       : {HEAD}")
        print()

        missing = []
        for rev, table, column in EXPECTED:
            if table not in tables:
                print(f"  MISSING  table  {table}                (from {rev})")
                missing.append((rev, table, column))
                continue
            if column is None:
                print(f"  ok       table  {table}")
                continue
            cols = {c["name"] for c in insp.get_columns(table)}
            if column in cols:
                print(f"  ok       column {table}.{column}")
            else:
                print(f"  MISSING  column {table}.{column}   (from {rev})")
                missing.append((rev, table, column))

        print()
        if not missing:
            if revision != HEAD:
                print("Schema is complete, but alembic_version is not at head.")
                print(f"  Fix: alembic stamp {HEAD}")
                return 1
            print("Healthy — schema and alembic revision both match this code.")
            return 0

        if revision == HEAD:
            # The dangerous case: alembic believes it is done, so `upgrade head`
            # is a no-op and the API keeps failing. Rewind the marker to the last
            # revision that genuinely applied, then upgrade for real.
            behind = min(m[0] for m in missing)
            target = "c9e5c6644b35" if behind == "a1f4c7b20e91" else "a1f4c7b20e91"
            print("alembic_version claims head, but the schema does not have those objects.")
            print("This happens after `alembic stamp head`, or after restoring a dump")
            print("taken before the migration. `alembic upgrade head` alone will do nothing.")
            print()
            print("  Fix (rewind the marker, then migrate for real):")
            print(f"    alembic stamp {target}")
            print("    alembic upgrade head")
        else:
            print("The database is simply behind the code.")
            print()
            print("  Fix:")
            print("    alembic upgrade head")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
