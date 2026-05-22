# Ultramar.capital Product Map

This is the canonical taxonomy for the monorepo and public product experience.

## Platform

**Ultramar.capital** is the platform brand and the only canonical public domain. It owns the shared home, product navigation, auth entry points, investor context, SEO, and routing policy.

“Capital” should not be presented as a third product. It is the umbrella layer that helps users understand and navigate the two product lines.

## Public Products

| Product | Canonical route | Purpose | Primary audience |
| --- | --- | --- | --- |
| Private Equities | `/private-equities` | Private-market and tokenized RWA workflows: assets, deals, oracle, market, portfolio, and legal boundaries. | Issuers, eligible investors, and operators managing private-market rails. |
| Arbitrage Hedge Fund | `/arbitrage-hedge-fund` | Polymarket-first quantitative arbitrage fund surface: signals, dashboard, risk, and research. | Allocators, quants, and risk reviewers evaluating systematic event-market exposure. |

## Route Ownership

### Private Equities

The Private Equities product owns:

- `/private-equities`
- `/private-equities/assets`
- `/private-equities/assets/[ticker]`
- `/private-equities/deals`
- `/private-equities/portfolio`
- `/private-equities/oracle`
- `/private-equities/market`
- `/private-equities/legal`
- `/api/private-equities/*`

It covers issuer financial data, solvency proof concepts, permissioned private assets, private-market deal discovery, eligible secondary transfer views, and investor portfolio state.

### Arbitrage Hedge Fund

The Arbitrage Hedge Fund product owns:

- `/arbitrage-hedge-fund`
- `/arbitrage-hedge-fund/signals`
- `/arbitrage-hedge-fund/dashboard`
- `/arbitrage-hedge-fund/risk`
- `/arbitrage-hedge-fund/research`
- `/api/arbitrage/*`

V1 is Polymarket-first. The active product compares Polymarket implied probabilities with model probabilities and exposes spreads, confidence, positions, and risk guardrails.

Lending markets and derivative arbitrage are not active public products in this taxonomy. They may appear only in research context until promoted with complete product language and risk controls.

## Legacy Workspaces

| Workspace | Current role |
| --- | --- |
| `apps/ultramar` | Canonical mega app. |
| `packages/product-model` | Shared taxonomy and route metadata. |
| `apps/capital` | Historical allocator implementation and docs. No public production domain. |
| `apps/polymarket` | Historical frontend plus active Python backend and runbooks for the hedge-fund engine. No public production domain. |
| `apps/private-equities` | Historical frontend plus QuickBooks/oracle/contracts implementation reference. No public production domain. |

## Routing Rules

- `ultramar.capital/*` serves the canonical app directly.
- `www.ultramar.capital/*` redirects to `https://ultramar.capital/*`.
- Prelaunch subdomains such as `capital.ultramar.capital`, `polymarket.ultramar.capital`, and `private-equities.ultramar.capital` should not be aliased in production.

The implementation source of truth is `apps/ultramar/next.config.ts`.

## Shared Rules

- Product copy must present exactly two public product choices.
- Shared product names, descriptions, CTAs, and nav links belong in `packages/product-model`.
- App UI should use the same header, footer, product crosslink, and CTA patterns across both products.
- Production securities, live trading, issuer data, and execution workflows require compliance and operational review before being treated as live systems.
