from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.models import Position
from ...db.session import get_session

router = APIRouter(prefix="/positions", tags=["positions"])


@router.get("/")
def list_positions(limit: int = 50, db: Session = Depends(get_session)):
    rows = db.query(Position).order_by(Position.id.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "market_id": r.market_id,
            "venue": r.venue,
            "size": r.size,
            "avg_price": r.avg_price,
            "meta": r.meta,
            "updated_at": r.updated_at,
        }
        for r in rows
    ]
