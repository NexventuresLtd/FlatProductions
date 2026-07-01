import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import TokenType, decode_token
from app.models.admin import Admin

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Admin:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if credentials is None:
        raise unauthorized

    payload = decode_token(credentials.credentials)
    if not payload or payload.get("token_type") != TokenType.ACCESS.value:
        raise unauthorized

    try:
        admin_id = uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        raise unauthorized

    admin = await db.get(Admin, admin_id)
    if not admin or not admin.is_active:
        raise unauthorized

    return admin
