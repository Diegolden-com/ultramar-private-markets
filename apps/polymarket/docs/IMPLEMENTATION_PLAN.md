# MVP Implementation Plan (Checklist)

Status key: [ ] open, [~] in progress, [x] done

## 0) Foundations
- [x] Create backend skeleton (Python package layout)
  - Files: `backend/pyproject.toml`, `backend/backend/__init__.py`, `backend/backend/config.py`, `backend/backend/logging.py`
- [x] Database scaffolding
  - Files: `backend/backend/db/session.py`, `backend/backend/db/models.py`, `backend/backend/db/migrations/`
- [x] Compose + Docker baseline
  - Files: `backend/Dockerfile`, `docker-compose.yml`
- [x] Alembic config + initial migration
  - Files: `backend/alembic.ini`, `backend/backend/db/migrations/env.py`, `backend/backend/db/migrations/versions/0001_initial.py`

## 1) Data Ingestion
- [x] Polymarket REST client
  - File: `backend/backend/ingest/polymarket_client.py`
- [x] Polymarket WS client (orderbook)
  - File: `backend/backend/ingest/polymarket_ws.py`
- [x] Deribit REST client
  - File: `backend/backend/ingest/deribit_client.py`
- [x] Deribit WS client (orderbook)
  - File: `backend/backend/ingest/deribit_ws.py`
- [x] Normalization layer + write pipeline
  - File: `backend/backend/ingest/normalize.py`
- [x] Raw storage writer (object storage stub)
  - File: `backend/backend/ingest/raw_store.py`

## 2) Market Mapping
- [x] Manual mapping table for BTC/ETH/Gold USD events
  - File: `backend/backend/mapping/table.yaml`
- [x] Mapping service
  - File: `backend/backend/mapping/service.py`

## 3) Pricing & Probability
- [x] Black‑Scholes core
  - File: `backend/backend/pricing/black_scholes.py`
- [x] Lognormal CDF helpers
  - File: `backend/backend/pricing/cdf.py`
- [x] Event probability layer
  - File: `backend/backend/pricing/probabilities.py`
- [x] IV surface (nearest‑strike for MVP)
  - File: `backend/backend/pricing/iv_surface.py`

## 4) Signal Engine
- [x] Implied probability (top‑of‑book mid)
  - File: `backend/backend/signals/implied_prob.py`
- [x] Discrepancy computation (>15%)
  - File: `backend/backend/signals/discrepancy.py`
- [x] Liquidity filters (basic)
  - File: `backend/backend/signals/filters.py`

## 5) Risk & Sizing
- [x] Fractional Kelly sizing
  - File: `backend/backend/risk/kelly.py`
- [x] Exposure aggregation
  - File: `backend/backend/risk/exposure.py`
- [x] Limits (daily loss, exposure caps)
  - File: `backend/backend/risk/limits.py`

## 6) Execution (Paper + Hedge Plan)
- [x] Paper execution engine
  - File: `backend/backend/execution/paper.py`
- [x] Polymarket order builder
  - File: `backend/backend/execution/polymarket_orders.py`
- [x] Deribit hedge planner (perps)
  - File: `backend/backend/execution/deribit_hedge.py`

## 7) Workers / Scheduling
- [x] Ingest worker
  - File: `backend/backend/workers/ingest.py`
- [x] Signal worker
  - File: `backend/backend/workers/signals.py`
- [x] Hedge worker
  - File: `backend/backend/workers/hedge.py`
- [x] Simple scheduler loop
  - File: `backend/backend/workers/scheduler.py`

## 8) API + Dashboard
- [x] FastAPI app + base routes
  - Files: `backend/backend/api/app.py`, `backend/backend/api/routes/signals.py`, `backend/backend/api/routes/positions.py`
- [x] Dashboard view + components
  - Files: `app/dashboard/page.tsx`, `components/SignalTable.tsx`, `components/PositionSummary.tsx`

## 9) Diagrams (Mermaid)
- [x] Context diagram
  - File: `docs/diagrams/context.mmd`
- [x] Data flow diagram
  - File: `docs/diagrams/data-flow.mmd`
- [x] Signal sequence diagram
  - File: `docs/diagrams/service-sequence-signal.mmd`
- [x] Execution state machine
  - File: `docs/diagrams/execution-state.mmd`
- [x] Data model ERD
  - File: `docs/diagrams/data-model-erd.mmd`
- [x] Deployment MVP diagram
  - File: `docs/diagrams/deployment-mvp.mmd`

## 10) Validation & Backtest (MVP‑light)
- [x] Simple replay harness from raw data
  - File: `backend/backend/replay/replay.py`
- [x] PnL attribution for paper trades
  - File: `backend/backend/analytics/pnl.py`

## 11) Closing the Loop (Tests & Safety)
- [x] Unit/Integration Test Suite
  - Files: `backend/tests/test_pricing.py`, `backend/tests/test_ingest.py`, `backend/tests/test_loop.py`
- [x] Pricing Engine Completion (Greeks & Pricing)
  - Files: `backend/backend/pricing/black_scholes.py`, `backend/backend/pricing/cdf.py`
- [x] Safety & Robustness
  - Files: `backend/backend/workers/scheduler.py` (Error handling), `backend/backend/pricing/probabilities.py` (Logic fix)


---

## Closing Notes

**MVP completion status**
- The core MVP is implemented end‑to‑end: ingestion → normalization → storage → mapping → pricing/signal → execution planning → API → dashboard.
- All checklist items are complete, with helper tools for replay/PNL and market discovery.
- Live market linkage relies on the Gamma API resolver and the discovery script to keep `backend/backend/mapping/table.yaml` current.

**How to test (lightweight)**
1) **Static check**: `PYTHONPYCACHEPREFIX=/tmp/pycache python3 -m py_compile backend/backend/**/*.py`
2) **Boot services**: `docker compose up --build`
3) **Populate mapping**: run `python3 backend/tools/discover_markets.py --min-date YYYY-MM-DD`
4) **Run scheduler**: `python3 backend/backend/workers/scheduler.py`
5) **Check API**: `GET http://localhost:8000/health`, `GET /signals`, `GET /positions`
6) **View UI**: open `/dashboard` in Next.js app and confirm signals render.

**What remains before real trading**
- Replace placeholder mapping with active markets and confirm Deribit instruments exist.
- Add a real spot/IV feed for non‑Deribit assets (if needed).
- Add risk caps enforcement in execution path and persist positions/fills.
