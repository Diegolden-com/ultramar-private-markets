# Ultramar Polymarket

`@ultramar/polymarket` is the specialist Polymarket strategy workspace inside Ultramar.capital. It focuses on probability dislocations between event markets and derivatives-implied probabilities, then turns those dislocations into monitored trade signals and execution intents.

Public host: `polymarket.ultramar.capital`

## Role in Ultramar.capital

Ultramar Polymarket is the research, risk, and execution layer behind the Polymarket Arbitrage strategy shown in `apps/capital`.

It is not a generic Next.js/Supabase starter. It contains:

- a Next.js strategy dashboard and auth surface;
- a Python backend for ingestion, pricing, signal generation, execution, reconciliation, and analytics;
- E2E tests and operational runbooks for production-like rollout.

## Product Thesis

The strategy compares:

- **Polymarket implied probability:** binary market prices and CLOB depth;
- **Model probability:** Black-Scholes/lognormal probability derived from mapped underlying, strike, expiry, and Deribit volatility data;
- **Execution risk:** liquidity, slippage, exposure caps, hedging feasibility, and stale data controls.

When the discrepancy is large enough and risk checks pass, the backend can produce an order intent. Depending on mode, that intent can remain paper-only, shadow-live, or become a live Polymarket order.

## Deployment

The frontend is deployed from the monorepo root with `vercel.polymarket.json`:

```bash
vercel link --yes --project ultramar-polymarket --scope pachuco
rm -rf .vercel/output
vercel --local-config vercel.polymarket.json build --prod --yes
vercel deploy --prebuilt --prod --yes
```

The app links to `capital.ultramar.capital` and `private-equities.ultramar.capital` from its navigation and footer. The default URLs can be overridden with `NEXT_PUBLIC_ULTRAMAR_CAPITAL_URL` and `NEXT_PUBLIC_ULTRAMAR_PRIVATE_EQUITIES_URL`.

## Frontend Surfaces

- `/`: strategy landing page.
- `/dashboard`: signal and position dashboard.
- `/auth/login`: login.
- `/auth/sign-up`: sign-up.
- `/auth/forgot-password`: password recovery.
- `/auth/update-password`: password update.
- `/auth/confirm`: auth confirmation route.
- `/protected`: authenticated session diagnostics and protected UI shell.

## Backend Subcomponents

The Python backend lives under `backend/backend/`.

| Area | Path | Responsibility |
| --- | --- | --- |
| API | `api/` | FastAPI app and routes for signals/positions. |
| Ingestion | `ingest/` | Polymarket, Gamma, Deribit, raw store, WebSocket, and normalization clients. |
| Mapping | `mapping/` | Manual/event mapping between Polymarket markets and financial underlyings. |
| Pricing | `pricing/` | Black-Scholes, CDF helpers, IV surface, spot/probability logic. |
| Signals | `signals/` | Probability discrepancy calculation and filters. |
| Risk | `risk/` | Kelly sizing, exposure aggregation, and hard limits. |
| Execution | `execution/` | Paper gateway, Polymarket SDK gateway, order intents, kill switch, canary ladder, reconciliation helpers. |
| Workers | `workers/` | Ingest, signal, execution, hedge, scheduler, and reconciliation loops. |
| Analytics | `analytics/` | PnL calculations. |
| DB | `db/` | SQLAlchemy models, Alembic migrations, and sessions. |
| Replay | `replay/` | Deterministic replay/backtest path for stored data. |

## Execution Modes

- `paper`: simulated fills, safe default.
- `live_shadow`: builds signed orders without live submission.
- `live`: submits live orders through the Polymarket SDK gateway.

The backend persists order intents and state transitions so execution can be reconciled through user-stream events and REST fallback.

## Local Commands

Frontend from the monorepo root:

```bash
corepack yarn workspace @ultramar/polymarket dev
corepack yarn workspace @ultramar/polymarket lint
corepack yarn workspace @ultramar/polymarket typecheck
corepack yarn workspace @ultramar/polymarket build
```

Backend from the monorepo root:

```bash
corepack yarn workspace @ultramar/polymarket backend:lint
corepack yarn workspace @ultramar/polymarket backend:test
corepack yarn workspace @ultramar/polymarket backend:reconcile
```

Full QA:

```bash
corepack yarn workspace @ultramar/polymarket qa:frontend
corepack yarn workspace @ultramar/polymarket qa:backend
corepack yarn workspace @ultramar/polymarket test:e2e
```

## Key Environment Groups

Frontend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or compatible Supabase anon/publishable key

Backend:

- database connection settings for SQLAlchemy/Alembic;
- Polymarket market-data mode settings;
- Polymarket execution credentials for `live_shadow` and `live`;
- risk, canary, kill-switch, and reconciliation controls.

See `backend/README.md` and `docs/GO_LIVE_CHECKLIST.md` before enabling live execution.

## Related Docs

- `backend/README.md`: backend setup, migrations, execution modes, health checks, order intents, reconciliation, kill switch, and canary ladder.
- `docs/spec.md`: architecture and phased task plan.
- `docs/IMPLEMENTATION_PLAN.md`: implementation plan.
- `docs/GO_LIVE_CHECKLIST.md`: live readiness checklist.
- `docs/RUNBOOK_INCIDENTS.md`: incident response.
- `docs/RUNBOOK_KEY_ROTATION.md`: key rotation procedure.
