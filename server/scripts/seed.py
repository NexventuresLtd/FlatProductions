"""CLI entrypoint for the idempotent seed functions in app/services/seed_data.py.

Usage: python -m scripts.seed
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.seed_data import seed_all  # noqa: E402


async def run() -> None:
    await seed_all()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(run())
