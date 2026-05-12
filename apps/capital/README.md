# Ultramar Capital

`@ultramar/capital` is the primary Ultramar.capital allocator app. It is the investor-facing product that explains the strategy suite, shows portfolio surfaces, and routes users into each strategy family.

Public host: `capital.ultramar.capital`

## Role in Ultramar.capital

Ultramar Capital is the umbrella interface for the platform. It does not own every execution engine directly; instead, it organizes the full product family into investor-readable strategies and provides the shared portfolio/education shell.

The four strategy families shown here map to the broader monorepo:

| Capital strategy | Meaning in the product | Related workspace |
| --- | --- | --- |
| Lending Markets | Stablecoin lending and borrowing-rate dislocations across DeFi venues. | `apps/capital` |
| Derivative Arbitrage | Options, volatility, and delta-neutral derivatives logic. | `apps/capital` |
| Polymarket Arbitrage | Prediction-market probabilities compared with derivatives-implied probabilities. | `apps/polymarket` |
| Private Markets | Tokenized private-equity and RWA exposure with solvency proofs. | `apps/private-equities` |

## Product Surfaces

- `/`: brand landing page for Ultramar Capital.
- `/app`: strategy catalogue.
- `/app/strategy/[id]`: detailed strategy page.
- `/dashboard`: investor portfolio dashboard.
- `/info`: education index.
- `/info/lending-markets`: lending strategy overview.
- `/info/derivative-arbitrage`: derivatives strategy overview.
- `/info/polymarket-arbitrage`: Polymarket strategy overview.
- `/info/private-markets`: private-market strategy overview.
- `/info/risk-assessment`: risk methodology.
- `/info/terms`: product and risk terms.
- `/login`, `/login/signin`, `/login/signup`: auth entry points.

## API Surface

Current Next.js API routes:

- `GET /api/strategies`: strategy catalogue metadata.
- `GET /api/strategies/lending-markets/rates`: lending-market rate data.
- `GET /api/strategies/lending-markets/arbitrage`: computed lending arbitrage opportunities.

The broader intended strategy API is documented in `API_ARCHITECTURE.md`. Some routes described there are product architecture targets rather than implemented routes.

## Subcomponents

- `components/navigation.tsx`: primary product navigation.
- `components/strategy-card.tsx`: strategy catalogue cards.
- `components/portfolio-chart.tsx`: dashboard portfolio chart.
- `components/equity-curve-chart.tsx`: strategy detail equity curve chart.
- `components/theme-provider.tsx`: client theme wrapper.
- `components/ui/*`: shared shadcn/Radix primitives used inside this app.
- `lib/supabase/*`: browser and server Supabase clients.
- `scripts/`: local support scripts.
- `supabase/`: local Supabase migrations and seed data for this workspace.

## Technical Stack

- Next.js `16.2.6`
- React `19.2.6`
- TypeScript `5.9.3`
- Tailwind CSS `4.3.0`
- Supabase SSR/client libraries from the root workspace
- Recharts for investor-facing charts
- Radix UI and shadcn-style primitives

Dependencies shared with other Ultramar apps are declared in the monorepo root. This app declares only packages unique to the Capital surface, plus `react` and `react-dom` because Yarn peer boundaries require React apps to provide them locally.

## Deployment

This workspace is deployed from the monorepo root with `vercel.capital.json`:

```bash
vercel link --yes --project ultramar-capital --scope pachuco
rm -rf .vercel/output
vercel --local-config vercel.capital.json build --prod --yes
vercel deploy --prebuilt --prod --yes
```

The app links to `polymarket.ultramar.capital` and `private-equities.ultramar.capital` from its navigation shell. The default URLs can be overridden with `NEXT_PUBLIC_ULTRAMAR_POLYMARKET_URL` and `NEXT_PUBLIC_ULTRAMAR_PRIVATE_EQUITIES_URL`.

## Local Commands

Run from the monorepo root:

```bash
corepack yarn workspace @ultramar/capital dev
corepack yarn workspace @ultramar/capital lint
corepack yarn workspace @ultramar/capital build
```

Root-level checks:

```bash
corepack yarn lint
corepack yarn build
```

## Related Docs

- `API_ARCHITECTURE.md`: target backend/API architecture for the strategy suite.
- `STRATEGY_FLOWS.md`: sequence and flow diagrams for strategy and portfolio logic.
- `docs/POLYMARKET_ARBITRAGE_ANALYSIS.md`: analysis backing the Polymarket strategy thesis.
- `docs/POLYMARKET_BS_SPEC.md`: detailed Black-Scholes/Polymarket specification.
- `Claude.md`: historical codebase notes and implementation details.
