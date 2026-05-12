# Ultramar Private Equities

`@ultramar/private-equities` is the private-market and RWA tokenization variant of Ultramar.capital. It turns issuer financial data into solvency signals, publishes proof records to Mantle, and presents tokenized private assets through an investor-facing interface.

Public host: `private-equities.ultramar.capital`

## Role in Ultramar.capital

Ultramar Private Equities is the specialist product behind the Private Markets strategy shown in `apps/capital`.

Its focus is different from the allocator app:

- **Capital** explains private markets as one strategy in a broader portfolio.
- **Private Equities** owns the issuer/investor workflows, oracle scoring, tokenized asset UX, and contracts.

## Product Scope

The workspace models a permissioned private-market exchange:

- issuer financial data flows in through accounting/banking integrations;
- the oracle computes solvency and liquidity metrics;
- proof records can be signed and published on-chain;
- private-equity/RWA assets are represented as permissioned tokens;
- investors view holdings, deals, market data, and solvency status.

Current app data includes mock/demo paths for portfolio and market views. The QuickBooks/OAuth and proof code is present for the oracle path, while production securities issuance requires legal, KYC/KYB, custody, and compliance gates outside this repository.

## Product Surfaces

- `/`: private-equities landing page.
- `/equities`: tokenized asset list.
- `/equities/[ticker]`: asset detail page.
- `/equities/deals`: deal exploration.
- `/market`: secondary-market view.
- `/portfolio`: investor portfolio shell.
- `/oracle`: solvency oracle view.
- `/info`: product information.
- `/law`: legal/compliance explanation.

## API Surface

- `GET /api/integration/quickbooks/auth`: starts QuickBooks OAuth.
- `GET /api/integration/quickbooks/callback`: handles QuickBooks OAuth callback.
- `GET /api/oracle/score`: returns live QuickBooks-derived metrics when connected, otherwise demo solvency data.
- `GET /api/portfolio`: returns demo portfolio/indexing data for the investor view.

## Contract Subcomponents

Foundry contracts live in `contracts/`.

| Contract | Purpose |
| --- | --- |
| `SolvencyRegistry.sol` | Stores latest and historical solvency proofs for issuer/company addresses. |
| `AssetToken.sol` | Permissioned ERC20 representing private-equity deal shares, including whitelist and dividend accounting. |
| `DealManager.sol` | Coordinates deal lifecycle and token issuance flows. |
| `SimpleAMM.sol` | Minimal AMM-style secondary-market component for token/USDC liquidity experiments. |

Current Mantle Sepolia registry deployment:

- `SolvencyRegistry`: `0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21`
- Explorer: `https://explorer.sepolia.mantle.xyz/address/0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21`

## Technical Stack

- Next.js `16.2.6`
- React `19.2.6`
- TypeScript `5.9.3`
- Tailwind CSS `4.3.0`
- Privy for wallet/auth integration
- QuickBooks OAuth for issuer financial data
- Viem for EVM interactions
- Foundry for Solidity development
- Mantle Sepolia for current proof demo

Dependencies shared with other Ultramar apps are declared in the monorepo root. This app declares only Private Equities-specific packages, plus `react` and `react-dom` because Yarn peer boundaries require React apps to provide them locally.

## Deployment

This workspace is deployed from the monorepo root with `vercel.private-equities.json`:

```bash
vercel link --yes --project ultramar-private-equities --scope pachuco
rm -rf .vercel/output
vercel --local-config vercel.private-equities.json build --prod --yes
vercel deploy --prebuilt --prod --yes
```

The app links to `capital.ultramar.capital` and `polymarket.ultramar.capital` from its navigation shell. The default URLs can be overridden with `NEXT_PUBLIC_ULTRAMAR_CAPITAL_URL` and `NEXT_PUBLIC_ULTRAMAR_POLYMARKET_URL`.

## Local Commands

Frontend from the monorepo root:

```bash
corepack yarn workspace @ultramar/private-equities dev
corepack yarn workspace @ultramar/private-equities lint
corepack yarn workspace @ultramar/private-equities build
```

Contracts:

```bash
cd apps/private-equities/contracts
forge build
forge test
forge fmt
```

## Compliance Notes

This workspace models tokenized Real World Assets and private-equity securities. Production deployment must include:

- investor accreditation and KYC/KYB gates;
- jurisdiction-specific offering exemptions or regulated venue support;
- issuer onboarding and disclosure workflows;
- custody, transfer restrictions, and secondary-market controls;
- audited contracts and oracle operations.

The current Mantle Sepolia deployment is a technical demonstration and does not represent a live offering of securities.

## Related Docs

- `contracts/README.md`: contract-level documentation and Foundry commands.
- `contracts/src/*`: Solidity source.
- `lib/quickbooks/*`: OAuth and QuickBooks service integration.
- `lib/oracle/*`: financial scoring and proof generation.
