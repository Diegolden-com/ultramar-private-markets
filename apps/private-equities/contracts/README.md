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
| `script/CapitalWindowDemo.s.sol` | Local hookathon demo | Runs one approved capital window plus six blocked paths without RPC or broadcast. |
| `script/DeployCapitalWindowTestnet.s.sol` | Optional Hookathon testnet deployment | Mines a real v4 hook address, deploys the Capital Window stack, initializes an LCX/USDC pool, and creates one sandbox window. |
| `script/ExecuteCapitalWindowTestnetSwap.s.sol` | Optional Hookathon testnet swap | Signs a passport payload and executes one approved exact-input swap against a deployed sandbox window. |
| `script/DeployRegistry.s.sol` | Deployment script | Deploys the solvency registry. |

## Uniswap v4 Direction

`SimpleAMM` is now treated as a local test harness for transfer restrictions and secondary-liquidity concepts. The v4 hackathon direction is `CapitalWindowRegistry` + `CapitalWindowHook` + `CapitalWindowRouter`: a gated conversion pool for scheduled primary capital calls and company-sponsored secondary windows, documented in `../../../docs/UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md`.

Do not deploy public production liquidity from this workspace until the issuer path, investor eligibility rules, transfer controls, custody, audits, and pool chain are approved.

The v4 demo is tested against the real Uniswap v4 `PoolManager` from `v4-core`. It is not a production securities offering, public swap path, or audited deployment.

Optional public-testnet deployment instructions live in `../../../docs/HOOKATHON_TESTNET_DEPLOYMENT.md`. Use that path only for Hookathon evidence; it still deploys mock tokens and a sandbox window.

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

## Hookathon Demo Runbook

Use this sequence to rehearse the Port of Call technical demo locally:

```bash
cd apps/private-equities/contracts
forge test --match-contract CapitalWindowHookTest
forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv
```

From the monorepo root, `corepack yarn hookathon:check` runs the Ultramar app checks plus the Foundry test suite and local demo script.

From the monorepo root, `corepack yarn hookathon:testnet:e2e` runs a Base Sepolia dry-run against the official v4 `PoolManager`, mines the hook address, initializes the LCX/USDC pool, creates one sandbox window, and executes one approved exact-input smoke swap. It does not broadcast.

The local demo script should print these judge-facing markers:

- `APPROVED window`: exact input `1500.00` USDC, quoted `1454.54` LCX output, effective price `1.0312` USDC/LCX.
- `MISSING PASSPORT window`: blocked because `hookData` is required.
- `GENERIC ROUTER window`: blocked because the passport is bound to `CapitalWindowRouter`.
- `EXPIRED AUTHORIZATION window`: blocked because the signed passport deadline has expired.
- `MIN OUTPUT window`: blocked because signed minimum output exceeds the quote.
- `REPLAY window`: blocked because the authorization nonce was already consumed.
- `STALE ORACLE window`: blocked because the issuer proof is stale.

The hookathon-critical tests are:

- `testHookAddressEncodesOnlyCapitalWindowPermissions`: the demo hook address encodes only `beforeAddLiquidity`, `beforeRemoveLiquidity`, `beforeSwap`, and `beforeSwapReturnDelta`.
- `testAuthorizationDigestBindsPassportToCapitalRouter`: the signed passport digest changes if a generic router replaces `CapitalWindowRouter`.
- `testPrimaryConversionWindowExecutesCustomAccountingSwap`: approved LCX/USDC capital window succeeds through custom accounting.
- `testSecondaryLiquidityWindowRoutesCashToEscrow`: secondary window routes cash to seller escrow and company tokens to the approved buyer.
- Both successful conversion tests assert the audit trail events: `WindowConsumed` from the registry and `CapitalWindowHookSwap` from the hook.
- `testMissingPassportHookDataReverts`: a swap without the signed passport payload reverts.
- `testGenericRouterWithCapitalPassportReverts`: a signed passport bound to `CapitalWindowRouter` cannot be replayed through a generic v4 swap router.
- `testExpiredAuthorizationReverts`: expired passport deadlines cannot consume the window.
- `testAuthorizationReplayReverts`: the same signed authorization cannot be reused.
- `testMinimumOutputSlippageReverts`: signed minimum-output protection blocks stale or overoptimistic quotes.
- `testUnapprovedInvestorReverts`: ineligible investors cannot consume the window.
- `testStaleOracleReverts`: stale issuer proof closes the window.
- `testExactOutputReverts`: exact-output style execution is rejected.
- `testUnauthorizedLiquidityModificationReverts`: public liquidity modification is blocked.

Demo narrative:

1. Show the Ultramar Port of Call app route at `/hookathon/port-of-call`.
2. Explain that the frontend passport stamp becomes `hookData`.
3. Run `forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv`.
4. Point to the approved settlement output: exact-input USDC, quoted LCX, effective price, and treasury/investor balances.
5. Point to the blocked paths: missing passport, generic router, expired authorization, minimum output, replayed authorization, and stale issuer proof.
6. Close with the constraint: this is sandbox/testnet capital-window infrastructure, not a public securities market.

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
