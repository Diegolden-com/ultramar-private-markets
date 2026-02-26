from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from ..execution.paper import PaperOrder
from ..ingest.normalize import normalize_polymarket_orderbook
from ..mapping.service import MarketMapping
from ..pricing.probabilities import prob_above_strike, prob_below_strike, prob_between_strikes
from ..signals.discrepancy import is_actionable, probability_spread
from ..signals.filters import has_min_depth
from ..signals.implied_prob import implied_prob_mid


@dataclass
class ReplayResult:
    signals: list[dict]
    paper_orders: list[PaperOrder]


def load_raw_events(root: str) -> list[dict]:
    base = Path(root)
    if not base.exists():
        return []
    events: list[dict] = []
    for file in sorted(base.rglob("*.json")):
        try:
            events.append(json.loads(file.read_text()))
        except json.JSONDecodeError:
            continue
    return events


def _time_to_expiry(expiry: str, now: datetime) -> float:
    expiry_dt = datetime.fromisoformat(expiry.replace("Z", "+00:00"))
    delta = expiry_dt - now.replace(tzinfo=expiry_dt.tzinfo)
    return max(delta.total_seconds(), 0) / (365.0 * 24 * 3600)


def _theoretical_probability(
    mapping: MarketMapping, spot: float, r: float, sigma: float, now: datetime
) -> float | None:
    T = _time_to_expiry(mapping.expiry, now)
    if mapping.event_type == "above":
        return prob_above_strike(spot, mapping.strike, T, r, sigma)
    if mapping.event_type == "below":
        return prob_below_strike(spot, mapping.strike, T, r, sigma)
    if mapping.event_type == "range":
        low, high = mapping.strike
        return prob_between_strikes(spot, low, high, T, r, sigma)
    return None


def run_replay_once(
    events: list[dict],
    mappings: list[MarketMapping],
    r: float = 0.05,
    now: datetime | None = None,
) -> ReplayResult:
    now = now or datetime.utcnow()
    orderbooks: dict[str, dict] = {}
    spots: dict[str, float] = {}
    ivs: dict[str, float] = {}

    for event in events:
        kind = event.get("kind")
        if kind == "orderbook":
            key = event.get("market_slug") or event.get("token_id")
            payload = event.get("payload", {})
            if key:
                orderbooks[str(key)] = payload
        elif kind == "spot":
            asset = event.get("asset") or event.get("underlying")
            price = event.get("price")
            if asset and price is not None:
                spots[str(asset).upper()] = float(price)
        elif kind == "iv":
            instrument = event.get("instrument_name")
            iv = event.get("iv")
            if instrument and iv is not None:
                ivs[str(instrument)] = float(iv)

    signals: list[dict] = []
    orders: list[PaperOrder] = []

    for mapping in mappings:
        orderbook = orderbooks.get(mapping.market_slug or "") or orderbooks.get(
            mapping.market_id or ""
        )
        if not orderbook:
            continue

        normalized = normalize_polymarket_orderbook(orderbook)
        bids = normalized.get("bids", [])
        asks = normalized.get("asks", [])
        if not has_min_depth(bids, asks, min_levels=1):
            continue
        implied = implied_prob_mid(bids, asks)
        if implied is None:
            continue

        spot = spots.get(mapping.underlying.upper())
        if spot is None:
            continue

        sigma = ivs.get(mapping.deribit_instrument or "")
        if sigma is None:
            continue

        theoretical = _theoretical_probability(mapping, spot, r=r, sigma=sigma, now=now)
        if theoretical is None:
            continue

        spread = probability_spread(implied, theoretical)
        if not is_actionable(spread):
            continue

        signal = {
            "market_slug": mapping.market_slug,
            "implied_prob": implied,
            "theoretical_prob": theoretical,
            "spread": spread,
            "spot": spot,
            "sigma": sigma,
            "created_at": now.isoformat(),
        }
        signals.append(signal)

        side = "buy" if theoretical > implied else "sell"
        orders.append(
            PaperOrder(
                venue="polymarket",
                market_key=mapping.market_slug or mapping.market_id or "unknown",
                side=side,
                price=implied,
                size=1.0,
                created_at=now,
            )
        )

    return ReplayResult(signals=signals, paper_orders=orders)
