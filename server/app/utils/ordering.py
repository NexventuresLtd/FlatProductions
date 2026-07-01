from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession


async def next_order_index(db: AsyncSession, model) -> int:
    result = await db.execute(select(model.order_index).order_by(model.order_index.desc()).limit(1))
    highest = result.scalar_one_or_none()
    return (highest + 1) if highest is not None else 0


async def reorder_by_id_list(db: AsyncSession, model, ordered_ids: list) -> None:
    """Rewrites order_index sequentially to match the given id order,
    mirroring the frontend's move(arr, from, to) splice semantics."""
    for index, item_id in enumerate(ordered_ids):
        await db.execute(update(model).where(model.id == item_id).values(order_index=index))
    await db.commit()
