# Ultramar Private Equities Contracts

This Foundry workspace contains the contract layer for `@ultramar/private-equities`, the RWA/private-equity variant of Ultramar.capital.

The contracts model a permissioned market where issuer solvency can be published on-chain, private-equity interests can be represented as restricted ERC20 tokens, and controlled secondary liquidity can be tested.

## Contract Map

| File | Component | Purpose |
| --- | --- | --- |
| `src/SolvencyRegistry.sol` | Oracle registry | Stores current and historical solvency/liquidity records for company addresses. Supports direct oracle updates and signed proof submission. |
| `src/AssetToken.sol` | Permissioned asset token | ERC20 share token with whitelist enforcement and dividend accounting. |
| `src/DealManager.sol` | Deal coordinator | Coordinates private-equity deal issuance and lifecycle flows. |
| `src/SimpleAMM.sol` | Secondary-market experiment | Minimal AMM for permissioned asset-token liquidity against a payment token. |
| `test/*.t.sol` | Contract tests | Proof, trading, and POC test coverage. |
| `script/DeployRegistry.s.sol` | Deployment script | Deploys the solvency registry. |

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
