from __future__ import annotations

import logging

from ..config import settings
from ..db.session import SessionLocal
from ..ingest.deribit_client import DeribitClient
from ..ingest.gamma_client import GammaClient
from ..ingest.normalize import normalize_deribit_orderbook, normalize_polymarket_orderbook
from ..ingest.polymarket_client import PolymarketClient
from ..ingest.raw_store import RawStore
from ..ingest.writers import write_orderbook_snapshot
from ..mapping.service import MappingService

logger = logging.getLogger(__name__)


def run_polymarket_once(token_id: str) -> None:
    client = PolymarketClient(settings.polymarket_base_url)
    raw = client.get_orderbook_by_token(token_id)
    RawStore(settings.raw_store_root).write("polymarket", raw)
    normalized = normalize_polymarket_orderbook(raw)
    with SessionLocal() as db:
        write_orderbook_snapshot(db, normalized)
    logger.info("polymarket orderbook stored", extra={"token_id": token_id})


def run_deribit_once(instrument_name: str) -> None:
    client = DeribitClient(settings.deribit_base_url)
    raw = client.get_orderbook(instrument_name)
    RawStore(settings.raw_store_root).write("deribit", raw)
    normalized = normalize_deribit_orderbook(raw)
    with SessionLocal() as db:
        write_orderbook_snapshot(db, normalized)
    logger.info("deribit orderbook stored", extra={"instrument": instrument_name})

def run_polymarket_mapped() -> None:
    mapping = MappingService().load()
    if not mapping:
        logger.warning("no polymarket mappings found")
        return
    gamma = GammaClient(settings.gamma_base_url)
    for entry in mapping:
        token_id = MappingService.resolve_clob_token_id(entry, gamma)
        if not token_id:
            logger.warning("no token id resolved", extra={"market_slug": entry.market_slug})
            continue
        run_polymarket_once(token_id)


if __name__ == "__main__":
    # Set env vars for local testing or replace with concrete IDs.
    run_polymarket_mapped()
    run_deribit_once(instrument_name="BTC-26DEC25-100000-C")
