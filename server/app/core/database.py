from collections.abc import AsyncGenerator
from functools import lru_cache
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# The engine used to be built at import time, which meant importing anything from
# this module — including Base, which every model and alembic/env.py needs — first
# constructed Settings and therefore required a complete .env. Building it lazily
# lets migrations run on a host that only has a database URL.
@lru_cache(maxsize=1)
def get_engine():
    from app.core.config import settings

    return create_async_engine(settings.database_url, echo=False, future=True)


@lru_cache(maxsize=1)
def get_sessionmaker() -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(bind=get_engine(), expire_on_commit=False, class_=AsyncSession)


def __getattr__(name: str) -> Any:
    """Keep `from app.core.database import engine / AsyncSessionLocal` working.

    PEP 562 module-level __getattr__: these resolve on first access instead of at
    import, so callers that genuinely need a database connection still get one,
    while importing Base stays free of configuration.
    """
    if name == "engine":
        return get_engine()
    if name == "AsyncSessionLocal":
        return get_sessionmaker()
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with get_sessionmaker()() as session:
        yield session
