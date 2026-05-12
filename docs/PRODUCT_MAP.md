# Ultramar.capital Product Map

This document is the product taxonomy for the monorepo. Use it when deciding where a feature, bugfix, integration, or document belongs.

## Umbrella

**Ultramar.capital** is the platform brand. It groups multiple investment-product variants under one workspace:

- an allocator app;
- a Polymarket quant strategy engine;
- a private-market/RWA tokenization product.

The workspaces are variants of one product family, not unrelated apps.

## Public Routing

The public app structure uses subdomains under `ultramar.capital`:

| Public host | Product | Workspace |
| --- | --- | --- |
| `capital.ultramar.capital` | Ultramar Capital | `apps/capital` |
| `polymarket.ultramar.capital` | Ultramar Polymarket | `apps/polymarket` |
| `private-equities.ultramar.capital` | Ultramar Private Equities | `apps/private-equities` |

Each frontend includes cross-app navigation links to its sibling Ultramar apps.

## Variants

### Ultramar Capital

Workspace: `apps/capital`

Purpose:

- investor-facing allocator;
- strategy catalogue;
- portfolio dashboard;
- education and risk pages;
- API surface for strategy metadata and lending-market examples.

Owns:

- Capital landing, strategy, dashboard, info, login routes;
- strategy cards and charts;
- investor-facing copy for the four strategy families.

Does not own:

- Polymarket live execution;
- private-equity contract operations;
- issuer accounting integrations.

### Ultramar Polymarket

Workspace: `apps/polymarket`

Purpose:

- Polymarket probability dislocation strategy;
- Black-Scholes/lognormal probability modeling;
- Deribit hedge context;
- signal generation;
- order intent, execution adapter, reconciliation, and risk controls.

Owns:

- Polymarket dashboard and auth shell;
- Python ingestion/pricing/signal/risk/execution backend;
- go-live and incident runbooks;
- E2E tests for the Polymarket frontend.

Does not own:

- the generic investor strategy catalogue;
- RWA/private-equity tokenization contracts.

### Ultramar Private Equities

Workspace: `apps/private-equities`

Purpose:

- private-equity/RWA tokenization experience;
- issuer solvency oracle;
- QuickBooks integration;
- investor portfolio and market views;
- permissioned token and proof contracts.

Owns:

- private-equity frontend routes;
- QuickBooks OAuth and oracle scoring APIs;
- Foundry contracts for solvency proofs, asset tokens, deals, and AMM experiments.

Does not own:

- Polymarket probability modeling;
- general allocator copy outside private markets.

## Shared Rules

- Shared runtime and tooling dependencies belong in the root `package.json` when they are used by more than one workspace.
- Workspace manifests should keep only app-specific packages, except React peer-boundary requirements.
- Product docs should name the variant explicitly: Ultramar Capital, Ultramar Polymarket, or Ultramar Private Equities.
- Architecture docs should say whether they describe implemented behavior, target architecture, or demo/mock surfaces.
- Production securities, live trading, and issuer data workflows require compliance and operational review before being treated as live systems.
