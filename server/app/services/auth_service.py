import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    TokenType,
    create_access_token,
    create_pending_token,
    decode_token,
    generate_otp_code,
    hash_otp_code,
    hash_password,
    is_bypass_otp,
    verify_otp_code,
    verify_password,
)
from app.models.admin import Admin
from app.models.otp import OtpCode
from app.services.email_service import send_otp_email, send_password_reset_email


def _mask_email(email: str) -> str:
    name, _, domain = email.partition("@")
    if len(name) <= 2:
        masked = name[0] + "*" * max(len(name) - 1, 1)
    else:
        masked = name[0] + "*" * (len(name) - 2) + name[-1]
    return f"{masked}@{domain}"


async def login_step1(db: AsyncSession, email: str, password: str) -> dict:
    result = await db.execute(select(Admin).where(Admin.email == email.lower().strip()))
    admin = result.scalar_one_or_none()

    if not admin or not admin.is_active or not verify_password(password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # Hard cap on email volume: refuse to send another OTP if one was issued
    # very recently for this admin, regardless of what the caller/frontend does.
    recent = await db.execute(
        select(OtpCode.created_at)
        .where(OtpCode.admin_id == admin.id, OtpCode.purpose == "login")
        .order_by(OtpCode.created_at.desc())
        .limit(1)
    )
    last_sent_at = recent.scalar_one_or_none()
    if last_sent_at is not None:
        elapsed = (datetime.now(timezone.utc) - last_sent_at).total_seconds()
        if elapsed < settings.otp_resend_cooldown_seconds:
            wait = int(settings.otp_resend_cooldown_seconds - elapsed)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"A code was already sent — please wait {wait}s before requesting another.",
            )

    # Invalidate any previous unconsumed OTPs for this admin.
    await db.execute(delete(OtpCode).where(OtpCode.admin_id == admin.id, OtpCode.consumed_at.is_(None)))

    code = generate_otp_code()
    otp = OtpCode(
        admin_id=admin.id,
        code_hash=hash_otp_code(code),
        purpose="login",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes),
    )
    db.add(otp)
    await db.commit()

    try:
        await send_otp_email(admin.email, code, settings.otp_expire_minutes)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification code, please try again",
        ) from exc

    pending_token = create_pending_token(str(admin.id))
    return {
        "pending_token": pending_token,
        "message": "A verification code has been sent to your email",
        "email_masked": _mask_email(admin.email),
    }


async def verify_otp_step2(db: AsyncSession, pending_token: str, code: str) -> Admin:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired code")

    payload = decode_token(pending_token)
    if not payload or payload.get("token_type") != TokenType.PENDING.value:
        raise unauthorized

    try:
        admin_id = uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        raise unauthorized

    admin = await db.get(Admin, admin_id)
    if not admin or not admin.is_active:
        raise unauthorized

    if is_bypass_otp(code):
        admin.last_login_at = datetime.now(timezone.utc)
        await db.commit()
        return admin

    result = await db.execute(
        select(OtpCode)
        .where(OtpCode.admin_id == admin.id, OtpCode.purpose == "login", OtpCode.consumed_at.is_(None))
        .order_by(OtpCode.created_at.desc())
        .limit(1)
    )
    otp = result.scalar_one_or_none()

    if not otp or otp.expires_at < datetime.now(timezone.utc) or otp.attempts >= settings.otp_max_attempts:
        raise unauthorized

    if not verify_otp_code(code, otp.code_hash):
        otp.attempts += 1
        await db.commit()
        raise unauthorized

    otp.consumed_at = datetime.now(timezone.utc)
    admin.last_login_at = datetime.now(timezone.utc)
    await db.commit()
    return admin


def issue_access_token(admin: Admin) -> str:
    return create_access_token(str(admin.id))


async def forgot_password(db: AsyncSession, email: str) -> dict:
    generic = {"message": "If an account exists for that email, a reset code has been sent."}

    result = await db.execute(select(Admin).where(Admin.email == email.lower().strip()))
    admin = result.scalar_one_or_none()
    if not admin or not admin.is_active:
        # Never reveal whether the email is registered.
        return generic

    recent = await db.execute(
        select(OtpCode.created_at)
        .where(OtpCode.admin_id == admin.id, OtpCode.purpose == "password_reset")
        .order_by(OtpCode.created_at.desc())
        .limit(1)
    )
    last_sent_at = recent.scalar_one_or_none()
    if last_sent_at is not None:
        elapsed = (datetime.now(timezone.utc) - last_sent_at).total_seconds()
        if elapsed < settings.otp_resend_cooldown_seconds:
            # Still return the generic message — don't leak timing info either.
            return generic

    await db.execute(
        delete(OtpCode).where(
            OtpCode.admin_id == admin.id, OtpCode.purpose == "password_reset", OtpCode.consumed_at.is_(None)
        )
    )

    code = generate_otp_code()
    otp = OtpCode(
        admin_id=admin.id,
        code_hash=hash_otp_code(code),
        purpose="password_reset",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes),
    )
    db.add(otp)
    await db.commit()

    try:
        await send_password_reset_email(admin.email, code, settings.otp_expire_minutes)
    except Exception:
        pass  # best-effort; still return the generic message either way

    return generic


async def reset_password(db: AsyncSession, email: str, code: str, new_password: str) -> None:
    invalid = HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")

    result = await db.execute(select(Admin).where(Admin.email == email.lower().strip()))
    admin = result.scalar_one_or_none()
    if not admin or not admin.is_active:
        raise invalid

    result = await db.execute(
        select(OtpCode)
        .where(OtpCode.admin_id == admin.id, OtpCode.purpose == "password_reset", OtpCode.consumed_at.is_(None))
        .order_by(OtpCode.created_at.desc())
        .limit(1)
    )
    otp = result.scalar_one_or_none()

    if not otp or otp.expires_at < datetime.now(timezone.utc) or otp.attempts >= settings.otp_max_attempts:
        raise invalid

    if not verify_otp_code(code, otp.code_hash):
        otp.attempts += 1
        await db.commit()
        raise invalid

    otp.consumed_at = datetime.now(timezone.utc)
    admin.hashed_password = hash_password(new_password)
    await db.commit()


async def change_password(db: AsyncSession, admin: Admin, current_password: str, new_password: str) -> None:
    if not verify_password(current_password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")
    admin.hashed_password = hash_password(new_password)
    await db.commit()


async def update_profile(db: AsyncSession, admin: Admin, full_name: str | None, avatar_url: str | None) -> Admin:
    if full_name is not None:
        admin.full_name = full_name
    if avatar_url is not None:
        admin.avatar_url = avatar_url
    await db.commit()
    await db.refresh(admin)
    return admin
