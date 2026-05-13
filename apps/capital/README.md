# Ultramar Capital

`@ultramar/capital` is now a historical allocator workspace. It is no longer the canonical public product surface.

Canonical public app: `apps/ultramar`
Canonical domain: `https://ultramar.capital`

## Current Role

This workspace is retained for source history, strategy catalogue examples, charts, Supabase references, and old allocator documentation. The public taxonomy no longer treats “Capital” as a third product.

The active product taxonomy is:

- **Private Equities**: `/private-equities`
- **Arbitrage Hedge Fund**: `/arbitrage-hedge-fund`

The old Capital strategy ideas map as follows:

| Historical Capital strategy | Current treatment |
| --- | --- |
| Polymarket Arbitrage | Active v1 scope inside Arbitrage Hedge Fund. |
| Private Markets | Active scope inside Private Equities. |
| Lending Markets | Research-only, not an active product. |
| Derivative Arbitrage | Research-only, used as model/hedge context where relevant. |

## Legacy Routes

Legacy public routes on `capital.ultramar.capital` should redirect through the mega app:

- `/` -> `https://ultramar.capital/`
- `/app` -> `/arbitrage-hedge-fund`
- `/app/strategy/polymarket-synthetic-options` -> `/arbitrage-hedge-fund`
- `/app/strategy/private-equities` -> `/private-equities`
- `/info/polymarket-arbitrage` -> `/arbitrage-hedge-fund`
- `/info/private-markets` -> `/private-equities`

The redirect implementation lives in `apps/ultramar/next.config.ts`.

## Local Commands

This workspace can still be run for historical reference:

```bash
corepack yarn workspace @ultramar/capital dev
corepack yarn workspace @ultramar/capital lint
corepack yarn workspace @ultramar/capital build
```

New public UI work should happen in `apps/ultramar`, not here.
