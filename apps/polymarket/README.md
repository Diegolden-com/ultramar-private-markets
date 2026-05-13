# Ultramar Polymarket

`@ultramar/polymarket` is now the historical frontend and active backend workspace for the **Arbitrage Hedge Fund** product.

Canonical product route: `https://ultramar.capital/arbitrage-hedge-fund`

## Current Role

The public Polymarket experience has moved into `apps/ultramar`:

- `/arbitrage-hedge-fund`
- `/arbitrage-hedge-fund/signals`
- `/arbitrage-hedge-fund/dashboard`
- `/arbitrage-hedge-fund/risk`
- `/arbitrage-hedge-fund/research`

This workspace remains important for the strategy engine:

- Python backend for ingestion, mapping, pricing, signals, execution, risk, reconciliation, and analytics.
- Runbooks and go-live documentation for production-like operation.
- Historical Next.js frontend and auth implementation for reference.

## Product Thesis

Arbitrage Hedge Fund v1 is Polymarket-first. The active strategy compares:

- Polymarket implied probability from binary market prices and depth.
- Model probability from derivatives-informed pricing assumptions.
- Execution risk from liquidity, slippage, exposure caps, hedging feasibility, and stale data controls.

Lending markets and derivative arbitrage are research-only in the consolidated public taxonomy.

## Legacy Routes

Public paths on `polymarket.ultramar.capital` should redirect into the canonical mega app:

- `/` -> `/arbitrage-hedge-fund`
- `/dashboard` -> `/arbitrage-hedge-fund/dashboard`
- `/auth/*` -> `/auth/*`

The redirect implementation lives in `apps/ultramar/next.config.ts`.

## Local Commands

Frontend reference:

```bash
corepack yarn workspace @ultramar/polymarket dev
corepack yarn workspace @ultramar/polymarket lint
corepack yarn workspace @ultramar/polymarket typecheck
corepack yarn workspace @ultramar/polymarket build
```

Backend:

```bash
corepack yarn workspace @ultramar/polymarket backend:lint
corepack yarn workspace @ultramar/polymarket backend:test
corepack yarn workspace @ultramar/polymarket backend:reconcile
```

New public UI work should happen in `apps/ultramar`. Backend and execution engine work remains here unless a future services migration moves it.
