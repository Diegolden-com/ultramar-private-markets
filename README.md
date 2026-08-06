# Ultramar.capital Monorepo

This monorepo hosts the Ultramar capital platform and an independent Real Estate
site. The capital platform has two public product lines:

- **Private Equities**: private-market and tokenized real-world asset workflows.
- **Arbitrage Hedge Fund**: a Polymarket-first quantitative arbitrage fund surface.

The public brand is **Ultramar.capital**. “Capital” is the platform layer, not a
third sellable product on the apex site. **Ultramar Real Estate** is a separate
land-listing vertical at its own subdomain, not a third capital product.

## Canonical App

| Workspace | Role | Public domain |
| --- | --- | --- |
| `apps/ultramar` | Mega app for the canonical public product experience. | `ultramar.capital` |
| `apps/realestate` | Independent selected-land listing experience. | `realestate.ultramar.capital` |
| `packages/product-model` | Shared product names, routes, descriptions, CTAs, and navigation metadata. | Internal package |
| `apps/polymarket` | Historical frontend plus active Python backend/runbooks for the Polymarket arbitrage engine. | No public domain |
| `apps/private-equities` | Historical frontend plus QuickBooks/oracle/contracts implementation reference. | No public domain |
| `apps/capital` | Historical allocator app and strategy documentation. | No public domain |

## Product Taxonomy

The `ultramar.capital` apex app has two public product routes:

- `/private-equities`: issuer, asset, oracle, market, portfolio, and legal/compliance surfaces for tokenized private-market assets.
- `/arbitrage-hedge-fund`: Polymarket arbitrage fund surface with signals, dashboard, risk, and research routes.

Arbitrage Hedge Fund v1 is intentionally **Polymarket-only**. Lending-market and derivative-arbitrage ideas are preserved only as research context until they have complete product, risk, and allocator language.

## Public Routing

`ultramar.capital` is canonical for the capital platform and serves the public app
directly. The only public redirect on that app is `www` to the apex domain:

| Host | Behavior |
| --- | --- |
| `ultramar.capital/*` | Canonical app |
| `www.ultramar.capital/*` | 308 to `https://ultramar.capital/*` |
| `realestate.ultramar.capital/*` | Independent Ultramar Real Estate app |

`realestate.ultramar.capital` is reserved for its own Vercel project, with its own
canonical metadata, sitemap, and robots policy. It must not be routed through the
apex project. Prelaunch subdomains such as `capital.ultramar.capital`,
`polymarket.ultramar.capital`, and `private-equities.ultramar.capital` should not
be aliased in production.

The redirect source of truth lives in `apps/ultramar/next.config.ts`.

## Repository Layout

```text
project-ultramar/
  apps/
    ultramar/            # Canonical mega app
    realestate/          # Independent selected-land listing site
    capital/             # Historical allocator app and docs
    polymarket/          # Polymarket frontend plus Python backend
    private-equities/    # Private-equity frontend, oracle code, contracts
  packages/
    product-model/       # Shared product taxonomy and navigation metadata
  docs/
    PRODUCT_MAP.md       # Canonical product map
  vercel.json            # Canonical Vercel build config for the apex app
```

## Common Commands

Run from the monorepo root:

```bash
corepack yarn install --immutable
corepack yarn dev:ultramar
corepack yarn dev:realestate
corepack yarn lint
corepack yarn typecheck
corepack yarn build
```

Run one workspace:

```bash
corepack yarn workspace @ultramar/ultramar dev
corepack yarn workspace @ultramar/realestate dev
corepack yarn workspace @ultramar/polymarket backend:test
```

Private Equities contracts still live under `apps/private-equities/contracts`:

```bash
cd apps/private-equities/contracts
forge build
forge test
```

## Deployment

The capital-platform deployment builds only the mega app:

```bash
vercel link --yes --project ultramar-capital --scope pachuco
rm -rf .vercel/output
vercel build --prod --yes
vercel deploy --prebuilt --prod --yes
```

Deploy Real Estate as a separate Vercel project with `apps/realestate` as its Root
Directory; its build configuration lives in `apps/realestate/vercel.json`. Then
assign `realestate.ultramar.capital` to that project. The apex project continues to
expose only `ultramar.capital` and `www.ultramar.capital`.

## Definition of Done

- `corepack yarn install --immutable` succeeds.
- `corepack yarn lint` succeeds.
- `corepack yarn typecheck` succeeds.
- `corepack yarn build` succeeds.
- Local smoke tests cover `/`, `/private-equities`, `/private-equities/assets`, `/private-equities/assets/lcx`, `/arbitrage-hedge-fund`, and `/arbitrage-hedge-fund/dashboard`.
- `ultramar.capital` returns 200, `www.ultramar.capital` returns one 308 to apex, and prelaunch subdomains are not aliased.
- `realestate.ultramar.capital` is assigned to the independent Real Estate deployment; unpublished terrain records remain absent from its sitemap and index.
