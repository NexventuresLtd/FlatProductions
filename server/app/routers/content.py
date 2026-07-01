from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.deps import get_current_admin
from app.models.admin import Admin
from app.services import content_service

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("")
async def get_content(db: AsyncSession = Depends(get_db)) -> dict:
    return await content_service.assemble_site_content(db)


@router.put("")
async def update_content(
    payload: dict[str, Any],
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    await content_service.apply_partial_update(db, payload)
    return await content_service.assemble_site_content(db)


@router.post("/reset")
async def reset_content(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await content_service.reset_to_defaults(db)


@router.post("/backup", status_code=status.HTTP_204_NO_CONTENT)
async def create_backup(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> None:
    await content_service.save_backup(db, current_admin.id)


@router.get("/backup/exists")
async def check_backup_exists(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    return {"exists": await content_service.backup_exists(db)}


@router.get("/backup")
async def read_backup(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    snapshot = await content_service.get_backup(db)
    if snapshot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No backup available")
    return snapshot


@router.post("/restore")
async def restore_content(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    restored = await content_service.restore_backup(db)
    if restored is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No backup available")
    return restored
