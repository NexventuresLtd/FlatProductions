from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.deps import get_current_admin
from app.models.admin import Admin
from app.models.content import HeroImage
from app.models.items import GalleryItem, PortfolioItem, Service, TeamMember, Testimonial
from app.models.visit import VisitCounter

router = APIRouter(tags=["visits"])


@router.post("/api/visits")
async def track_visit(db: AsyncSession = Depends(get_db)) -> dict:
    counter = await db.get(VisitCounter, 1)
    if counter is None:
        counter = VisitCounter(id=1, count=0)
        db.add(counter)
    counter.count += 1
    await db.commit()
    return {"count": counter.count}


async def _count(db: AsyncSession, model) -> int:
    result = await db.execute(select(func.count()).select_from(model))
    return result.scalar_one()


@router.get("/api/admin/analytics/overview")
async def analytics_overview(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    counter = await db.get(VisitCounter, 1)
    return {
        "visits": counter.count if counter else 0,
        "heroSlides": await _count(db, HeroImage),
        "services": await _count(db, Service),
        "projects": await _count(db, PortfolioItem),
        "galleryImages": await _count(db, GalleryItem),
        "teamMembers": await _count(db, TeamMember),
        "testimonials": await _count(db, Testimonial),
    }
