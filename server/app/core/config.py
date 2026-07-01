from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database
    database_url: str
    database_url_sync: str

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 480
    jwt_pending_token_expire_minutes: int = 10

    # OTP
    otp_expire_minutes: int = 5
    otp_max_attempts: int = 5
    otp_length: int = 6
    otp_bypass_code: str | None = None
    otp_resend_cooldown_seconds: int = 30

    # Contact form
    contact_cooldown_seconds: int = 60

    # SMTP
    email_smtp_server: str
    email_smtp_port: int = 587
    email_sender_email: str
    email_sender_password: str
    email_login: str

    # Uploads
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 4
    upload_base_url: str = "/uploads"

    # App
    cors_origins: str = "http://localhost:5173"
    api_port: int = 8000
    studio_notify_email: str

    # Seed admin
    seed_admin_email: str
    seed_admin_password: str

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
