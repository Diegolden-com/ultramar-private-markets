# Uniswap v4 permissioned liquidity architecture

Working objective: evaluate whether Ultramar Private Equities can use Uniswap v4 as the secondary-liquidity substrate while preserving the prior counsel-gated boundary: no public purchase, subscription, swap, wire instruction, or binding commitment until the issuer path is approved.

This is architecture guidance, not legal, tax, accounting, or investment advice. Counsel must approve the issuer, investor jurisdictions, transfer restrictions, marketing language, liquidity operations, custody, and funds flow before any production pool or transaction path is exposed.

## Current conclusion

Uniswap v4 is viable only as a controlled secondary-market infrastructure layer, not as a public trading shortcut.

The right direction is:

- Keep Ultramar public pages read-only and informational.
- Keep primary issuance, allocation, subscription, and funds flow outside Uniswap.
- Replace `SimpleAMM` as the long-term liquidity primitive with a Uniswap v4 pool only after legal approval.
- Enforce eligibility and transfer controls through both the restricted `AssetToken` and a Uniswap v4 Hook.
- Use an Ultramar-controlled router/gated app path; reject generic public routes unless they carry approved eligibility context.

## Official v4 premises

Links rechecked on May 13, 2026:

- Uniswap v4 uses hooks, singleton `PoolManager`, flash accounting, dynamic fees, native ETH support, and custom accounting: https://developers.uniswap.org/docs/protocols/v4/concepts/architecture
- `PoolManager` is the single entry point for pools; swaps call `beforeSwap` and `afterSwap` hooks when configured: https://developers.uniswap.org/docs/protocols/v4/concepts/poolmanager
- Flash accounting nets balance deltas and requires callers to resolve outstanding balances before control returns to `PoolManager`: https://developers.uniswap.org/docs/protocols/v4/concepts/flash-accounting
- Hook permissions are encoded in the hook contract address; production deployment needs address mining and permission verification: https://developers.uniswap.org/docs/protocols/v4/guides/hooks/hook-deployment
- Uniswap v4 deployments are chain-specific. Do not assume the same addresses across chains: https://developers.uniswap.org/docs/protocols/v4/deployments
- Uniswap's hook security framework treats hooks as a new risk surface requiring scoring, testing, monitoring, and audit planning: https://developers.uniswap.org/docs/protocols/v4/security

## Chain decision

The current private-equities contracts reference Mantle Sepolia. Official Uniswap v4 deployments are listed for networks such as Ethereum, Base, Arbitrum, Polygon, Unichain, and their supported testnets, but not Mantle in the checked deployment list.

Recommended path:

1. Keep Mantle Sepolia for the existing `SolvencyRegistry` demo until replaced.
2. Prototype the v4 integration on Base Sepolia or Sepolia because official v4 testnet deployments exist there.
3. For production, choose a chain only after counsel, custody, liquidity, investor geography, and issuer reporting requirements are decided.
4. Avoid a cross-chain hook that depends directly on Mantle oracle state. Instead, publish signed oracle proofs onto the target v4 chain or have the hook consume a local `SolvencyRegistry` mirror.

## High-level architecture

```mermaid
flowchart LR
  Issuer["Issuer + Counsel"] --> DataRoom["Data room / terms / transfer policy"]
  DataRoom --> CRM["Ultramar CRM + eligibility ops"]
  CRM --> Eligibility["EligibilityRegistry"]
  CRM --> Policy["TransferPolicyRegistry"]
  Oracle["Accounting / KPI oracle"] --> Solvency["SolvencyRegistry on v4 chain"]

  Eligibility --> Hook["LCXComplianceHook"]
  Policy --> Hook
  Solvency --> Hook

  Investor["Verified investor"] --> App["Gated Ultramar app"]
  App --> Router["UltramarV4Router"]
  Router --> PoolManager["Uniswap v4 PoolManager"]
  Hook --> PoolManager

  AssetToken["Restricted AssetToken"] <--> PoolManager
  USDC["USDC"] <--> PoolManager

  PoolManager --> Events["Events / indexer / audit log"]
  Events --> Portfolio["Portfolio + issuer reporting"]

  Public["Public website"] --> ReadOnly["Read-only asset memo"]
  ReadOnly -. no transaction .-> Investor
```

## Component map

### Public product shell

- `apps/ultramar` remains the canonical public site.
- `/private-equities/assets/lcx` explains the round, target raise, data room state, risks, and missing-before-close blockers.
- `/private-equities/market` must stay read-only until the approved gated workflow exists.
- Public pages never deep-link directly into a Uniswap transaction path.

### Gated Ultramar app

- Handles authentication, KYC/KYB status, investor category, jurisdiction, sanctions checks, NDA status, suitability, and transfer-policy acceptance.
- Shows quotes and pool state only to eligible investors.
- Builds transaction calldata for `UltramarV4Router`.
- Passes signed eligibility context to the v4 Hook through `hookData`.

### `AssetToken`

- Remains a restricted ERC20 representing the private-market interest.
- Separates holder eligibility from transfer authority.
- Approved investors may be eligible to receive and hold the token, but their wallets should not be allowed to initiate unrestricted peer-to-peer transfers.
- Non-mint and non-burn transfers should require an approved transfer agent path, for example:
  - `UltramarV4Router`,
  - approved custody or settlement contracts,
  - issuer/admin-controlled transfer-agent wallets,
  - `PoolManager` only when reached through the approved router and Hook flow.
- The token should consult `EligibilityRegistry` and `TransferPolicyRegistry` before allowing any transfer, even if both `from` and `to` are otherwise approved holders.
- Required infrastructure contracts such as `PoolManager` and `PositionManager` should receive narrowly scoped permissions, not blanket holder-equivalent freedom.
- Token restrictions are the last line of defense if a route bypasses the app or Hook; direct holder-to-holder transfers must fail unless a counsel-approved transfer policy explicitly permits that path.

### `LCXComplianceHook`

Initial hook should be boring and restrictive. Do not ship dynamic fees, custom accounting, custom curves, or autonomous parameter updates in v1.

Recommended callback permissions:

- `beforeInitialize`: allow only issuer/admin-approved pool initialization for the exact LCX/USDC pool.
- `beforeAddLiquidity`: allow only approved issuer, treasury, market-maker, or liquidity-program addresses.
- `beforeRemoveLiquidity`: enforce lockups, notice windows, and approved LP exits.
- `beforeSwap`: require approved router, valid investor eligibility payload, active transfer window, non-expired KYC/KYB, allowed jurisdiction, and no sanctions block.
- `afterSwap`: emit audit events for offchain reconciliation and portfolio updates.

Avoid in v1:

- `beforeSwapReturnDelta` and custom accounting.
- custom curves,
- hook-managed custody,
- automatic fee changes,
- cross-chain state reads inside swap execution.

### `UltramarV4Router`

This is the transaction adapter between the gated app and Uniswap v4.

Responsibilities:

- Decode the authenticated investor session into a compact signed eligibility payload.
- Call v4 periphery/`PoolManager` with the correct pool key and hook data.
- Restrict calls to known LCX pool IDs and approved tokens.
- Prevent generic Universal Router paths from becoming the primary compliance surface.
- Emit app-level events that match CRM stages and portfolio reporting.

### Oracle and reporting

- `SolvencyRegistry` stays separate from the pool.
- The Hook should not price trades from raw accounting data.
- The Hook may use coarse status flags, for example `oracleHealthy`, `proofFresh`, `tradingPaused`, or `issuerDefaultFlag`.
- Detailed issuer data remains private in the data room and investor reporting workflow.

## Lifecycle

### Phase 0: counsel-gated design

- No v4 pool deployed for LCX.
- Public UI remains informational.
- Counsel approves whether secondary liquidity is allowed, under what exemption/path, and who may hold or trade.

### Phase 1: v4 sandbox

- Deploy mock `AssetToken`, `EligibilityRegistry`, `TransferPolicyRegistry`, local `SolvencyRegistry`, `LCXComplianceHook`, and `UltramarV4Router` on Base Sepolia or Sepolia.
- Initialize a test LCX/USDC v4 pool with the mined hook address.
- Test direct PoolManager/router attempts, ineligible investor attempts, expired eligibility, paused transfer windows, and issuer-only LP controls.

### Phase 2: private pilot

- Use production-like KYC/KYB data but non-production capital.
- Run full event indexing, CRM reconciliation, oracle freshness checks, and incident procedures.
- Complete hook security scoring, audit, invariant tests, fuzz tests, and monitoring.

### Phase 3: approved secondary liquidity

- Deploy production contracts only after legal, security, custody, and issuer approvals.
- Open the gated transaction path only to eligible investors.
- Keep public pages as read-only memos with no transaction controls.

## Security and compliance risks

- Public pool discoverability: even a blocked pool may signal a securities market. Do not initialize production pools before counsel approval.
- Route bypass: assume users and aggregators may call v4 directly. The Hook and `AssetToken` must reject unauthorized flows.
- Router ambiguity: `sender` may be the router, not the final investor. The architecture must verify end-beneficiary data through signed hook payloads and app-side routing.
- Hook permission mistakes: because callback permissions are encoded in the deployed address, deployment scripts must verify the permission bitmap.
- Flash-accounting assumptions: hook logic must not rely on stale transient deltas or unresolved balances.
- Token-transfer edge cases: restricted ERC20 behavior must be tested with `PoolManager`, periphery contracts, LP mint/burn, swaps, refunds, and pauses.
- Oracle misuse: accounting proofs should gate status, not silently change pricing.
- Liquidity optics: a v4 pool can look like public market availability; marketing copy must stay counsel-reviewed.

## Migration from current `SimpleAMM`

`SimpleAMM` should become a local test harness and conceptual prototype, not the production liquidity layer.

Migration target:

- Keep `SimpleAMM` tests for simple transfer-restriction proofs.
- Add a new v4 integration workspace under contracts once implementation begins.
- Port the relevant tests:
  - whitelisted investor can swap through the approved route,
  - non-whitelisted investor cannot receive `AssetToken`,
  - unapproved router/direct caller reverts,
  - paused transfer window reverts,
  - issuer/approved LP can add/remove liquidity under policy,
  - event stream reconciles against CRM/portfolio state.

## Open decisions

- Production chain: Base, Arbitrum, Ethereum, Unichain, or another officially supported v4 deployment.
- Token standard: keep restricted ERC20 or migrate to a more securities-specific transfer-control standard.
- Router policy: Ultramar-only router versus allowing approved Universal Router flows with strict hook data.
- LP model: issuer-only liquidity, approved market maker, or tightly capped investor LPs.
- Fee policy: fixed v4 fee tier in v1; dynamic fees only after separate review.
- Oracle gating: which oracle status flags can pause or restrict transfers.
- Custody: self-custody, qualified custody, or broker/custodian-mediated wallets.

## Definition of architecture-ready

The v4 route is architecture-ready when:

- Counsel approves that a secondary liquidity design is permissible for the target investor base.
- The public product remains read-only and cannot initiate transactions.
- The selected chain has confirmed Uniswap v4 deployments for `PoolManager`, periphery, Universal Router, Permit2, Quoter, and StateView.
- The Hook design uses minimal callback permissions and has a verified mined address.
- The restricted token and Hook independently reject unauthorized transfers.
- The gated app, router, CRM, KYC/KYB, oracle status, and portfolio reporting all reconcile from the same investor and pool event model.
- Security review includes hook risk scoring, audits, fuzz/invariant testing, monitoring, and incident procedures.
