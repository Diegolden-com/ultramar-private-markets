# Ultramar.capital Monorepo

Ultramar.capital is now a single public platform with two product lines:

- **Private Equities**: private-market and tokenized real-world asset workflows.
- **Arbitrage Hedge Fund**: a Polymarket-first quantitative arbitrage fund surface.

The public brand is **Ultramar.capital**. “Capital” is the platform layer, not a third sellable product.

## Canonical App

| Workspace | Role | Public domain |
| --- | --- | --- |
| `apps/ultramar` | Mega app for the canonical public product experience. | `ultramar.capital` |
| `packages/product-model` | Shared product names, routes, descriptions, CTAs, and navigation metadata. | Internal package |
| `apps/polymarket` | Historical frontend plus active Python backend/runbooks for the Polymarket arbitrage engine. | Redirected into canonical app |
| `apps/private-equities` | Historical frontend plus QuickBooks/oracle/contracts implementation reference. | Redirected into canonical app |
| `apps/capital` | Historical allocator app and strategy documentation. | Redirected into canonical app |

## Product Taxonomy

Ultramar.capital has two public product routes:

- `/private-equities`: issuer, asset, oracle, market, portfolio, and legal/compliance surfaces for tokenized private-market assets.
- `/arbitrage-hedge-fund`: Polymarket arbitrage fund surface with signals, dashboard, risk, and research routes.

Arbitrage Hedge Fund v1 is intentionally **Polymarket-only**. Lending-market and derivative-arbitrage ideas are preserved only as research context until they have complete product, risk, and allocator language.

## Public Routing

`ultramar.capital` is canonical. Legacy subdomains are compatibility and SEO redirects:

| Legacy host | Redirect target |
| --- | --- |
| `www.ultramar.capital/*` | `https://ultramar.capital/*` |
| `capital.ultramar.capital/*` | Canonical home, product, or strategy route |
| `polymarket.ultramar.capital/*` | `/arbitrage-hedge-fund/*` or shared `/auth/*` |
| `private-equities.ultramar.capital/*` | `/private-equities/*` |

The redirect map lives in `apps/ultramar/next.config.ts`.

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

The app-specific Vercel config files now also build `@ultramar/ultramar` so old project links can be used as redirect shells during the transition.

## Definition of Done

- `corepack yarn install --immutable` succeeds.
- `corepack yarn lint` succeeds.
- `corepack yarn typecheck` succeeds.
- `corepack yarn build` succeeds.
- Local smoke tests cover `/`, `/private-equities`, `/private-equities/assets`, `/private-equities/assets/lcx`, `/arbitrage-hedge-fund`, and `/arbitrage-hedge-fund/dashboard`.
- Legacy redirects return 308/301 and land on canonical `ultramar.capital` paths.
