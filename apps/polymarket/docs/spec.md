# Black‑Scholes vs Polymarket Arbitrage System — Architecture & Task Plan

**Version:** 0.1   
**Status:** Design (Architecture Deep Dive)  
**Owner:** Diegolden  
**Target Launch:** "TODAY"

---

## 0) Scope, Goals, Non‑Goals

**Goals**
- Identify statistically significant probability dislocations between Black‑Scholes‑derived theoretical probabilities and Polymarket implied probabilities.
- Execute a hedged, risk‑controlled strategy with strong telemetry and post‑trade analytics.
- Incremental path: MVP → Model Enhancements → Production Hardening.
This phased path is the delivery plan: validate signal quality early, automate once validated, and harden before scale.
**Non‑Goals (initial)**
- Market making on Polymarket.
- Fully automated cross‑venue portfolio optimization (beyond risk caps).
- HFT / low‑latency co‑location.

---

## 1) System Overview (Context Diagram)

**Inputs**
- Polymarket markets (events, orderbook snapshots, trades, implied probs)
  - Scope: USD price events for top‑tier assets (BTC, ETH, Gold).
- Deribit options (IV surface, orderbook, greeks)
- Risk‑free rate proxy, dividend/forward adjustments
- Macro / event metadata (resolution criteria, expiry mapping)

**Outputs**
- Trade signals (probability discrepancy > 15%)
- Execution plans (Polymarket + Deribit hedges)
- Risk and PnL reports

---

## 2) Architecture Deep Dive

### 2.1 Core Services (Logical)
Each service is defined as MVP‑minimal first, then generalized for later phases.

1) **Data Ingestion Service**
- **MVP:** REST polling + WS for orderbooks; normalize only required fields; store raw JSON in object storage and normalized rows in Postgres.
- **Generalization:** schema versioning, multi‑venue connectors, replay service, and backfill jobs.

2) **Market Mapping Service**
- **MVP:** manual mapping table for BTC/ETH/Gold price events; simple mapping to underlying + strike + expiry.
- **Generalization:** automated mapping, resolution edge cases, “event risk” metadata, and equivalent option basket logic.

3) **Pricing & Probability Engine**
- **MVP:** Black‑Scholes with nearest‑strike IV; lognormal CDF for event probabilities.
- **Generalization:** IV surface fit + skew, alternative models (Bachelier, Heston), ensemble blending.

4) **Signal Engine**
- **MVP:** implied probability from top‑of‑book mid; theoretical probability from BS; flag spread > 15%; basic liquidity checks.
- **Generalization:** liquidity‑weighted probability, slippage models, multi‑venue signals.

5) **Portfolio & Risk Service**
- **MVP:** net exposure aggregation, fractional Kelly sizing with caps, daily loss limit.
- **Generalization:** full Greeks aggregation, stress tests, drawdown + concentration controls.

6) **Execution Service**
- **MVP:** manual‑confirm or paper execution; limit orders only; hedge via Deribit perps; audit log of intended actions.
- **Generalization:** automated execution, IOC logic, partial fill handling, and cancel/replace workflows.

7) **Monitoring & Analytics**
- **MVP:** structured logs, daily PnL report, basic dashboard.
- **Generalization:** real‑time dashboards, post‑trade attribution, and model validation tooling.


### 2.2 Data Flow (High Level)

1. Ingest raw data → normalize → store.
2. Map Polymarket market → underlying asset / expiry.
3. Build IV surface → compute theoretical probability.
4. Compute Polymarket implied probability + liquidity metrics.
5. Compare, filter, size, and generate signal.
6. Execute (Polymarket + Deribit hedge) with risk checks.
7. Monitor positions and PnL, rebalance hedges.


### 2.3 Data Storage & Replay

- **Raw data store:** append‑only for replay, for deterministic backtests.
- **Normalized store:** optimized for querying, joins, and feature generation.
- **Feature store:** derived features used by models (vol spreads, liquidity scores).
- **Trade ledger:** immutable record of orders, fills, and adjustments.


### 2.4 Model & Probability Layer

**MVP model**
- Black‑Scholes pricing + IV surface fit.
- Event probability mapping:
  - If event = “price above K at expiry”: P(S_T > K) from lognormal CDF.
  - If event = “price within range”: integrate over CDF.

**Model extensions**
- Volatility surface enhancements (smile / skew).
- Alternative models for tail events.
- Ensemble: blend model outputs with calibration weights.


### 2.5 Execution & Hedging

- Polymarket orders: limit preferred, careful with partial fills.
- **Delta hedging (MVP):** hedge with Deribit perpetual futures (BTC‑PERP / ETH‑PERP) on the same underlying.
- **Delta target:** keep portfolio delta within a band of ±0.20 of Polymarket notional exposure.
- **Re‑hedge rules:** rebalance on underlying move ≥ 1% or every 30 minutes, whichever comes first; ignore vega in MVP but log it.
- **Small positions:** if hedge size is below exchange minimum, accumulate until threshold is reached.


### 2.6 Risk & Controls

- Hard caps: per‑market exposure, portfolio exposure, daily loss limits.
- Execution guardrails: min liquidity, max slippage, max order size.
- Monitoring: alert on drift, anomaly detection, and stale data.


### 2.7 Failure Modes & Degradation

- Stale data: halt execution, keep monitoring.
- Partial fills: hedge proportionally, risk audit.
- Vol spike: tighten Kelly fraction or pause new trades.
- Exchange downtime: failover to “observe‑only” mode.

---

## 3) Technology Stack (Decisions)

**Languages**
- **Python** for model & signal engine and services (quant libs, fast iteration).
- **TypeScript** for web dashboards (shared types with frontend).

**Data & Storage**
- **SQLite** for MVP (single‑node, low‑ops) with clear migration path.
- **PostgreSQL** for normalized data, trade ledger, analytics (Phase 2+).
- **TimescaleDB** extension for time‑series efficiency (Phase 2+).
- **Object storage (S3‑compatible)** for raw feed dumps and backtests.

**Messaging**
- **SQLite** + background workers for MVP event flow (KISS).
- **Redis** for low‑latency caching and shared state (optional in MVP).

**Compute**
- **Docker** containers with Compose for MVP; **Kubernetes** for Phase 3.

**Monitoring**
- **MVP:** structured logs only.
- **Phase 3:** Prometheus + Grafana + OpenTelemetry.

**Modeling & Research**
- **NumPy / SciPy / pandas** for numerical work.
- **JAX** (optional) for differentiable models later.

**Frontend**
- **Next.js** for dashboards + internal admin UI.

---

## 4) Key Design Decisions (Open/Closed)

**Closed (decided)**
- MVP focus on Black‑Scholes baseline + probability discrepancy signal.
- Only execute when discrepancy > 15%.
- Delta‑neutral hedging on Deribit.
- Fractional Kelly for position sizing (risk‑reduced Kelly).

**Open (needs confirmation)**
- Exact Polymarket probability estimator (mid vs liquidity‑weighted).
- Minimum liquidity thresholds (market depth, spread limits).
- Risk‑free rate source: US Treasury short‑term (3m).

---

## 5) Task Breakdown (Architecture‑Driven)

### Phase 1 — MVP (Months 1–2)

**Data**
- Build Polymarket connector (REST + WS) with raw storage.
- Build Deribit connector and IV surface builder.
- Design canonical schemas and create database migrations.

**Model & Signal**
- Implement BS probability layer and lognormal CDF mapping.
- Build implied probability from Polymarket orderbook.
- Discrepancy calculation & thresholding.

**Risk & Execution**
- Basic portfolio store, Kelly sizing, exposure caps.
- Execution simulator (paper trading).
- Manual validation UI for signals.

**Infra**
- Docker‑Compose environment.
- Basic dashboards (signals, PnL, exposure).


### Phase 2 — Model Enhancements (Months 3–4)

- Add vol surface smoothing + skew handling.
- Build event‑probability mapping for non‑binary events.
- Integrate ensemble model.
- Automated execution with guardrails.
- Introduce hedge rebalancing automation.


### Phase 3 — Production Hardening (Months 5–6)

- Scale ingestion and compute via Kubernetes.
- Full observability stack + on‑call alerts.
- Failover / degrade modes.
- Comprehensive backtest pipeline.
- Compliance + security hardening.

---

## 6) Next Required Inputs

- Decide liquidity thresholds for Polymarket orderbook.
- Confirm priority: safer hedges vs faster fills.
- Confirm preferred risk‑free rate source.
- Confirm acceptable execution venues (paper trading vs live from MVP).

---

## 7) Immediate Next Actions (if approved)

1. Define schemas and database migrations.
2. Implement Polymarket connector + raw data pipeline.
3. Implement Deribit connector + IV surface builder.
4. Build BS probability module + signal engine.
5. Create simple UI for validation & trade logging.

---

## 8) MVP Implementation Task List (Modules & Files)

**Repo skeleton**
- `backend/pyproject.toml` (deps, tooling)
- `backend/backend/__init__.py`
- `backend/backend/config.py` (env + settings)
- `backend/backend/logging.py` (structured logging)
- `backend/backend/db/session.py`
- `backend/backend/db/models.py`
- `backend/backend/db/migrations/` (alembic)

**Data ingestion**
- `backend/backend/ingest/polymarket_client.py` (REST)
- `backend/backend/ingest/polymarket_ws.py` (orderbook WS)
- `backend/backend/ingest/deribit_client.py` (REST)
- `backend/backend/ingest/deribit_ws.py` (orderbook WS)
- `backend/backend/ingest/normalize.py`

**Market mapping**
- `backend/backend/mapping/table.yaml` (manual mappings for MVP)
- `backend/backend/mapping/service.py`

**Pricing & probability**
- `backend/backend/pricing/black_scholes.py`
- `backend/backend/pricing/cdf.py`
- `backend/backend/pricing/probabilities.py`
- `backend/backend/pricing/iv_surface.py`

**Signal engine**
- `backend/backend/signals/implied_prob.py`
- `backend/backend/signals/discrepancy.py`
- `backend/backend/signals/filters.py`

**Risk & sizing**
- `backend/backend/risk/kelly.py`
- `backend/backend/risk/exposure.py`
- `backend/backend/risk/limits.py`

**Execution**
- `backend/backend/execution/paper.py`
- `backend/backend/execution/polymarket_orders.py`
- `backend/backend/execution/deribit_hedge.py`

**Workers / scheduling**
- `backend/backend/workers/ingest.py`
- `backend/backend/workers/signals.py`
- `backend/backend/workers/hedge.py`

**API & UI**
- `backend/backend/api/app.py` (internal API, FastAPI)
- `backend/backend/api/routes/signals.py`
- `backend/backend/api/routes/positions.py`
- `app/dashboard/page.tsx`
- `components/SignalTable.tsx`
- `components/PositionSummary.tsx`

**Infra**
- `backend/Dockerfile`
- `docker-compose.yml`

---

## 9) Diagram Set (MVP)

Create Mermaid diagrams in `docs/diagrams/` to keep construction aligned:
- `docs/diagrams/context.mmd` (system context)
- `docs/diagrams/data-flow.mmd` (ingest → signal → execution)
- `docs/diagrams/service-sequence-signal.mmd` (signal generation sequence)
- `docs/diagrams/execution-state.mmd` (order / hedge state machine)
- `docs/diagrams/data-model-erd.mmd` (core tables and relations)
- `docs/diagrams/deployment-mvp.mmd` (containers and runtime)
