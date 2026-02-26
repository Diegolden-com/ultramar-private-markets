from datetime import datetime, timedelta

from backend.mapping.service import MarketMapping
from backend.replay.replay import run_replay_once


def test_full_signal_loop():
    expiry = (datetime.utcnow() + timedelta(days=30)).isoformat()
    mapping = MarketMapping(
        market_id=None,
        market_slug="btc-above-100",
        title="BTC above 100",
        underlying="BTC",
        quote="USD",
        event_type="above",
        strike=100.0,
        expiry=expiry,
        outcome="Yes",
        source="gamma",
        deribit_instrument="BTC-TEST",
    )

    events = [
        {
            "kind": "orderbook",
            "market_slug": "btc-above-100",
            "payload": {"bids": [[0.40, 100]], "asks": [[0.60, 100]]},
        },
        {"kind": "spot", "asset": "BTC", "price": 120.0},
        {"kind": "iv", "instrument_name": "BTC-TEST", "iv": 0.5},
    ]

    result = run_replay_once(events, [mapping])
    assert len(result.signals) == 1
    assert len(result.paper_orders) == 1
    assert result.paper_orders[0].side == "buy"
