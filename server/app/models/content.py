import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class HeroSettings(Base):
    __tablename__ = "hero_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subtitle: Mapped[str] = mapped_column(String(255), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class HeroImage(Base):
    __tablename__ = "hero_images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)


class AboutSettings(Base):
    __tablename__ = "about_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    heading: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    history: Mapped[str | None] = mapped_column(Text, nullable=True)
    mission: Mapped[str | None] = mapped_column(Text, nullable=True)
    vision: Mapped[str | None] = mapped_column(Text, nullable=True)
    value: Mapped[str | None] = mapped_column(Text, nullable=True)
    image1: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    image2: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    image3: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    image4: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AboutStat(Base):
    __tablename__ = "about_stats"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    value: Mapped[str] = mapped_column(String(64), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)


class AboutChip(Base):
    __tablename__ = "about_chips"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text: Mapped[str] = mapped_column(String(255), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)


class ContactInfoSettings(Base):
    __tablename__ = "contact_info_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    phone: Mapped[str] = mapped_column(String(64), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    hours: Mapped[str] = mapped_column(String(255), nullable=False)
    whatsapp: Mapped[str] = mapped_column(String(64), nullable=False)
    instagram_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    youtube_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ClientsSettings(Base):
    __tablename__ = "clients_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    intro_text: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)


class ClientLogo(Base):
    __tablename__ = "client_logos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    logo_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)


class PageHero(Base):
    __tablename__ = "page_heroes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_key: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    image: Mapped[str] = mapped_column(String(1024), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ContactBackup(Base):
    """Single-slot snapshot of the aggregate SiteContent JSON, mirrors the frontend's
    one-level localStorage backup/restore behavior."""

    __tablename__ = "content_backups"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("admins.id", ondelete="SET NULL"), nullable=True
    )
    snapshot: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
