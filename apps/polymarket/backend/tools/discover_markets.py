from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import httpx
import yaml

DEFAULT_GAMMA = "https://gamma-api.polymarket.com"


def _parse_strike(question: str) -> float | None:
    match = re.search(r"\$?([0-9][0-9,]*)", question)
    if not match:
        return None
    return float(match.group(1).replace(",", ""))


def _parse_end_date(market: dict) -> datetime | None:
    raw = market.get("endDate") or market.get("end_date")
    if not raw:
        return None
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return None


def _deribit_instrument(underlying: str, expiry: datetime, strike: float) -> str:
    month = expiry.strftime("%b").upper()
    return f"{underlying}-{expiry.day:02d}{month}{expiry.strftime('%y')}-{int(strike)}-C"


def _fetch_markets(gamma_url: str, limit: int = 200) -> list[dict]:
    results: list[dict] = []
    offset = 0
    with httpx.Client(timeout=20.0) as client:
        while True:
            resp = client.get(
                f"{gamma_url.rstrip('/')}/markets",
                params={"closed": "false", "limit": limit, "offset": offset},
            )
            resp.raise_for_status()
            batch = resp.json()
            if not batch:
                break
            results.extend(batch)
            offset += limit
            if len(batch) < limit:
                break
    return results


def _filter_markets(markets: list[dict], assets: list[str], min_date: datetime) -> list[dict]:
    filtered = []
    for market in markets:
        question = (market.get("question") or "").lower()
        if not any(asset.lower() in question for asset in assets):
            continue
        if "above" not in question:
            continue
        end_date = _parse_end_date(market)
        if not end_date or end_date < min_date:
            continue
        if not market.get("enableOrderBook"):
            continue
        filtered.append(market)
    return filtered


def _build_mapping(market: dict, asset: str) -> dict:
    question = market.get("question") or ""
    strike = _parse_strike(question)
    end_date = _parse_end_date(market)
    outcomes = market.get("outcomes")
    if isinstance(outcomes, str):
        outcomes = json.loads(outcomes)
    outcome = "Yes" if outcomes and "Yes" in outcomes else (outcomes[0] if outcomes else "Yes")

    mapping = {
        "market_id": None,
        "market_slug": market.get("slug"),
        "title": question,
        "underlying": asset,
        "quote": "USD",
        "event_type": "above",
        "strike": strike or 0,
        "expiry": end_date.isoformat().replace("+00:00", "Z") if end_date else "",
        "outcome": outcome,
        "deribit_instrument": _deribit_instrument(asset, end_date, strike or 0) if end_date else None,
        "source": "polymarket",
    }
    return mapping


def main() -> None:
    parser = argparse.ArgumentParser(description="Discover Polymarket BTC/ETH above markets")
    parser.add_argument("--gamma", default=DEFAULT_GAMMA)
    parser.add_argument("--assets", default="BTC,ETH")
    parser.add_argument("--min-date", required=True, help="ISO date, e.g. 2026-03-31")
    parser.add_argument("--out", default="backend/backend/mapping/table.yaml")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    min_date = datetime.fromisoformat(args.min_date).replace(tzinfo=timezone.utc)
    assets = [a.strip().upper() for a in args.assets.split(",") if a.strip()]

    markets = _fetch_markets(args.gamma)
    candidates = _filter_markets(markets, assets, min_date)

    mappings: list[dict] = []
    for market in candidates:
        q = (market.get("question") or "").lower()
        asset = "BTC" if "bitcoin" in q or "btc" in q else "ETH"
        mappings.append(_build_mapping(market, asset))

    if args.dry_run:
        print(yaml.safe_dump(mappings, sort_keys=False))
        return

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(yaml.safe_dump(mappings, sort_keys=False))
    print(f"wrote {len(mappings)} mappings to {out_path}")


if __name__ == "__main__":
    main()
