# Ultramar Polymarket Backend

MVP backend services for data ingestion, pricing, signals, and execution planning.

Go-live execution checklist:
- `../docs/GO_LIVE_CHECKLIST.md`

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

## Deploy / Pull Checklist

After pulling backend changes, apply DB migrations before starting workers:

```bash
cd /Users/diegolden/Code/Diegolden/project-ultramar/apps/polymarket/backend
.venv/bin/python -m alembic upgrade head
```

Startup health checks automatically verify the database is at the expected
Alembic head (`0002_order_intents`). If migrations are behind, the health
endpoint reports `degraded` and the executor logs a warning (or fails fast when
`POLYMARKET_STARTUP_HEALTHCHECK_FAIL_FAST=true`).

CI also runs `alembic check` to catch model/migration drift before merge.

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

Execution mode is configured via `POLYMARKET_EXECUTION_MODE`:

- `paper` (default): uses `PaperTradingGateway` and persists simulated fills.
- `live_shadow`: uses `PolymarketSDKTradingGateway` but only prepares signed orders.
- `live`: uses `PolymarketSDKTradingGateway` and submits live orders.

For `live_shadow` and `live`, set:

- `POLYMARKET_PRIVATE_KEY`
- `POLYMARKET_CHAIN_ID`
- optional L2 creds: `POLYMARKET_API_KEY`, `POLYMARKET_API_SECRET`, `POLYMARKET_API_PASSPHRASE`

### Startup Health Checks

Startup checks now run for API + execution worker by default:

- Database connectivity (`SELECT 1`)
- Execution gateway bootstrap
  - `paper`: skipped
  - `live_shadow` / `live`: Polymarket SDK L2 bootstrap + optional L2 access verification

Controls:

- `POLYMARKET_STARTUP_HEALTHCHECK_ENABLED=true`
- `POLYMARKET_STARTUP_HEALTHCHECK_FAIL_FAST=false`
- `POLYMARKET_STARTUP_HEALTHCHECK_VERIFY_L2_ACCESS=true`

### Order Intent Persistence

Execution now persists durable order records:

- `order_intents`: one row per idempotent placement intent
- `order_state_events`: append-only state transitions for each intent

Idempotency uses a deterministic key over signal + market + side + price + size, with a
unique DB constraint to prevent duplicate placements.

### Reconciliation Worker (User Stream + REST Fallback)

`backend/workers/reconcile.py` closes the loop for `prepared`/`pending` order intents.

Flow:

- Consume Polymarket user-channel events (`/ws/user`) when enabled
- Apply matched order status transitions to `order_intents` + `order_state_events`
- Fallback to `get_order` REST checks for unresolved pending intents
- In `live_shadow`, auto-finalize stale `prepared` intents as `shadow_finalized`

Settings:

- `POLYMARKET_RECONCILE_ENABLED=true`
- `POLYMARKET_RECONCILE_MAX_INTENTS=200`
- `POLYMARKET_RECONCILE_USER_STREAM_ENABLED=true`
- `POLYMARKET_RECONCILE_STREAM_TIMEOUT_SECONDS=5`
- `POLYMARKET_RECONCILE_REST_FALLBACK_ENABLED=true`
- `POLYMARKET_RECONCILE_SHADOW_FINALIZE_SECONDS=30`
