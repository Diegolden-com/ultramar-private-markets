from __future__ import annotations

from datetime import datetime


def normalize_polymarket_orderbook(raw: dict) -> dict:
    return {
        "venue": "polymarket",
        "market_id": raw.get("market_id") or raw.get("id"),
        "token_id": raw.get("asset_id") or raw.get("token_id"),
        "bids": raw.get("bids", []),
        "asks": raw.get("asks", []),
        "timestamp": raw.get("timestamp") or datetime.utcnow().isoformat(),
    }


def normalize_deribit_orderbook(raw: dict) -> dict:
    result = raw.get("result", {}) if isinstance(raw, dict) else {}
    return {
        "venue": "deribit",
        "instrument_name": result.get("instrument_name"),
        "bids": result.get("bids", []),
        "asks": result.get("asks", []),
        "timestamp": result.get("timestamp") or datetime.utcnow().isoformat(),
    }
