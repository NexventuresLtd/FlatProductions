import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import hash_password
from app.deps import get_current_admin
from app.models.admin import Admin
from app.schemas.auth import (
    AdminOut,
    AdminTeamOut,
    InviteAdminRequest,
    LoginPendingResponse,
    LoginRequest,
    OtpVerifyRequest,
    TokenResponse,
)
from app.services.auth_service import issue_access_token, login_step1, verify_otp_step2
from app.services.email_service import send_admin_invite_email

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginPendingResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await login_step1(db, payload.email, payload.password)


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: OtpVerifyRequest, db: AsyncSession = Depends(get_db)):
    admin = await verify_otp_step2(db, payload.pending_token, payload.code)
    token = issue_access_token(admin)
    return TokenResponse(access_token=token, admin=AdminOut.model_validate(admin))


@router.get("/me", response_model=AdminOut)
async def me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin


@router.post("/invite", response_model=AdminTeamOut)
async def invite_admin(
    payload: InviteAdminRequest,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(Admin).where(Admin.email == payload.email.lower().strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An admin with this email already exists")

    new_admin = Admin(
        email=payload.email.lower().strip(),
        hashed_password=hash_password(payload.temp_password),
        full_name=payload.full_name,
        created_by_admin_id=current_admin.id,
    )
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)

    try:
        await send_admin_invite_email(new_admin.email, payload.temp_password, current_admin.email)
    except Exception:
        pass  # invite email is best-effort; the account still exists

    return new_admin


@router.get("/team", response_model=list[AdminTeamOut])
async def list_team(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Admin).order_by(Admin.created_at))
    return list(result.scalars().all())


@router.delete("/team/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_admin(
    admin_id: uuid.UUID,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    if admin_id == current_admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot deactivate your own account")

    target = await db.get(Admin, admin_id)
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")

    target.is_active = False
    await db.commit()
