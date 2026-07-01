import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.deps import get_current_admin
from app.models.admin import Admin
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageOut
from app.services.email_service import send_contact_autoreply, send_contact_notification, try_send

router = APIRouter(tags=["contact"])


async def _send_contact_emails(message_id: uuid.UUID) -> None:
    from app.core.database import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        message = await db.get(ContactMessage, message_id)
        if not message:
            return
        message.notified_studio = await try_send(send_contact_notification(message))
        message.notified_visitor = await try_send(send_contact_autoreply(message.email, message.full_name))
        await db.commit()


@router.post("/api/contact", response_model=ContactMessageOut)
async def submit_contact(
    payload: ContactMessageCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    # Hard cap on email volume: refuse duplicate submissions from the same
    # address in quick succession (accidental double-click, retries, spam).
    recent = await db.execute(
        select(ContactMessage.created_at)
        .where(ContactMessage.email == payload.email)
        .order_by(ContactMessage.created_at.desc())
        .limit(1)
    )
    last_sent_at = recent.scalar_one_or_none()
    if last_sent_at is not None:
        elapsed = (datetime.now(timezone.utc) - last_sent_at).total_seconds()
        if elapsed < settings.contact_cooldown_seconds:
            wait = int(settings.contact_cooldown_seconds - elapsed)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"You already sent a message recently — please wait {wait}s before sending another.",
            )

    message = ContactMessage(
        full_name=payload.fullName,
        email=payload.email,
        phone=payload.phone,
        service=payload.service,
        message=payload.message,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)

    background_tasks.add_task(_send_contact_emails, message.id)
    return message


@router.get("/api/admin/contact-messages", response_model=list[ContactMessageOut])
async def list_contact_messages(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ContactMessage).order_by(ContactMessage.created_at.desc()))
    return list(result.scalars().all())


@router.patch("/api/admin/contact-messages/{message_id}/read", response_model=ContactMessageOut)
async def mark_contact_message_read(
    message_id: uuid.UUID,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    message = await db.get(ContactMessage, message_id)
    if message:
        message.is_read = True
        await db.commit()
        await db.refresh(message)
    return message
