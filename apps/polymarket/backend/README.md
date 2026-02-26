# Ultramar Polymarket Backend

MVP backend services for data ingestion, pricing, signals, and execution planning.

## Local setup

Use Python 3.10+ (the pinned `py-clob-client` release does not install on Python 3.9.6).

```bash
cp .env.example .env
python3.10 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

Run backend quality checks:

```bash
python -m ruff check backend tests
python -m pytest
```

From the monorepo root, these wrappers call the same checks:

```bash
corepack yarn workspace @ultramar/polymarket backend:lint
corepack yarn workspace @ultramar/polymarket backend:test
```

## Polymarket SDK Migration (Phase 1)

The backend now uses an SDK-first market data gateway with legacy HTTP fallback.

- `POLYMARKET_MARKET_DATA_MODE=auto` (default): try SDK first, fallback to legacy REST.
- `POLYMARKET_MARKET_DATA_MODE=sdk`: SDK only (or fallback if enabled).
- `POLYMARKET_MARKET_DATA_MODE=legacy`: existing REST client only.
- `POLYMARKET_DUAL_RUN_COMPARE=true` (default): fetch SDK + legacy and log parity mismatches.
- `POLYMARKET_SDK_FALLBACK_TO_LEGACY=true` (default): fallback when SDK errors.

Current WebSocket default is aligned to the CLOB market channel:

- `POLYMARKET_WS_URL=wss://ws-subscriptions-clob.polymarket.com/ws/market`

### Execution Adapter Layer

Execution now has a pluggable gateway contract:

- `PaperTradingGateway`: current default behavior, immediate simulated fills.
- `PolymarketSDKTradingGateway`: creates signed orders via `py-clob-client`; when
  `submit_live=False`, it only prepares orders (no live submission).

The executor handles non-filled gateway statuses (`prepared`, `pending`, `rejected`)
without persisting a trade fill, which enables safe shadow rollout before live mode.
