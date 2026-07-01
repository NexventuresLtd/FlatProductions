"""Shared seed-data functions - populate the DB with the exact DEFAULT_SITE_CONTENT
values from flatproduction/src/store/contentStore.ts. Each seed_x() is idempotent
(skips if data already exists), so this module is used both by scripts/seed.py
(initial setup) and content_service.reset_to_defaults() (admin-triggered reset,
which deletes rows first so these functions re-populate them).
"""

from sqlalchemy import func, select

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models import (
    AboutChip,
    AboutSettings,
    AboutStat,
    Admin,
    Client,
    ClientLogo,
    ClientsSettings,
    ContactInfoSettings,
    GalleryItem,
    HeroImage,
    HeroSettings,
    PageHero,
    PortfolioItem,
    Service,
    TeamMember,
    Testimonial,
    VisitCounter,
)


async def _count(db, model) -> int:
    result = await db.execute(select(func.count()).select_from(model))
    return result.scalar_one()


async def seed_hero(db) -> None:
    if await db.get(HeroSettings, 1):
        return
    db.add(HeroSettings(id=1, title="Flat Productions", subtitle="Creative Solutions"))

    images = ["/photo12.jpg", "/photo6.jpg", "/photo3.jpg", "/photo10.jpg", "/photo5.jpg"]
    notes = [
        "Cinematic light, real moments, and stories that linger.",
        "Live coverage shaped to feel immediate and polished.",
        "Creative visuals built to make brands feel alive.",
    ]
    for i, image_url in enumerate(images):
        db.add(HeroImage(image_url=image_url, note=notes[i] if i < len(notes) else None, order_index=i))
    await db.commit()


async def seed_about(db) -> None:
    if await db.get(AboutSettings, 1):
        return
    db.add(
        AboutSettings(
            id=1,
            heading="Where Light Becomes Memory",
            body=(
                "Every frame is crafted with patience, emotion, and intent, turning ordinary scenes into "
                "cinematic moments that feel personal, timeless, and alive."
            ),
            history=(
                "FLAT PRODUCTION LIMITED is a Rwandan-based company with 8 years of comprehensive experience "
                "and a full portfolio of services. Since 2018, we have delivered event live streaming and feed, "
                "photography and video production, web design, content creation, social media management, "
                "graphic design, printing, branding, event and entertainment coverage, and documentary production."
            ),
            mission=(
                "To transform ideas, emotions, and moments into unforgettable visuals and digital experiences "
                "that help people and brands connect with purpose."
            ),
            vision=(
                "To become East Africa's most trusted creative production partner for stories that shape "
                "culture, business growth, and meaningful human impact."
            ),
            value=(
                "Authenticity, excellence, teamwork, and innovation guide everything we produce from live "
                "events and documentaries to digital campaigns and branding."
            ),
            image1="/photo3.jpg",
            image2="/photo6.jpg",
            image3="/live1.jpeg",
            image4="/photo10.jpg",
        )
    )
    stats = [
        ("8+", "Years Active"),
        ("200+", "Projects Delivered"),
        ("50+", "Clients Served"),
    ]
    for i, (value, label) in enumerate(stats):
        db.add(AboutStat(value=value, label=label, order_index=i))

    chips = ["Photography", "Video Production", "Live Streaming", "Branding", "Web Design", "Documentary"]
    for i, text in enumerate(chips):
        db.add(AboutChip(text=text, order_index=i))
    await db.commit()


async def seed_testimonials(db) -> None:
    if await _count(db, Testimonial):
        return
    testimonials = [
        ("MTN Rwanda", "/mtn.png", "Flat Production delivered event visuals and digital storytelling that elevated our customer engagement campaigns."),
        ("Engen Rwanda", "/engen.png", "Their livestream and content team managed high-pressure launches smoothly and produced quality media in real time."),
        ("Inyange Industries", "/inyange.jpg", "From photography to post-production, they helped us communicate our brand story with clarity and premium quality."),
        ("NBG", "/nbg.jpg", "We trusted Flat Production for documentary storytelling and campaign content, and the outcome was impactful and authentic."),
    ]
    for i, (name, logo, quote) in enumerate(testimonials):
        db.add(Testimonial(name=name, logo_src=logo, quote=quote, order_index=i))
    await db.commit()


async def seed_services(db) -> list[Service]:
    if await _count(db, Service):
        result = await db.execute(select(Service).order_by(Service.order_index))
        return list(result.scalars().all())

    services = [
        ("PHOTOGRAPHY & VIDEO PRODUCTION", "Delivering outstanding excellence in video production and photography: capturing moments, crafting stories, creating memories.", "/photo1.jpg", "From corporate events to weddings and product launches, we capture every visual moment with precision equipment and a storytelling eye. Our edits are polished, emotive, and built to work across every screen."),
        ("LIVE STREAMING & FEED", "Lets you interact with your audience in real time with a video feed, chat, reactions, and more.", "/live1.jpeg", "We deploy professional multi-camera streaming rigs for any scale of event — from intimate church services to large-scale conferences. Low-latency, stable, with dedicated technical support on-site."),
        ("WEBSITE DESIGN", "You are best in your work; let us help you show world your excellent achievements digitally.", "/web.jpg", "We build fast, clean, and modern websites that make your brand look credible online. Every site is mobile-optimized, SEO-ready, and designed to convert visitors into real clients."),
        ("DESIGN - PRINTING & BRANDING", "It's hard to build and easy to destroy by not branding your excellent work; we are here to express your great work through stunning branding.", "/graphy33.jpg", "Your brand should be recognizable everywhere. We create logos, typography systems, social graphics, and print-ready artwork that hold together across every touchpoint."),
        ("EVENT & ENTERTAINMENT", "Here to help differentiate your event through outstanding creativity.", "/photo5.jpg", "Whether it's a concert, gala, or product launch, we capture the energy and emotion with high-quality cameras and a genuine eye for the moments your guests will remember."),
        ("DOCUMENTARY", "A better way of storytelling through interviewing, research, reality filming, narration, and production excellence through experience.", "/photo12.jpg", "Documentaries require patience, curiosity, and craft. We combine deep research, on-location filming, and precise editing to produce pieces that feel honest and compelling."),
    ]
    created = []
    for i, (title, description, image, extended) in enumerate(services):
        svc = Service(title=title, description=description, image=image, extended_description=extended, order_index=i)
        db.add(svc)
        created.append(svc)
    await db.commit()
    for svc in created:
        await db.refresh(svc)
    return created


async def seed_portfolio(db, services: list[Service]) -> None:
    if await _count(db, PortfolioItem):
        return
    by_title = {s.title.split(" & ")[0].split(" ")[0].upper(): s.id for s in services}
    portfolio = [
        ("Photography", "/photo1.jpg", "Photography", None, None, "We capture stunning visuals that tell your unique story with precision and artistic flair."),
        ("Video Production", "/2I1A0386.JPG.jpeg", "Video Production", "https://youtu.be/RjXqY31jpy0", "https://youtu.be/DHR85WBk4tY", "We deliver high-end video production services tailored for commercials, events, and cinematic projects."),
        ("Live Streaming", "/2I1A0403.JPG.jpeg", "Live Streaming", "https://youtu.be/de6oWk6vGlM", "https://youtu.be/zWTFpxzQaes", "We provide professional multi-camera live streaming solutions to connect you with a global audience instantly."),
        ("Web & Digital", "/web.jpg", "Web & Digital", None, None, "We offer comprehensive digital strategies including web design, development, and online marketing solutions."),
        ("Branding", "/graphy33.jpg", "Branding", None, None, "We create memorable brand identities that resonate deeply with your target market and stand out."),
        ("Documentary", "/photo12.jpg", "Documentary", None, None, "We specialize in in-depth documentary filmmaking that brings important real-world stories to light."),
    ]
    for i, (title, image, category, video_url, bts_url, description) in enumerate(portfolio):
        db.add(
            PortfolioItem(
                title=title, image=image, link="#", category=category,
                video_url=video_url, bts_url=bts_url, description=description, order_index=i,
            )
        )
    await db.commit()


async def seed_clients(db) -> None:
    if await db.get(ClientsSettings, 1):
        return
    db.add(
        ClientsSettings(
            id=1,
            intro_text=(
                "We work with brands, organizations, and creators who want visuals that feel sharp, "
                "memorable, and full of character. Every project is tailored to match your message, "
                "audience, and moment."
            ),
        )
    )
    for i, name in enumerate(["Corporate", "Weddings", "Events", "Non-profits"]):
        db.add(Client(name=name, order_index=i))
    for i, logo in enumerate(["/mtn.png", "/engen.png", "/inyange.jpg", "/nbg.jpg"]):
        db.add(ClientLogo(logo_url=logo, order_index=i))
    await db.commit()


async def seed_team(db) -> None:
    if await _count(db, TeamMember):
        return
    team = [
        ("KADAffI PRO", "Ceo & Founder", "Leads the creative direction and keeps every project focused, sharp, and client-centered.", "/kadaff.jpg", "50% 18%"),
        ("Kelly", "Graphics Designer", "Shapes visual identities, layouts, and brand assets with a clean, modern style.", "/ike.jpg", "50% 20%"),
        ("Chancelline niyotugendana", "Secretary & photographer", "Keeps the studio organized while capturing moments with a calm eye for detail.", "/chance.jpg", "50% 22%"),
        ("anura", "Intern", "Supports the team across shoots, edits, and day-to-day production work.", "/chelsea.jpg", "50% 18%"),
        ("ishimwe samuel kelly", "GRAPHICS DESIGNER", "Brings bold concepts to life through graphics, branding, and polished design details.", "/onekelly.jpg", "50% 20%"),
    ]
    for i, (name, role, bio, photo, position) in enumerate(team):
        db.add(TeamMember(name=name, role=role, bio=bio, photo=photo, position=position, order_index=i))
    await db.commit()


async def seed_gallery(db) -> None:
    if await _count(db, GalleryItem):
        return
    gallery = [
        ("/photo1.jpg", "Advertising Photography"),
        ("/photo2.jpg", "Portrait Photography"),
        ("/photo3.jpg", "Portrait Photography"),
        ("/photo4.jpg", "Event Photography"),
        ("/photo5.jpg", "Advertising Photography"),
        ("/photo6.jpg", "Event Photography"),
        ("/photo8.jpg", "Event Photography"),
        ("/photo9.jpg", "Portrait Photography"),
        ("/photo10.jpg", "Portrait Photography"),
        ("/photo12.jpg", "Event Photography"),
        ("/photo14.jpg", "Event Photography"),
        ("/live1.jpeg", "Event Photography"),
        ("/live2.jpeg", "Event Photography"),
        ("/web.jpg", "Advertising Photography"),
        ("/graphy33.jpg", "Advertising Photography"),
        ("/iwacu1.jpg", "Event Photography"),
        ("/2I1A0386.JPG.jpeg", "Behind The Scenes"),
        ("/2I1A0403.JPG.jpeg", "Behind The Scenes"),
        ("/2I1A0407.JPG.jpeg", "Behind The Scenes"),
        ("/2I1A0410.JPG.jpeg", "Behind The Scenes"),
        ("/MARR0034.JPG", "Wedding Photography"),
        ("/MARR0039.JPG", "Wedding Photography"),
        ("/MARR0058.JPG", "Wedding Photography"),
    ]
    for i, (src, category) in enumerate(gallery):
        db.add(GalleryItem(src=src, category=category, order_index=i))
    await db.commit()


async def seed_contact_info(db) -> None:
    if await db.get(ContactInfoSettings, 1):
        return
    db.add(
        ContactInfoSettings(
            id=1,
            phone="+250 781 691 713",
            email="info@flatproduction.rw",
            address="TCB house, KN 4 Avenue, Kigali, Rwanda",
            hours="Mon – Sat, 8:00 AM – 6:00 PM",
            whatsapp="250781691713",
            instagram_url="https://instagram.com",
            youtube_url="https://youtube.com",
            linkedin_url="https://linkedin.com",
        )
    )
    await db.commit()


async def seed_page_heroes(db) -> None:
    if await _count(db, PageHero):
        return
    page_heroes = [
        ("about", "Real Moments.\nBold Stories.\nTimeless Impact.", "/photo12.jpg"),
        ("services", "Creative services built to help your brand stand out.", "/live2.jpeg"),
        ("portfolio", "Our Work", "/photo1.jpg"),
        ("gallery", "Visual Stories", "/photo3.jpg"),
        ("contact", "Let's Create Something Extraordinary", "/live2.jpeg"),
    ]
    for page_key, title, image in page_heroes:
        db.add(PageHero(page_key=page_key, title=title, image=image))
    await db.commit()


async def seed_visit_counter(db) -> None:
    if await db.get(VisitCounter, 1):
        return
    db.add(VisitCounter(id=1, count=0))
    await db.commit()


async def seed_admin(db) -> None:
    existing = await db.execute(select(Admin).where(Admin.email == settings.seed_admin_email))
    if existing.scalar_one_or_none():
        return
    db.add(
        Admin(
            email=settings.seed_admin_email,
            hashed_password=hash_password(settings.seed_admin_password),
            full_name="Studio Admin",
            is_active=True,
        )
    )
    await db.commit()


async def seed_all() -> None:
    async with AsyncSessionLocal() as db:
        await seed_hero(db)
        await seed_about(db)
        await seed_testimonials(db)
        services = await seed_services(db)
        await seed_portfolio(db, services)
        await seed_clients(db)
        await seed_team(db)
        await seed_gallery(db)
        await seed_contact_info(db)
        await seed_page_heroes(db)
        await seed_visit_counter(db)
        await seed_admin(db)
