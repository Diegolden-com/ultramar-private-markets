# Ultramar.capital Monorepo

Ultramar.capital is a family of investment products for private-market and cross-market strategies. The monorepo contains three product variants that share the same design language, Next.js stack, and workspace dependency graph, but each variant owns a distinct investment surface.

## Product Map

| Workspace | Product variant | Purpose | Primary audience |
| --- | --- | --- | --- |
| `apps/capital` | Ultramar Capital | Main allocator and strategy marketplace for DeFi, derivatives, prediction-market, and private-market strategies. | Investors evaluating or allocating across the Ultramar strategy suite. |
| `apps/polymarket` | Ultramar Polymarket | Specialist quantitative strategy for Polymarket probability dislocations, Black-Scholes pricing, hedging, and execution monitoring. | Operators, quants, and risk reviewers running the Polymarket strategy. |
| `apps/private-equities` | Ultramar Private Equities | RWA/private-equity tokenization product with oracle-backed solvency proofs, issuer dashboards, and permissioned secondary-market components. | Issuers, accredited investors, and protocol operators. |

## Public Subdomains

Each deployable app is published as a first-class Ultramar.capital subdomain. Cross-app navigation is part of the top-level product shell so users can move between the allocator, the Polymarket strategy dashboard, and the private-market rail.

| Subdomain | Workspace | Vercel config |
| --- | --- | --- |
| `capital.ultramar.capital` | `apps/capital` | `vercel.capital.json` |
| `polymarket.ultramar.capital` | `apps/polymarket` | `vercel.polymarket.json` |
| `private-equities.ultramar.capital` | `apps/private-equities` | `vercel.private-equities.json` |

## Product Model

Ultramar.capital is the umbrella brand. Each app is a variant of the same platform:

- **Capital** is the portfolio and allocation layer. It presents the strategy menu, investor-facing education pages, dashboards, and API routes for strategy metadata.
- **Polymarket** is the event-market alpha engine. It combines Polymarket orderbooks, Deribit options data, Black-Scholes probability estimates, risk limits, order intent persistence, and reconciliation workers.
- **Private Equities** is the tokenized private-market rail. It connects issuer financial data, solvency scoring, proof publication, permissioned equity tokens, AMM-style liquidity, and investor portfolio views.

The variants are not separate brands. They are deployable subproducts under the Ultramar.capital system.

For the canonical taxonomy, see `docs/PRODUCT_MAP.md`.

## Shared Architecture

- **Package manager:** Yarn 4 via Corepack.
- **Workspace layout:** `apps/*` and `packages/*`.
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- **Shared dependencies:** common runtime and tooling packages live in the root `package.json`.
- **Workspace-local dependencies:** each app keeps only dependencies that are unique to that app, plus `react`/`react-dom` where Yarn peer boundaries require the app to provide them.
- **Lockfile:** one root `yarn.lock`.
- **Node linker:** `node-modules` via `.yarnrc.yml`.

## Repository Layout

```text
project-ultramar/
  apps/
    capital/             # Main Ultramar Capital allocator app
    polymarket/          # Polymarket strategy frontend + Python backend
    private-equities/    # Private equity/RWA frontend + contracts
  packages/              # Reserved for shared packages
  .github/workflows/     # CI/CD workflows
  .yarnrc.yml            # Yarn node-modules linker + packageExtensions
  lefthook.yml           # Root Lefthook placeholder for installed git hooks
  package.json           # Workspace scripts + shared dependencies
  yarn.lock              # Canonical lockfile
```

## Workspace Responsibilities

### `@ultramar/capital`

The canonical investor app. It explains and displays the four strategy families:

- Lending Markets: cross-network lending-rate arbitrage.
- Derivative Arbitrage: options and volatility dislocation strategies.
- Polymarket Arbitrage: prediction-market pricing versus derivatives markets.
- Private Markets: tokenized private-market exposure.

Key docs:

- `apps/capital/README.md`
- `apps/capital/API_ARCHITECTURE.md`
- `apps/capital/STRATEGY_FLOWS.md`
- `apps/capital/docs/`

### `@ultramar/polymarket`

The Polymarket strategy workspace. It contains:

- Next.js dashboard and auth surface.
- Python backend for ingestion, mapping, pricing, signals, execution, risk, reconciliation, and analytics.
- Playwright E2E tests.
- Backend runbooks for live execution controls.

Key docs:

- `apps/polymarket/README.md`
- `apps/polymarket/backend/README.md`
- `apps/polymarket/docs/spec.md`
- `apps/polymarket/docs/GO_LIVE_CHECKLIST.md`
- `apps/polymarket/docs/RUNBOOK_INCIDENTS.md`
- `apps/polymarket/docs/RUNBOOK_KEY_ROTATION.md`

### `@ultramar/private-equities`

The private-market/RWA workspace. It contains:

- Issuer and investor frontend routes.
- QuickBooks OAuth and oracle scoring APIs.
- Portfolio mock/indexing API.
- Foundry contracts for solvency proofs, permissioned asset tokens, deal management, and AMM-style trading.

Key docs:

- `apps/private-equities/README.md`
- `apps/private-equities/contracts/README.md`

## Common Commands

Run from the monorepo root:

```bash
corepack yarn install
corepack yarn workspaces list
corepack yarn lint
corepack yarn typecheck
corepack yarn build
```

Run one workspace:

```bash
corepack yarn workspace @ultramar/capital dev
corepack yarn workspace @ultramar/polymarket dev
corepack yarn workspace @ultramar/private-equities dev
```

Polymarket backend checks:

```bash
corepack yarn workspace @ultramar/polymarket backend:lint
corepack yarn workspace @ultramar/polymarket backend:test
```

Private Equities contracts:

```bash
cd apps/private-equities/contracts
forge build
forge test
```

Deploy one public app from the monorepo root. The build step uses the app-specific config and the deploy step uploads the generated prebuilt output:

```bash
vercel link --yes --project ultramar-capital --scope pachuco
rm -rf .vercel/output
vercel --local-config vercel.capital.json build --prod --yes
vercel deploy --prebuilt --prod --yes
```

Use the same flow with `ultramar-polymarket` and `vercel.polymarket.json`, or `ultramar-private-equities` and `vercel.private-equities.json`.

DNS is managed by Cloudflare nameservers. Before Vercel can issue certificates for the public subdomains, configure these records at the DNS provider:

| Name | Type | Value |
| --- | --- | --- |
| `capital` | `A` | `76.76.21.21` |
| `polymarket` | `A` | `76.76.21.21` |
| `private-equities` | `A` | `76.76.21.21` |

After DNS resolves, assign the production aliases with `vercel alias set <deployment>.vercel.app <subdomain>.ultramar.capital`.

## Operational Status

Updated: 2026-05-12

- Workspace consolidation is complete.
- Active apps live under `apps/*`.
- CI/CD workflows are centralized under `.github/workflows/`.
- All app frontends are on Next.js `16.2.6`.
- Shared packages are consolidated into the root manifest.
- `corepack yarn explain peer-requirements | rg '^p.*→ ✘'` should return no peer failures.
- `yarn dedupe --check` should report no dedupe opportunities.

## Migration Artifacts

Legacy app metadata and lockfiles were moved to `.migration-trash/` during consolidation. They are retained only for history extraction or rollback reference and are not part of the active workspace.

## Definition of Done for Workspace Changes

- Root install succeeds with `corepack yarn install --immutable`.
- No peer failures remain in `corepack yarn explain peer-requirements`.
- `corepack yarn dedupe --check` is clean.
- `corepack yarn lint` passes.
- `corepack yarn typecheck` passes.
- `corepack yarn build` passes across all app workspaces.
