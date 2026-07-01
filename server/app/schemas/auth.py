import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginPendingResponse(BaseModel):
    pending_token: str
    message: str
    email_masked: str


class OtpVerifyRequest(BaseModel):
    pending_token: str
    code: str


class AdminOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminOut


class InviteAdminRequest(BaseModel):
    email: EmailStr
    full_name: str | None = None
    temp_password: str


class AdminTeamOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None = None
    is_active: bool
    created_at: datetime
    last_login_at: datetime | None = None

    class Config:
        from_attributes = True
