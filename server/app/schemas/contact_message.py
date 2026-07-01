import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class ContactMessageCreate(BaseModel):
    fullName: str
    email: EmailStr
    phone: str | None = None
    service: str | None = None
    message: str


class ContactMessageOut(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str
    phone: str | None = None
    service: str | None = None
    message: str
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True
