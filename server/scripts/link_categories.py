"""Relink portfolio/gallery items to category rows.

Every item stores its category as text. This script makes the content_categories
table agree with what the items actually use:

  * creates a row for any category items use that has no row yet
  * optionally reorders rows to follow the items (--reorder)
  * optionally deletes rows no item uses (--prune)

Run it when the two have drifted apart — for example if a category is missing
from the dashboard's Categories list, or the public filter tabs show categories
nobody created.

DRY RUN BY DEFAULT. Nothing is written until you pass --apply.

    python -m scripts.link_categories                          # show what would change
    python -m scripts.link_categories --apply                  # create missing rows
    python -m scripts.link_categories --apply --reorder        # ...and order them like the items
    python -m scripts.link_categories --apply --reorder --prune  # ...and drop unused rows

Only content_categories is ever written to. Portfolio and gallery items are read
but never modified, so no project or photo can be lost.
"""

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select  # noqa: E402

from app.core.database import get_sessionmaker  # noqa: E402
from app.models.items import ContentCategory, GalleryItem, PortfolioItem  # noqa: E402

# Portfolio tabs generated from video_url / bts_url — never real categories.
RESERVED = {"Video", "BTS", "video", "image"}


def _effective(item) -> str:
    """Mirror the frontend's getItemCategory(): fall back to the title when the
    category is blank or one of the reserved filter names."""
    category = (getattr(item, "category", None) or "").strip()
    if category and category not in RESERVED:
        return category
    return (getattr(item, "title", "") or "").strip()


async def _sync(db, kind: str, model, *, apply: bool, reorder: bool, prune: bool) -> None:
    items = list((await db.execute(select(model).order_by(model.order_index))).scalars().all())
    rows = list((await db.execute(
        select(ContentCategory).where(ContentCategory.kind == kind).order_by(ContentCategory.order_index)
    )).scalars().all())

    # Categories the content actually uses, in the order the items appear.
    used: list[str] = []
    for item in items:
        name = _effective(item)
        if name and name not in used:
            used.append(name)

    counts = {name: sum(1 for i in items if _effective(i) == name) for name in used}
    have = {r.name: r for r in rows}

    missing = [n for n in used if n not in have]
    unused = [r.name for r in rows if r.name not in counts]

    print(f"\n=== {kind} ===")
    print(f"  {len(items)} items, {len(rows)} category rows, {len(used)} categories in use")
    for name in used:
        mark = "ok " if name in have else "ADD"
        print(f"    [{mark}] {name}  ({counts[name]} item{'s' if counts[name] != 1 else ''})")
    for name in unused:
        print(f"    [{'DEL' if prune else 'keep'}] {name}  (0 items)")

    if not apply:
        return

    for name in missing:
        row = ContentCategory(kind=kind, name=name, order_index=len(rows))
        db.add(row)
        rows.append(row)
        have[name] = row

    if prune:
        for row in [r for r in rows if r.name in unused]:
            await db.delete(row)
            rows.remove(row)

    if reorder:
        # In-use categories first, in item order; anything kept but unused after.
        rank = {name: i for i, name in enumerate(used)}
        tail = len(used)
        for i, row in enumerate(sorted(rows, key=lambda r: (rank.get(r.name, tail), r.order_index))):
            row.order_index = i


async def run(apply: bool, reorder: bool, prune: bool) -> None:
    async with get_sessionmaker()() as db:
        await _sync(db, "portfolio", PortfolioItem, apply=apply, reorder=reorder, prune=prune)
        await _sync(db, "gallery", GalleryItem, apply=apply, reorder=reorder, prune=prune)
        if apply:
            await db.commit()
            print("\nApplied.")
            for kind in ("portfolio", "gallery"):
                names = (await db.execute(
                    select(ContentCategory.name).where(ContentCategory.kind == kind)
                    .order_by(ContentCategory.order_index)
                )).scalars().all()
                print(f"  {kind}: {' > '.join(names)}")
        else:
            print("\nDry run — nothing written. Re-run with --apply to make these changes.")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="write the changes (default: dry run)")
    ap.add_argument("--reorder", action="store_true", help="order categories to follow the items")
    ap.add_argument("--prune", action="store_true", help="delete category rows no item uses")
    args = ap.parse_args()
    asyncio.run(run(args.apply, args.reorder, args.prune))
