"""add gallery_items.updated_at

Revision ID: a1f4c7b20e91
Revises: c9e5c6644b35
Create Date: 2026-09-07

Backfills from created_at so existing photos get a sane initial value rather
than all collapsing onto the migration timestamp.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = 'a1f4c7b20e91'
down_revision: Union[str, Sequence[str], None] = 'c9e5c6644b35'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'gallery_items',
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.execute('UPDATE gallery_items SET updated_at = created_at')
    op.create_index('ix_gallery_items_updated_at', 'gallery_items', ['updated_at'])


def downgrade() -> None:
    op.drop_index('ix_gallery_items_updated_at', table_name='gallery_items')
    op.drop_column('gallery_items', 'updated_at')
