"""One-off, idempotent content arrangement update.

The seed functions in app/services/seed_data.py only run on an empty table, so a
database that was seeded before this change keeps the old service/portfolio order
and has no Podcast entries. This script brings an already-seeded database in line
with the current defaults:

  * services   — reorders to the arrangement in DEFAULT_SITE_CONTENT and adds PODCAST
  * portfolio  — reorders, renames "Web & Digital" to "Podcast", and adds the
                 "Event & Entertainment" and "Behind The Scenes" projects
  * about chips — adds "Podcast"

Safe to run repeatedly. Usage: python -m scripts.apply_arrangement
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select  # noqa: E402

from app.core.database import AsyncSessionLocal  # noqa: E402
from app.models.content import AboutChip  # noqa: E402
from app.models.items import PortfolioItem, Service  # noqa: E402

SERVICE_ORDER = [
    "EVENT & ENTERTAINMENT",
    "DESIGN - PRINTING & BRANDING",
    "PHOTOGRAPHY & VIDEO PRODUCTION",
    "LIVE STREAMING & FEED",
    "PODCAST",
    "DOCUMENTARY",
    "WEBSITE DESIGN",
]

NEW_SERVICES = {
    "PODCAST": dict(
        description=(
            "Full podcast production — multi-camera studio recording, clean audio, "
            "and social-ready episode cuts."
        ),
        image="/live2.jpeg",
        extended_description=(
            "We handle the whole podcast pipeline: studio or on-location setup, "
            "multi-camera video, broadcast-quality audio capture and mixing, episode "
            "editing, cover art, and vertical clips cut for Instagram, TikTok, and "
            "YouTube Shorts."
        ),
    ),
}

# Old title -> new title. "Web & Digital" becomes the Podcast project so its
# ordering/links survive rather than being deleted and recreated.
PORTFOLIO_RENAMES = {
    "Web & Digital": dict(
        title="Podcast",
        category="Podcast",
        image="/live2.jpeg",
        description=(
            "We produce full podcast episodes with multi-camera video, clean audio, "
            "and social-ready cuts."
        ),
    ),
}

PORTFOLIO_ORDER = [
    "Documentary",
    "Video Production",
    "Event & Entertainment",
    "Live Streaming",
    "Podcast",
    "Branding",
    "Behind The Scenes",
    "Photography",
]

# "Behind The Scenes" is spelled out rather than "BTS" because the portfolio page
# reserves "BTS" for the tab derived from bts_url and would render two of them.
NEW_PORTFOLIO = {
    "Event & Entertainment": dict(
        image="/photo5.jpg",
        category="Event & Entertainment",
        description=(
            "We cover concerts, galas, and launches with the energy and detail that "
            "make an event worth reliving."
        ),
    ),
    "Behind The Scenes": dict(
        image="/2I1A0407.JPG.jpeg",
        category="Behind The Scenes",
        description=(
            "We document the crew, the gear, and the craft that goes into every "
            "production we deliver."
        ),
    ),
}


def _reindex(rows, order: list[str], key) -> None:
    """Renumber order_index so titles in `order` come first, in that order.
    Anything not listed keeps its relative order and lands after them."""
    rank = {title: i for i, title in enumerate(order)}
    tail = len(order)
    ordered = sorted(rows, key=lambda r: (rank.get(key(r), tail), r.order_index))
    for i, row in enumerate(ordered):
        row.order_index = i


async def run() -> None:
    async with AsyncSessionLocal() as db:
        # ── services ────────────────────────────────────────────────
        services = list((await db.execute(select(Service))).scalars().all())
        have = {s.title for s in services}
        for title, spec in NEW_SERVICES.items():
            if title not in have:
                svc = Service(title=title, order_index=len(services), **spec)
                db.add(svc)
                services.append(svc)
                print(f"  + service {title!r}")
        _reindex(services, SERVICE_ORDER, lambda s: s.title)

        # ── portfolio ───────────────────────────────────────────────
        items = list((await db.execute(select(PortfolioItem))).scalars().all())
        for item in items:
            spec = PORTFOLIO_RENAMES.get(item.title)
            if spec:
                print(f"  ~ portfolio {item.title!r} -> {spec['title']!r}")
                for field, value in spec.items():
                    setattr(item, field, value)
        have = {p.title for p in items}
        for title, spec in NEW_PORTFOLIO.items():
            if title not in have:
                pf = PortfolioItem(title=title, link="#", order_index=len(items), **spec)
                db.add(pf)
                items.append(pf)
                print(f"  + portfolio {title!r}")
        _reindex(items, PORTFOLIO_ORDER, lambda p: p.title)

        # ── about chips ─────────────────────────────────────────────
        chips = list((await db.execute(select(AboutChip))).scalars().all())
        if not any(c.text == "Podcast" for c in chips):
            db.add(AboutChip(text="Podcast", order_index=len(chips)))
            print("  + chip 'Podcast'")

        await db.commit()
        print("Arrangement applied.")


if __name__ == "__main__":
    asyncio.run(run())
