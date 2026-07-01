import uuid
from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content import (
    AboutChip,
    AboutSettings,
    AboutStat,
    Client,
    ClientLogo,
    ClientsSettings,
    ContactBackup,
    ContactInfoSettings,
    HeroImage,
    HeroSettings,
    PageHero,
)
from app.models.items import GalleryItem, PortfolioItem, Service, TeamMember, Testimonial
from app.services.seed_data import seed_all

PAGE_KEYS = ["about", "services", "portfolio", "gallery", "contact"]


def _uid(value: str | None) -> uuid.UUID:
    if value:
        try:
            return uuid.UUID(str(value))
        except ValueError:
            pass
    return uuid.uuid4()


async def _ordered(db: AsyncSession, model) -> list:
    result = await db.execute(select(model).order_by(model.order_index))
    return list(result.scalars().all())


# ─────────────────────────── Aggregate read ───────────────────────────


async def assemble_site_content(db: AsyncSession) -> dict:
    hero = await db.get(HeroSettings, 1)
    hero_images = await _ordered(db, HeroImage)
    about = await db.get(AboutSettings, 1)
    about_stats = await _ordered(db, AboutStat)
    about_chips = await _ordered(db, AboutChip)
    testimonials = await _ordered(db, Testimonial)
    services = await _ordered(db, Service)
    portfolio = await _ordered(db, PortfolioItem)
    clients_settings = await db.get(ClientsSettings, 1)
    clients = await _ordered(db, Client)
    client_logos = await _ordered(db, ClientLogo)
    team = await _ordered(db, TeamMember)
    gallery = await _ordered(db, GalleryItem)
    contact = await db.get(ContactInfoSettings, 1)
    page_heroes_result = await db.execute(select(PageHero))
    page_heroes = {ph.page_key: ph for ph in page_heroes_result.scalars().all()}

    return {
        "hero": {
            "title": hero.title if hero else "",
            "subtitle": hero.subtitle if hero else "",
            "images": [i.image_url for i in hero_images],
            "notes": [i.note for i in hero_images if i.note],
        },
        "about": {
            "heading": about.heading if about else "",
            "body": about.body if about else "",
            "history": about.history if about else None,
            "mission": about.mission if about else None,
            "vision": about.vision if about else None,
            "value": about.value if about else None,
            "image1": about.image1 if about else None,
            "image2": about.image2 if about else None,
            "image3": about.image3 if about else None,
            "image4": about.image4 if about else None,
            "stats": [{"value": s.value, "label": s.label} for s in about_stats],
            "chips": [c.text for c in about_chips],
        },
        "testimonials": [
            {"id": str(t.id), "name": t.name, "logoSrc": t.logo_src, "quote": t.quote} for t in testimonials
        ],
        "services": [
            {
                "id": str(s.id),
                "title": s.title,
                "description": s.description,
                "image": s.image,
                "extendedDescription": s.extended_description,
            }
            for s in services
        ],
        "portfolio": [
            {
                "id": str(p.id),
                "title": p.title,
                "image": p.image,
                "videoUrl": p.video_url,
                "btsUrl": p.bts_url,
                "description": p.description,
                "link": p.link,
                "serviceId": str(p.service_id) if p.service_id else None,
                "category": p.category,
            }
            for p in portfolio
        ],
        "clientsIntro": clients_settings.intro_text if clients_settings else "",
        "clients": [c.name for c in clients],
        "clientLogos": [c.logo_url for c in client_logos],
        "team": [
            {
                "id": str(m.id),
                "name": m.name,
                "role": m.role,
                "bio": m.bio,
                "photo": m.photo,
                "position": m.position,
            }
            for m in team
        ],
        "gallery": [{"src": g.src, "category": g.category} for g in gallery],
        "contact": {
            "phone": contact.phone if contact else "",
            "email": contact.email if contact else "",
            "address": contact.address if contact else "",
            "hours": contact.hours if contact else "",
            "whatsapp": contact.whatsapp if contact else "",
            "socials": {
                "instagram": contact.instagram_url if contact else "",
                "youtube": contact.youtube_url if contact else "",
                "linkedin": contact.linkedin_url if contact else "",
            },
        },
        "pageHeroes": {
            key: {
                "title": page_heroes[key].title if key in page_heroes else "",
                "image": page_heroes[key].image if key in page_heroes else "",
            }
            for key in PAGE_KEYS
        },
    }


# ─────────────────────────── Partial write ───────────────────────────


async def _replace_hero_images(db: AsyncSession, images: list[str], notes: list[str]) -> None:
    await db.execute(delete(HeroImage))
    for i, image_url in enumerate(images):
        note = notes[i] if i < len(notes) else None
        db.add(HeroImage(image_url=image_url, note=note, order_index=i))


async def _replace_about_stats(db: AsyncSession, stats: list[dict]) -> None:
    await db.execute(delete(AboutStat))
    for i, s in enumerate(stats):
        db.add(AboutStat(value=s.get("value", ""), label=s.get("label", ""), order_index=i))


async def _replace_about_chips(db: AsyncSession, chips: list[str]) -> None:
    await db.execute(delete(AboutChip))
    for i, text in enumerate(chips):
        db.add(AboutChip(text=text, order_index=i))


async def _replace_testimonials(db: AsyncSession, items: list[dict]) -> None:
    await db.execute(delete(Testimonial))
    for i, t in enumerate(items):
        db.add(
            Testimonial(
                id=_uid(t.get("id")), name=t.get("name", ""), logo_src=t.get("logoSrc"),
                quote=t.get("quote", ""), order_index=i,
            )
        )


async def _replace_services(db: AsyncSession, items: list[dict]) -> None:
    await db.execute(delete(Service))
    for i, s in enumerate(items):
        db.add(
            Service(
                id=_uid(s.get("id")), title=s.get("title", ""), description=s.get("description", ""),
                image=s.get("image"), extended_description=s.get("extendedDescription"), order_index=i,
            )
        )


async def _replace_portfolio(db: AsyncSession, items: list[dict]) -> None:
    await db.execute(delete(PortfolioItem))
    for i, p in enumerate(items):
        db.add(
            PortfolioItem(
                id=_uid(p.get("id")), title=p.get("title", ""), image=p.get("image"),
                video_url=p.get("videoUrl"), bts_url=p.get("btsUrl"), description=p.get("description"),
                link=p.get("link"), service_id=_uid(p["serviceId"]) if p.get("serviceId") else None,
                category=p.get("category"), order_index=i,
            )
        )


async def _replace_clients(db: AsyncSession, names: list[str]) -> None:
    await db.execute(delete(Client))
    for i, name in enumerate(names):
        db.add(Client(name=name, order_index=i))


async def _replace_client_logos(db: AsyncSession, logos: list[str]) -> None:
    await db.execute(delete(ClientLogo))
    for i, logo_url in enumerate(logos):
        db.add(ClientLogo(logo_url=logo_url, order_index=i))


async def _replace_team(db: AsyncSession, items: list[dict]) -> None:
    await db.execute(delete(TeamMember))
    for i, m in enumerate(items):
        db.add(
            TeamMember(
                id=_uid(m.get("id")), name=m.get("name", ""), role=m.get("role", ""), bio=m.get("bio"),
                photo=m.get("photo"), position=m.get("position", "50% 20%"), order_index=i,
            )
        )


async def _replace_gallery(db: AsyncSession, items: list[dict]) -> None:
    await db.execute(delete(GalleryItem))
    for i, g in enumerate(items):
        db.add(GalleryItem(src=g.get("src", ""), category=g.get("category", "Event Photography"), order_index=i))


async def apply_partial_update(db: AsyncSession, payload: dict) -> None:
    if "hero" in payload:
        hero_payload = payload["hero"] or {}
        hero = await db.get(HeroSettings, 1)
        if hero is None:
            hero = HeroSettings(id=1, title="", subtitle="")
            db.add(hero)
        if "title" in hero_payload:
            hero.title = hero_payload["title"]
        if "subtitle" in hero_payload:
            hero.subtitle = hero_payload["subtitle"]
        if "images" in hero_payload or "notes" in hero_payload:
            await _replace_hero_images(db, hero_payload.get("images", []), hero_payload.get("notes", []))

    if "about" in payload:
        about_payload = payload["about"] or {}
        about = await db.get(AboutSettings, 1)
        if about is None:
            about = AboutSettings(id=1, heading="", body="")
            db.add(about)
        for field in ("heading", "body", "history", "mission", "vision", "value", "image1", "image2", "image3", "image4"):
            if field in about_payload:
                setattr(about, field, about_payload[field])
        if "stats" in about_payload:
            await _replace_about_stats(db, about_payload["stats"] or [])
        if "chips" in about_payload:
            await _replace_about_chips(db, about_payload["chips"] or [])

    if "testimonials" in payload:
        await _replace_testimonials(db, payload["testimonials"] or [])

    if "services" in payload:
        await _replace_services(db, payload["services"] or [])

    if "portfolio" in payload:
        await _replace_portfolio(db, payload["portfolio"] or [])

    if "clientsIntro" in payload:
        clients_settings = await db.get(ClientsSettings, 1)
        if clients_settings is None:
            clients_settings = ClientsSettings(id=1, intro_text=payload["clientsIntro"])
            db.add(clients_settings)
        else:
            clients_settings.intro_text = payload["clientsIntro"]

    if "clients" in payload:
        await _replace_clients(db, payload["clients"] or [])

    if "clientLogos" in payload:
        await _replace_client_logos(db, payload["clientLogos"] or [])

    if "team" in payload:
        await _replace_team(db, payload["team"] or [])

    if "gallery" in payload:
        await _replace_gallery(db, payload["gallery"] or [])

    if "contact" in payload:
        contact_payload = payload["contact"] or {}
        contact = await db.get(ContactInfoSettings, 1)
        if contact is None:
            contact = ContactInfoSettings(id=1, phone="", email="", address="", hours="", whatsapp="")
            db.add(contact)
        for field in ("phone", "email", "address", "hours", "whatsapp"):
            if field in contact_payload:
                setattr(contact, field, contact_payload[field])
        socials = contact_payload.get("socials") or {}
        if "instagram" in socials:
            contact.instagram_url = socials["instagram"]
        if "youtube" in socials:
            contact.youtube_url = socials["youtube"]
        if "linkedin" in socials:
            contact.linkedin_url = socials["linkedin"]

    if "pageHeroes" in payload:
        for page_key, ph_payload in (payload["pageHeroes"] or {}).items():
            if page_key not in PAGE_KEYS:
                continue
            result = await db.execute(select(PageHero).where(PageHero.page_key == page_key))
            page_hero = result.scalar_one_or_none()
            if page_hero is None:
                page_hero = PageHero(
                    page_key=page_key, title=ph_payload.get("title", ""), image=ph_payload.get("image", "")
                )
                db.add(page_hero)
            else:
                if "title" in ph_payload:
                    page_hero.title = ph_payload["title"]
                if "image" in ph_payload:
                    page_hero.image = ph_payload["image"]

    await db.commit()


# ─────────────────────────── Reset / backup / restore ───────────────────────────

_CONTENT_TABLES = [
    HeroImage, HeroSettings, AboutStat, AboutChip, AboutSettings, Testimonial, Service, PortfolioItem,
    Client, ClientLogo, ClientsSettings, TeamMember, GalleryItem, ContactInfoSettings, PageHero,
]


async def reset_to_defaults(db: AsyncSession) -> dict:
    for model in _CONTENT_TABLES:
        await db.execute(delete(model))
    await db.commit()
    await seed_all()
    return await assemble_site_content(db)


async def save_backup(db: AsyncSession, admin_id: uuid.UUID) -> None:
    snapshot = await assemble_site_content(db)
    await db.execute(delete(ContactBackup))
    db.add(ContactBackup(admin_id=admin_id, snapshot=snapshot, created_at=datetime.now(timezone.utc)))
    await db.commit()


async def get_backup(db: AsyncSession) -> dict | None:
    result = await db.execute(select(ContactBackup).order_by(ContactBackup.created_at.desc()).limit(1))
    backup = result.scalar_one_or_none()
    return backup.snapshot if backup else None


async def backup_exists(db: AsyncSession) -> bool:
    result = await db.execute(select(ContactBackup.id).limit(1))
    return result.scalar_one_or_none() is not None


async def restore_backup(db: AsyncSession) -> dict | None:
    snapshot = await get_backup(db)
    if snapshot is None:
        return None
    await apply_partial_update(db, snapshot)
    return await assemble_site_content(db)
