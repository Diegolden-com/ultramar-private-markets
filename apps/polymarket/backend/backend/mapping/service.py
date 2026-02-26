from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import yaml


@dataclass(frozen=True)
class MarketMapping:
    market_id: str | None
    market_slug: str | None
    title: str
    underlying: str
    quote: str
    event_type: str
    strike: float
    expiry: str
    outcome: str
    source: str
    deribit_instrument: str | None = None


class MappingService:
    def __init__(self, table_path: str | None = None) -> None:
        self.table_path = Path(table_path or Path(__file__).with_name("table.yaml"))
        self._cache: list[MarketMapping] | None = None

    def load(self) -> list[MarketMapping]:
        if self._cache is None:
            data = yaml.safe_load(self.table_path.read_text()) or []
            self._cache = [MarketMapping(**row) for row in data]
        return self._cache

    def by_underlying(self, underlying: str) -> list[MarketMapping]:
        return [m for m in self.load() if m.underlying.upper() == underlying.upper()]

    def by_market_id(self, market_id: str) -> MarketMapping | None:
        for m in self.load():
            if m.market_id == market_id:
                return m
        return None

    @staticmethod
    def resolve_clob_token_id(mapping: MarketMapping, gamma_client) -> str | None:
        if not mapping.market_slug:
            return None
        markets = gamma_client.get_markets_by_slug(mapping.market_slug)
        if not markets:
            return None
        market = markets[0]
        outcomes = market.get("outcomes")
        token_ids = market.get("clobTokenIds")
        if isinstance(outcomes, str):
            outcomes = json.loads(outcomes)
        if isinstance(token_ids, str):
            token_ids = json.loads(token_ids)
        if not outcomes or not token_ids:
            return None
        try:
            idx = outcomes.index(mapping.outcome)
        except ValueError:
            return None
        if idx >= len(token_ids):
            return None
        return token_ids[idx]
