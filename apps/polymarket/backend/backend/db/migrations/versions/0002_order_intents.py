"""order intents and state events

Revision ID: 0002_order_intents
Revises: 0001_initial
Create Date: 2026-02-26 00:00:00

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0002_order_intents"
down_revision: Union[str, None] = "0001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "order_intents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("signal_id", sa.Integer(), nullable=False),
        sa.Column("venue", sa.String(length=32), nullable=False),
        sa.Column("market_key", sa.String(length=128), nullable=False),
        sa.Column("token_id", sa.String(length=128), nullable=True),
        sa.Column("side", sa.String(length=8), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("size", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("idempotency_key", sa.String(length=128), nullable=False),
        sa.Column("external_order_id", sa.String(length=128), nullable=True),
        sa.Column("live_submitted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("request_meta", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("response_meta", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("idempotency_key", name="uq_order_intents_idempotency_key"),
    )
    op.create_index("ix_order_intents_signal_id", "order_intents", ["signal_id"], unique=False)
    op.create_index("ix_order_intents_venue", "order_intents", ["venue"], unique=False)
    op.create_index("ix_order_intents_market_key", "order_intents", ["market_key"], unique=False)
    op.create_index("ix_order_intents_token_id", "order_intents", ["token_id"], unique=False)
    op.create_index("ix_order_intents_status", "order_intents", ["status"], unique=False)
    op.create_index(
        "ix_order_intents_idempotency_key",
        "order_intents",
        ["idempotency_key"],
        unique=True,
    )
    op.create_index(
        "ix_order_intents_external_order_id",
        "order_intents",
        ["external_order_id"],
        unique=False,
    )

    op.create_table(
        "order_state_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_intent_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("reason", sa.String(length=64), nullable=True),
        sa.Column("error", sa.String(length=512), nullable=True),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(
        "ix_order_state_events_order_intent_id",
        "order_state_events",
        ["order_intent_id"],
        unique=False,
    )
    op.create_index("ix_order_state_events_status", "order_state_events", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_order_state_events_status", table_name="order_state_events")
    op.drop_index("ix_order_state_events_order_intent_id", table_name="order_state_events")
    op.drop_table("order_state_events")

    op.drop_index("ix_order_intents_external_order_id", table_name="order_intents")
    op.drop_index("ix_order_intents_idempotency_key", table_name="order_intents")
    op.drop_index("ix_order_intents_status", table_name="order_intents")
    op.drop_index("ix_order_intents_token_id", table_name="order_intents")
    op.drop_index("ix_order_intents_market_key", table_name="order_intents")
    op.drop_index("ix_order_intents_venue", table_name="order_intents")
    op.drop_index("ix_order_intents_signal_id", table_name="order_intents")
    op.drop_table("order_intents")
