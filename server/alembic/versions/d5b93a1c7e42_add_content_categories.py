"""add content_categories (portfolio + gallery categories as orderable rows)

Revision ID: d5b93a1c7e42
Revises: a1f4c7b20e91
Create Date: 2026-09-08

SAFETY: this migration only CREATES a table and fills it by reading existing
rows. It never updates, deletes or drops anything that already holds content,
so it is safe to run against a live database with real data.

Backfill rules
--------------
portfolio: one row per distinct *effective* category of portfolio_items. The
    effective category mirrors the frontend's getItemCategory(): the category
    column unless it is empty or one of the reserved filter names, in which
    case the item's title is used. Ordering follows MIN(order_index) so the tab
    order visitors currently see is preserved exactly.

gallery: the known default categories first, in their configured order, then
    any additional category found on existing gallery_items appended after.
    Seeding the defaults means categories that currently have no photos still
    appear in the admin dropdown, as they do today from the hardcoded list.
"""
import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = 'd5b93a1c7e42'
down_revision: Union[str, Sequence[str], None] = 'a1f4c7b20e91'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Filter tabs derived from video_url / bts_url — never real categories.
RESERVED = ('Video', 'BTS', 'video', 'image')

# Mirrors GALLERY_CATEGORIES in the frontend content store, in that order.
DEFAULT_GALLERY = [
    'Behind The Scenes',
    'Event Photography',
    'Sports Photography',
    'Advertising Photography',
    'Portrait Photography',
    'Wedding Photography',
    'Podcast',
]


def upgrade() -> None:
    op.create_table(
        'content_categories',
        sa.Column('id', sa.UUID(), primary_key=True, nullable=False),
        sa.Column('kind', sa.String(length=16), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('kind', 'name', name='uq_content_categories_kind_name'),
    )
    op.create_index('ix_content_categories_kind_order', 'content_categories', ['kind', 'order_index'])

    conn = op.get_bind()

    # ── portfolio ────────────────────────────────────────────────────────
    reserved_list = ', '.join(f"'{r}'" for r in RESERVED)
    rows = conn.execute(sa.text(f"""
        SELECT effective AS name, MIN(order_index) AS pos
        FROM (
            SELECT CASE
                     WHEN category IS NOT NULL
                          AND btrim(category) <> ''
                          AND category NOT IN ({reserved_list})
                     THEN category
                     ELSE title
                   END AS effective,
                   order_index
            FROM portfolio_items
        ) t
        WHERE effective IS NOT NULL AND btrim(effective) <> ''
        GROUP BY effective
        ORDER BY MIN(order_index)
    """)).fetchall()

    for i, row in enumerate(rows):
        conn.execute(
            sa.text("""INSERT INTO content_categories (id, kind, name, order_index)
                       VALUES (:id, 'portfolio', :name, :pos)
                       ON CONFLICT (kind, name) DO NOTHING"""),
            {'id': uuid.uuid4(), 'name': row.name, 'pos': i},
        )

    # ── gallery: defaults first, then anything extra already in use ──────
    existing = [r.category for r in conn.execute(sa.text("""
        SELECT category, MIN(order_index) AS pos
        FROM gallery_items
        WHERE category IS NOT NULL AND btrim(category) <> ''
        GROUP BY category
        ORDER BY MIN(order_index)
    """)).fetchall()]

    ordered = DEFAULT_GALLERY + [c for c in existing if c not in DEFAULT_GALLERY]
    for i, name in enumerate(ordered):
        conn.execute(
            sa.text("""INSERT INTO content_categories (id, kind, name, order_index)
                       VALUES (:id, 'gallery', :name, :pos)
                       ON CONFLICT (kind, name) DO NOTHING"""),
            {'id': uuid.uuid4(), 'name': name, 'pos': i},
        )


def downgrade() -> None:
    # Only the lookup table goes away; portfolio_items / gallery_items are untouched.
    op.drop_index('ix_content_categories_kind_order', table_name='content_categories')
    op.drop_table('content_categories')
