"""fix now() server defaults

The initial migration passed server_default='now()' as a plain Python string,
which Postgres stored as a frozen literal timestamp constant instead of the
dynamic now() SQL function. This migration fixes every affected column to use
a real server-side now() default.

Revision ID: 60ab14ecbfb1
Revises: 2df4d07299c8
Create Date: 2026-07-01 16:20:14.602986

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '60ab14ecbfb1'
down_revision: Union[str, Sequence[str], None] = '2df4d07299c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_COLUMNS = [
    ("about_settings", "updated_at"),
    ("admins", "created_at"),
    ("clients_settings", "updated_at"),
    ("contact_info_settings", "updated_at"),
    ("contact_messages", "created_at"),
    ("gallery_items", "created_at"),
    ("hero_settings", "updated_at"),
    ("page_heroes", "updated_at"),
    ("services", "created_at"),
    ("services", "updated_at"),
    ("team_members", "created_at"),
    ("team_members", "updated_at"),
    ("testimonials", "created_at"),
    ("testimonials", "updated_at"),
    ("visit_counter", "updated_at"),
    ("content_backups", "created_at"),
    ("otp_codes", "created_at"),
    ("portfolio_items", "created_at"),
    ("portfolio_items", "updated_at"),
]


def upgrade() -> None:
    for table, column in _COLUMNS:
        op.alter_column(table, column, server_default=None)
        op.execute(f"ALTER TABLE {table} ALTER COLUMN {column} SET DEFAULT now()")
        op.execute(f"UPDATE {table} SET {column} = now()")


def downgrade() -> None:
    for table, column in _COLUMNS:
        op.execute(f"ALTER TABLE {table} ALTER COLUMN {column} SET DEFAULT 'now()'")
