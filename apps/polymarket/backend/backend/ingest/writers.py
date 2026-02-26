from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from ..db.models import OrderbookSnapshot


def write_orderbook_snapshot(db: Session, payload: dict) -> OrderbookSnapshot:
    venue = payload.get("venue")
    market_key = payload.get("market_id") or payload.get("instrument_name") or "unknown"
    snapshot = OrderbookSnapshot(
        venue=venue,
        market_key=market_key,
        bids=payload.get("bids", []),
        asks=payload.get("asks", []),
        received_at=_parse_timestamp(payload.get("timestamp")),
    )
    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)
    return snapshot


def _parse_timestamp(raw: str | int | None) -> datetime:
    if raw is None:
        return datetime.utcnow()
    if isinstance(raw, int):
        return datetime.utcfromtimestamp(raw / 1000.0)
    try:
        return datetime.fromisoformat(str(raw))
    except ValueError:
        return datetime.utcnow()
