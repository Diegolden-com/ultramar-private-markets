# Ultramar Private Equities Contracts

This Foundry workspace contains the contract layer for `@ultramar/private-equities`, the RWA/private-equity variant of Ultramar.capital.

The contracts model a permissioned market where issuer solvency can be published on-chain, private-equity interests can be represented as restricted ERC20 tokens, and controlled primary or secondary liquidity windows can be tested.

## Contract Map

| File | Component | Purpose |
| --- | --- | --- |
| `src/SolvencyRegistry.sol` | Oracle registry | Stores current and historical solvency/liquidity records for company addresses. Supports direct oracle updates and signed proof submission. |
| `src/AssetToken.sol` | Permissioned asset token | ERC20 share token with whitelist enforcement and dividend accounting. |
| `src/DealManager.sol` | Deal coordinator | Coordinates private-equity deal issuance and lifecycle flows. |
| `src/SimpleAMM.sol` | Secondary-market experiment | Minimal AMM for permissioned asset-token liquidity against a payment token. |
| `src/CapitalWindowRegistry.sol` | Window registry | Schedules primary conversion and secondary liquidity windows with caps, investor limits, oracle freshness, and signed approvals. |
| `src/CapitalWindowHook.sol` | Uniswap v4 hook | Uses `beforeSwapReturnDelta` custom accounting to convert approved USDC exact-input swaps into company-token output. |
| `src/CapitalWindowRouter.sol` | Gated v4 router | Pre-settles investor payment into `PoolManager`, routes through the hook, and delivers company tokens to the approved recipient. |
| `test/*.t.sol` | Contract tests | Proof, trading, and POC test coverage. |
| `script/DeployRegistry.s.sol` | Deployment script | Deploys the solvency registry. |

## Uniswap v4 Direction

`SimpleAMM` is now treated as a local test harness for transfer restrictions and secondary-liquidity concepts. The v4 hackathon direction is `CapitalWindowRegistry` + `CapitalWindowHook` + `CapitalWindowRouter`: a gated conversion pool for scheduled primary capital calls and company-sponsored secondary windows, documented in `../../../docs/UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md`.

Do not deploy public production liquidity from this workspace until the issuer path, investor eligibility rules, transfer controls, custody, audits, and pool chain are approved.

The v4 demo is tested against the real Uniswap v4 `PoolManager` from `v4-core`. It is not a production securities offering, public swap path, or audited deployment.

## Local Dependency Setup

`contracts/lib/` is intentionally gitignored so the repo does not vendor large Foundry dependencies. Rehydrate a fresh checkout with shallow local installs:

```bash
cd apps/private-equities/contracts
forge install --no-git --shallow foundry-rs/forge-std@v1.14.0 OpenZeppelin/openzeppelin-contracts@v5.5.0 Uniswap/v4-core@rev=46c6834698c48bc4a463a86d8420f4eb1d7f3b75
```

The current v4 code only imports `v4-core`; `v4-periphery` is not required for the Capital Windows tests.

## Current Demo Deployment

Mantle Sepolia:

- `SolvencyRegistry`: `0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21`
- Explorer: `https://explorer.sepolia.mantle.xyz/address/0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21`

This deployment is for technical demonstration only. Production use requires legal structuring, transfer restrictions, KYC/KYB, contract audits, custody decisions, and operational controls.

## Local Commands

```bash
forge build
forge test
forge fmt
forge snapshot
```

Run a local node:

```bash
anvil
```

Deploy the registry:

```bash
forge script script/DeployRegistry.s.sol:DeployRegistry --rpc-url <rpc_url> --private-key <private_key> --broadcast
```

## Component Boundaries

- Financial data ingestion and score generation live in `../lib/quickbooks` and `../lib/oracle`.
- API routes that expose oracle and portfolio data live in `../app/api`.
- Investor and issuer UX lives in `../app`.
- These contracts should remain focused on verification, restricted ownership, issuance, dividends, and secondary-market primitives.
