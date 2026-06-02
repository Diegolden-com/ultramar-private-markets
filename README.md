# Ultramar.capital Monorepo

Ultramar.capital is now a single public platform with two product lines:

- **Private Equities**: private-market and tokenized real-world asset workflows.
- **Arbitrage Hedge Fund**: a Polymarket-first quantitative arbitrage fund surface.

The public brand is **Ultramar.capital**. “Capital” is the platform layer, not a third sellable product.

## Uniswap v4 Hookathon: Port of Call

Hookathon judges should start here:

| Item | Link |
| --- | --- |
| Product demo | https://ultramar.capital/hookathon/port-of-call |
| Web pitch deck | https://ultramar.capital/hookathon/port-of-call/deck |
| Demo video | https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm |
| Base Sepolia dry-run proof | https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md |
| Winning scorecard | `docs/HOOKATHON_WINNING_SCORECARD.md` |
| Judge fast path | `docs/HOOKATHON_JUDGE_FAST_PATH.md` |
| Full Hookathon README | `HOOKATHON_README.md` |

The one-line claim: **the hook is the market boundary**. Ultramar Port of Call is an Ablo-style private-market discovery flow where eligible investors travel to a local issuer, receive a signed passport stamp, and enter a Uniswap v4 capital window only if the hook verifies route, authorization, cap, nonce, timing, oracle freshness, and deterministic custom-accounting settlement.

Fast verification:

```bash
corepack yarn hookathon:check
corepack yarn hookathon:testnet:proof
corepack yarn hookathon:submission:operator
```

Current local package status is ready; the only remaining submission work is private Tally input and the final Tally confirmation receipt.

## Canonical App

| Workspace | Role | Public domain |
| --- | --- | --- |
| `apps/ultramar` | Mega app for the canonical public product experience. | `ultramar.capital` |
| `packages/product-model` | Shared product names, routes, descriptions, CTAs, and navigation metadata. | Internal package |
| `apps/polymarket` | Historical frontend plus active Python backend/runbooks for the Polymarket arbitrage engine. | No public domain |
| `apps/private-equities` | Historical frontend plus QuickBooks/oracle/contracts implementation reference. | No public domain |
| `apps/capital` | Historical allocator app and strategy documentation. | No public domain |

## Product Taxonomy

Ultramar.capital has two public product routes:

- `/private-equities`: issuer, asset, oracle, market, portfolio, and legal/compliance surfaces for tokenized private-market assets.
- `/arbitrage-hedge-fund`: Polymarket arbitrage fund surface with signals, dashboard, risk, and research routes.

Arbitrage Hedge Fund v1 is intentionally **Polymarket-only**. Lending-market and derivative-arbitrage ideas are preserved only as research context until they have complete product, risk, and allocator language.

## Public Routing

`ultramar.capital` is canonical and serves the public app directly. The only public redirect is `www` to the apex domain:

| Host | Behavior |
| --- | --- |
| `ultramar.capital/*` | Canonical app |
| `www.ultramar.capital/*` | 308 to `https://ultramar.capital/*` |

Prelaunch subdomains such as `capital.ultramar.capital`, `polymarket.ultramar.capital`, and `private-equities.ultramar.capital` should not be aliased in production.

The redirect source of truth lives in `apps/ultramar/next.config.ts`.

## Repository Layout

```text
project-ultramar/
  apps/
    ultramar/            # Canonical mega app
    capital/             # Historical allocator app and docs
    polymarket/          # Polymarket frontend plus Python backend
    private-equities/    # Private-equity frontend, oracle code, contracts
  packages/
    product-model/       # Shared product taxonomy and navigation metadata
  docs/
    PRODUCT_MAP.md       # Canonical product map
  vercel.json            # Canonical Vercel build config
```

## Common Commands

Run from the monorepo root:

```bash
corepack yarn install --immutable
corepack yarn dev:ultramar
corepack yarn lint
corepack yarn typecheck
corepack yarn build
```

Run one workspace:

```bash
corepack yarn workspace @ultramar/ultramar dev
corepack yarn workspace @ultramar/polymarket backend:test
```

Private Equities contracts still live under `apps/private-equities/contracts`:

```bash
cd apps/private-equities/contracts
forge build
forge test
```

## Deployment

The production deployment should build only the mega app:

```bash
vercel link --yes --project ultramar-capital --scope pachuco
rm -rf .vercel/output
vercel build --prod --yes
vercel deploy --prebuilt --prod --yes
```

The app-specific Vercel config files still build `@ultramar/ultramar` for historical project-level deployments, but public production routing should expose only `ultramar.capital` and `www.ultramar.capital`.

## Definition of Done

- `corepack yarn install --immutable` succeeds.
- `corepack yarn lint` succeeds.
- `corepack yarn typecheck` succeeds.
- `corepack yarn build` succeeds.
- Local smoke tests cover `/`, `/private-equities`, `/private-equities/assets`, `/private-equities/assets/lcx`, `/arbitrage-hedge-fund`, and `/arbitrage-hedge-fund/dashboard`.
- `ultramar.capital` returns 200, `www.ultramar.capital` returns one 308 to apex, and prelaunch subdomains are not aliased.
