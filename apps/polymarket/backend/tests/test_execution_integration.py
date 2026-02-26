from datetime import datetime

from backend.db.models import Position, Signal, Trade
from backend.execution.executor import ExecutionConfig, execute_signal


def test_signal_to_position_persistence(db_session):
    signal = Signal(
        market_id=1,
        implied_prob=0.4,
        theoretical_prob=0.7,
        spread=0.3,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    result = execute_signal(db_session, signal, config)
    assert result.executed is True

    trade = db_session.query(Trade).one()
    position = db_session.query(Position).one()
    assert trade.market_key == "123"
    assert position.meta.get("market_key") == "123"
    assert signal.meta.get("status") == "executed"


def test_daily_loss_limit_blocks_trade(db_session):
    db_session.add(
        Trade(
            venue="polymarket",
            market_key="123",
            price=1.0,
            size=1000.0,
            side="buy",
            traded_at=datetime.utcnow(),
        )
    )
    db_session.commit()

    signal = Signal(
        market_id=1,
        implied_prob=0.45,
        theoretical_prob=0.7,
        spread=0.25,
        meta={"market_slug": "btc-above-100k", "token_id": "123", "spot": 100000},
    )
    db_session.add(signal)
    db_session.commit()

    config = ExecutionConfig(
        bankroll_usd=1000.0,
        max_position_usd=500.0,
        max_portfolio_usd=1000.0,
        daily_loss_limit_usd=500.0,
        min_trade_usd=10.0,
        kelly_fraction=0.5,
        delta_band_fraction=0.2,
        min_hedge_notional_usd=10.0,
    )

    result = execute_signal(db_session, signal, config)
    assert result.executed is False
    assert signal.meta.get("status") == "blocked"
    assert "daily_loss_limit" in signal.meta.get("risk_reasons", [])
