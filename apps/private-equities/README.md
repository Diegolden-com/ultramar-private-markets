# Ultramar Private Equities

`@ultramar/private-equities` is now the historical frontend and implementation reference workspace for the **Private Equities** product.

Canonical product route: `https://ultramar.capital/private-equities`

## Current Role

The public Private Equities experience has moved into `apps/ultramar`:

- `/private-equities`
- `/private-equities/assets`
- `/private-equities/assets/[ticker]`
- `/private-equities/deals`
- `/private-equities/portfolio`
- `/private-equities/oracle`
- `/private-equities/market`
- `/private-equities/legal`

This workspace remains important for product implementation reference:

- QuickBooks OAuth and issuer financial data integration.
- Oracle scoring and proof-generation code.
- Portfolio mock/indexing API reference.
- Foundry contracts for solvency proofs, permissioned asset tokens, deal management, and AMM-style trading experiments.

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

## Historical Route Mapping

`private-equities.ultramar.capital` is a prelaunch host and should not be aliased in production. If old links need to be interpreted for support or analytics, map them to the canonical app as follows:

- `/` -> `/private-equities`
- `/equities` -> `/private-equities/assets`
- `/equities/[ticker]` -> `/private-equities/assets/[ticker]`
- `/portfolio` -> `/private-equities/portfolio`
- `/market` -> `/private-equities/market`
- `/oracle` -> `/private-equities/oracle`
- `/law` -> `/private-equities/legal`

## Local Commands

Frontend reference:

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

This product models tokenized Real World Assets and private-equity securities. Production deployment must include investor eligibility checks, KYC/KYB, jurisdiction-specific offering review, custody, transfer restrictions, audited contracts, and operating controls.

New public UI work should happen in `apps/ultramar`. Contract, oracle, and issuer-integration work can remain here until a future services migration.
