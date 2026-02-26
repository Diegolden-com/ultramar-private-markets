"""initial tables

Revision ID: 0001_initial
Revises: 
Create Date: 2026-01-30 00:00:00

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "markets",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("venue", sa.String(length=32), nullable=False),
        sa.Column("symbol", sa.String(length=64), nullable=False),
        sa.Column("meta", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_markets_symbol", "markets", ["symbol"], unique=False)
    op.create_index("ix_markets_venue", "markets", ["venue"], unique=False)

    op.create_table(
        "signals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("market_id", sa.Integer(), nullable=False),
        sa.Column("implied_prob", sa.Float(), nullable=False),
        sa.Column("theoretical_prob", sa.Float(), nullable=False),
        sa.Column("spread", sa.Float(), nullable=False),
        sa.Column("meta", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_signals_market_id", "signals", ["market_id"], unique=False)

    op.create_table(
        "positions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("market_id", sa.Integer(), nullable=False),
        sa.Column("venue", sa.String(length=32), nullable=False),
        sa.Column("size", sa.Float(), nullable=False),
        sa.Column("avg_price", sa.Float(), nullable=False),
        sa.Column("meta", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_positions_market_id", "positions", ["market_id"], unique=False)
    op.create_index("ix_positions_venue", "positions", ["venue"], unique=False)

    op.create_table(
        "orderbook_snapshots",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("venue", sa.String(length=32), nullable=False),
        sa.Column("market_key", sa.String(length=128), nullable=False),
        sa.Column("bids", sa.JSON(), nullable=False),
        sa.Column("asks", sa.JSON(), nullable=False),
        sa.Column("received_at", sa.DateTime(), nullable=False),
    )
    op.create_index(
        "ix_orderbook_snapshots_market_key",
        "orderbook_snapshots",
        ["market_key"],
        unique=False,
    )
    op.create_index("ix_orderbook_snapshots_venue", "orderbook_snapshots", ["venue"], unique=False)

    op.create_table(
        "trades",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("venue", sa.String(length=32), nullable=False),
        sa.Column("market_key", sa.String(length=128), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("size", sa.Float(), nullable=False),
        sa.Column("side", sa.String(length=8), nullable=False),
        sa.Column("traded_at", sa.DateTime(), nullable=False),
        sa.Column("meta", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
    )
    op.create_index("ix_trades_market_key", "trades", ["market_key"], unique=False)
    op.create_index("ix_trades_venue", "trades", ["venue"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_trades_venue", table_name="trades")
    op.drop_index("ix_trades_market_key", table_name="trades")
    op.drop_table("trades")
    op.drop_index("ix_orderbook_snapshots_venue", table_name="orderbook_snapshots")
    op.drop_index("ix_orderbook_snapshots_market_key", table_name="orderbook_snapshots")
    op.drop_table("orderbook_snapshots")
    op.drop_index("ix_positions_venue", table_name="positions")
    op.drop_index("ix_positions_market_id", table_name="positions")
    op.drop_table("positions")
    op.drop_index("ix_signals_market_id", table_name="signals")
    op.drop_table("signals")
    op.drop_index("ix_markets_venue", table_name="markets")
    op.drop_index("ix_markets_symbol", table_name="markets")
    op.drop_table("markets")
