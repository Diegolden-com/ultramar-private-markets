from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.models import Signal
from ...db.session import get_session

router = APIRouter(prefix="/signals", tags=["signals"])


@router.get("/")
def list_signals(limit: int = 50, db: Session = Depends(get_session)):
    rows = db.query(Signal).order_by(Signal.id.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "market_id": r.market_id,
            "implied_prob": r.implied_prob,
            "theoretical_prob": r.theoretical_prob,
            "spread": r.spread,
            "meta": r.meta,
            "created_at": r.created_at,
        }
        for r in rows
    ]
