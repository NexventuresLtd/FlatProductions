import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from enum import Enum

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenType(str, Enum):
    PENDING = "pending"
    ACCESS = "access"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def _create_token(subject: str, token_type: TokenType, expires_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "token_type": token_type.value,
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_pending_token(admin_id: str) -> str:
    return _create_token(admin_id, TokenType.PENDING, settings.jwt_pending_token_expire_minutes)


def create_access_token(admin_id: str) -> str:
    return _create_token(admin_id, TokenType.ACCESS, settings.jwt_access_token_expire_minutes)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None


def generate_otp_code() -> str:
    return "".join(secrets.choice("0123456789") for _ in range(settings.otp_length))


def hash_otp_code(code: str) -> str:
    return hmac.new(settings.jwt_secret_key.encode(), code.encode(), hashlib.sha256).hexdigest()


def verify_otp_code(code: str, code_hash: str) -> bool:
    return hmac.compare_digest(hash_otp_code(code), code_hash)


def is_bypass_otp(code: str) -> bool:
    return bool(settings.otp_bypass_code) and hmac.compare_digest(code, settings.otp_bypass_code)
