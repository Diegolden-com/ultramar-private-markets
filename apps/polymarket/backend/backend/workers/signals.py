from __future__ import annotations

import logging
from datetime import datetime

from ..config import settings
from ..db.models import Signal
from ..db.session import SessionLocal
from ..ingest.deribit_client import DeribitClient
from ..ingest.gamma_client import GammaClient
from ..ingest.normalize import normalize_polymarket_orderbook
from ..ingest.polymarket_client import PolymarketClient
from ..mapping.service import MappingService
from ..pricing.iv_surface import parse_mark_iv
from ..pricing.probabilities import (
    prob_above_strike,
    prob_below_strike,
    prob_between_strikes,
    time_to_expiry,
)
from ..pricing.spot import parse_index_price
from ..signals.discrepancy import is_actionable, probability_spread
from ..signals.filters import has_min_depth
from ..signals.implied_prob import implied_prob_mid

logger = logging.getLogger(__name__)


def _theoretical_probability(mapping, spot: float, r: float, sigma: float) -> float | None:
    T = time_to_expiry(mapping.expiry)
    if T <= 0:
        return None
    if mapping.event_type == "above":
        return prob_above_strike(spot, mapping.strike, T, r, sigma)
    if mapping.event_type == "below":
        return prob_below_strike(spot, mapping.strike, T, r, sigma)
    if mapping.event_type == "range":
        low, high = mapping.strike
        return prob_between_strikes(spot, low, high, T, r, sigma)
    return None


def _fetch_spot_prices(client: DeribitClient) -> dict[str, float]:
    mapping = {"BTC": "btc_usd", "ETH": "eth_usd"}
    spots: dict[str, float] = {}
    for asset, index_name in mapping.items():
        raw = client.get_index_price(index_name)
        price = parse_index_price(raw)
        if price is not None:
            spots[asset] = price
    return spots


def _fetch_sigma(client: DeribitClient, instrument_name: str | None) -> float | None:
    if not instrument_name:
        return None
    raw = client.get_orderbook(instrument_name)
    return parse_mark_iv(raw)


def run_once(r: float = 0.05) -> None:
    client = PolymarketClient(settings.polymarket_base_url)
    deribit = DeribitClient(settings.deribit_base_url)
    gamma = GammaClient(settings.gamma_base_url)
    spot_prices = _fetch_spot_prices(deribit)
    mapping = MappingService().load()

    with SessionLocal() as db:
        for entry in mapping:
            if time_to_expiry(entry.expiry) <= 0:
                logger.warning(
                    "mapping expired",
                    extra={"market_slug": entry.market_slug, "expiry": entry.expiry},
                )
                continue
            token_id = MappingService.resolve_clob_token_id(entry, gamma)
            if not token_id:
                continue
            raw = client.get_orderbook_by_token(token_id)
            normalized = normalize_polymarket_orderbook(raw)
            bids = normalized.get("bids", [])
            asks = normalized.get("asks", [])

            if not has_min_depth(bids, asks, min_levels=1):
                continue
            implied = implied_prob_mid(bids, asks)
            if implied is None:
                continue

            spot = spot_prices.get(entry.underlying)
            if spot is None:
                continue

            sigma = _fetch_sigma(deribit, entry.deribit_instrument)
            if sigma is None:
                continue

            theoretical = _theoretical_probability(entry, spot, r=r, sigma=sigma)
            if theoretical is None:
                continue

            spread = probability_spread(implied, theoretical)
            if not is_actionable(spread):
                continue

            signal = Signal(
                market_id=0,
                implied_prob=implied,
                theoretical_prob=theoretical,
                spread=spread,
                meta={
                    "market_slug": entry.market_slug,
                    "token_id": token_id,
                    "underlying": entry.underlying,
                    "strike": entry.strike,
                    "expiry": entry.expiry,
                    "spot": spot,
                    "sigma": sigma,
                    "r": r,
                    "created_at": datetime.utcnow().isoformat(),
                },
            )
            db.add(signal)
            db.commit()
            logger.info("signal stored", extra={"market_id": entry.market_id, "spread": spread})


if __name__ == "__main__":
    run_once()
