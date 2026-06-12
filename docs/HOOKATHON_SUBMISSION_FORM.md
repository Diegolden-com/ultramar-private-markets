# Hookathon submission form copy

Use this file as the copy/paste source for Atrium, Tally, GitHub README, Devfolio-style forms, or the demo video description.

## Project name

Ultramar Port of Call

## Tagline

Investment ports for local operating businesses, powered by Uniswap v4 custom accounting.

## Short description

Ultramar Port of Call is an Abloh-inspired private-market discovery app where eligible investors travel to local operating businesses, review translated diligence, see whether administration has created underwritable claims, receive a signed passport stamp, and choose an equity window, debt covenant preview, secondary transfer, or conversion route. The v4 hook enforces route-bound exact-input execution, investor eligibility, signed allocation, window caps, oracle freshness, covenant freshness, and public-liquidity blocking.

## Long description

Private-market capital breaks before settlement. Cross-border investors struggle with language, diligence, eligibility, legal boundaries, allocation, and reporting. Issuers struggle to present operating proof without turning public materials into an uncontrolled offering.

Ultramar Port of Call turns that into a v4-native flow:

1. An investor opens a global feed of "ports" and enters a local issuer room.
2. The app presents translated diligence, use of funds, risk notes, and oracle freshness.
3. The operating readiness map turns admin control, omnichannel margin, current asset coverage, and reporting freshness into route-specific claims.
4. Eligibility checks produce a signed passport payload: window id, investor, minimum output, deadline, nonce, and authorizer signature.
5. Capital-route intake separates the restricted LCX sandbox equity window from the debt covenant preview.
6. `CapitalWindowRouter` routes exact-input demo USDC into Uniswap v4 `PoolManager` for the restricted equity proof.
7. `CapitalWindowHook` uses `beforeSwap` and `beforeSwapReturnDelta` custom accounting to consume the equity window and return restricted issuer-token output.
8. The hook and registry emit reconciliation events for CRM, portfolio, issuer reporting, and audit review.

The demo asset is Lavanderias CX, a Mexico City operating-business expansion-round sandbox. The implementation is a technical proof and demo only; it is not a public securities offering, audited deployment, or real-money transaction path.

## Problem

Private-market access is often presented as a marketplace problem, but the real bottleneck is trust and controlled execution. A normal public AMM is the wrong primitive for private company investment ports because route selection, participation, timing, price terms, covenant coverage, transfer rights, data freshness, and legal gates are not continuous public variables.

## Solution

Use Uniswap v4 as the programmable settlement layer for controlled investment ports:

- Operating readiness maps business work to market access: admin control supports issuer proof, omnichannel margin supports equity, current asset coverage supports debt, and reporting freshness controls hook access.
- Primary conversion windows route investor payment to issuer treasury and release restricted issuer tokens.
- Debt covenant previews open only while creditor eligibility and coverage proof are fresh.
- Secondary windows route payment to seller escrow or settlement recipients and release controlled inventory to approved buyers.
- The public website remains informational.
- The gated app creates signed passport context.
- The hook enforces the selected route at execution time.

## Why Uniswap v4

Uniswap v4 matters because hooks and custom accounting let a pool become a specialized market instead of a generic price curve.

- `beforeSwap` validates route, investor, authorization, cap, ticket, deadline, nonce, window timing, token direction, and oracle freshness.
- `beforeSwapReturnDelta` replaces generic AMM execution with a signed window settlement schedule.
- `beforeAddLiquidity` and `beforeRemoveLiquidity` reject public liquidity modification.
- The singleton `PoolManager` and flash-accounting model keep the demo on actual v4 rails.
- Hook and registry events create a reconciliation trail.

## Hook permissions

The demo hook uses the minimal permissions needed for the capital-route flow:

- `beforeSwap`
- `beforeSwapReturnDelta`
- `beforeAddLiquidity`
- `beforeRemoveLiquidity`

The demo does not require `afterSwap`, dynamic fees, public LP flow, native ETH, or cross-chain reads.

## Demo URL

Local demo route:

```text
http://localhost:3000/hookathon/port-of-call
```

Production/public route, verified live on June 11, 2026:

```text
https://ultramar.capital/hookathon/port-of-call
```

## GitHub repo

```text
https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui
```

Repository visibility was verified as public on May 31, 2026. Use this branch URL until the Hookathon package is merged into the default branch.

## Demo video

Direct WebM:

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
```

Release page with captions:

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/tag/hookathon-port-of-call-demo-2026-05-31
```

## Repository map

- Demo app: `apps/ultramar/app/hookathon/port-of-call/page.tsx`
- Scenario simulator: `apps/ultramar/components/hookathon-scenario-simulator.tsx`
- Hook: `apps/private-equities/contracts/src/CapitalWindowHook.sol`
- Registry: `apps/private-equities/contracts/src/CapitalWindowRegistry.sol`
- Router: `apps/private-equities/contracts/src/CapitalWindowRouter.sol`
- Local demo script: `apps/private-equities/contracts/script/CapitalWindowDemo.s.sol`
- Optional testnet deploy script: `apps/private-equities/contracts/script/DeployCapitalWindowTestnet.s.sol`
- Optional testnet swap script: `apps/private-equities/contracts/script/ExecuteCapitalWindowTestnetSwap.s.sol`
- Tests: `apps/private-equities/contracts/test/CapitalWindowHook.t.sol`
- Technical runbook: `apps/private-equities/contracts/README.md`
- Demo run-of-show: `docs/HOOKATHON_DEMO_RUN_OF_SHOW.md`
- Judge fast path: `docs/HOOKATHON_JUDGE_FAST_PATH.md`
- Winning scorecard: `docs/HOOKATHON_WINNING_SCORECARD.md`
- Video recording kit: `docs/HOOKATHON_VIDEO_RECORDING_KIT.md`
- Exact Tally answers: `docs/HOOKATHON_TALLY_SUBMISSION.md`
- Final Tally packet: `docs/HOOKATHON_TALLY_FINAL_PACKET.md`
- Submit-now checklist: `docs/HOOKATHON_SUBMIT_NOW.md`
- Atrium alignment: `docs/HOOKATHON_ATRIUM_ALIGNMENT.md`
- Active Tally theme strategy: `docs/HOOKATHON_ACTIVE_THEME_STRATEGY.md`
- Architecture doc: `docs/UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md`
- Use case: `docs/HOOKATHON_USECASE_ULTRAMAR_PORT_OF_CALL.md`
- Submission packet: `docs/HOOKATHON_SUBMISSION_PACKET.md`
- Completion audit: `docs/HOOKATHON_COMPLETION_AUDIT.md`

## Commands to verify

```bash
cd apps/private-equities/contracts
forge test --match-contract CapitalWindowHookTest
forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv
```

```bash
corepack yarn hookathon:check
```

```bash
corepack yarn hookathon:links:check
corepack yarn hookathon:public:render:qa
corepack yarn hookathon:submission:operator
```

```bash
corepack yarn hookathon:testnet:e2e
```

```bash
corepack yarn hookathon:video:proof
```

```bash
corepack yarn hookathon:capture:demo
```

```bash
corepack yarn workspace @ultramar/ultramar lint
corepack yarn workspace @ultramar/ultramar typecheck
corepack yarn workspace @ultramar/ultramar build
```

## Tests judges should inspect

- `testHookAddressEncodesOnlyCapitalWindowPermissions`: hook address encodes only the required v4 permissions.
- `testAuthorizationDigestBindsPassportToCapitalRouter`: passport signatures are bound to the approved router address.
- `testWindowStepCurveQuotesExactPricingExample`: the exact test name is preserved while the window curve proves the signed demo term, `1,500 demo USDC -> 1,454.54 sandbox restricted LCX` at `1.0312 demo USDC/restricted LCX` effective price.
- `testPrimaryConversionWindowExecutesCustomAccountingSwap`: approved primary equity window succeeds.
- `testSecondaryLiquidityWindowRoutesCashToEscrow`: approved secondary window routes cash to escrow.
- `testMissingPassportHookDataReverts`: no passport payload, no swap.
- `testGenericRouterWithCapitalPassportReverts`: a valid passport signed for `CapitalWindowRouter` cannot be reused through a generic v4 swap router.
- `testExpiredAuthorizationReverts`: expired signed deadlines are rejected.
- `testAuthorizationReplayReverts`: signed authorization cannot be reused.
- `testMinimumOutputSlippageReverts`: signed minimum-output protection is enforced.
- `testStaleOracleReverts`: stale issuer proof blocks conversion.
- `testExactOutputReverts`: exact-output execution is rejected.
- `testUnauthorizedLiquidityModificationReverts`: public liquidity modification is blocked.

The two successful flow tests also assert `WindowConsumed` and `CapitalWindowHookSwap` events, and the exact pricing test ties the signed demo term curve to Solidity math. The local demo script prints one approved settlement with human-readable raw output (`1500.00` USDC -> `1454.54` LCX at `1.0312` USDC/LCX), representing `1,500 demo USDC` into `1,454.54 sandbox restricted LCX` at `1.0312 demo USDC/restricted LCX`, plus missing-passport, generic-router, expired-authorization, minimum-output, replay, and stale-oracle blocked paths. The web deck now shows the same curve visually: `4.5M USD` sandbox pre-money and `4.5M restricted LCX sandbox units` produce a `1.00 demo USDC/restricted LCX signed term`, MXN economics are translated through a signed FX snapshot before the restricted demo window opens, the active window stays fixed after that snapshot, and a floating FX policy can only refresh the next window. A `1,000 demo USDC` step with a `10%` premium creates the approved effective demo price. The demo page includes an operating readiness map, a scenario simulator for the primary judge-visible states plus generic-router bypass rejection, and a mock indexer panel that maps successful events into CRM, portfolio, issuer reporting, and risk review rows.

## Two-minute video script

**0:00 - Problem**

"Private-market capital does not fail at the final transfer. It fails earlier: language, diligence, eligibility, allocation, legal restrictions, and reporting are all disconnected."

**0:08 - Market readiness**

"The Walmart lesson becomes an operating-company question: what changed inside LCX that makes equity or debt investible?"

**0:16 - Operating readiness**

"Admin work becomes underwriting evidence. Daily close, margin route, current asset coverage, and reporting freshness become route-specific claims."

**0:25 - Success path**

"An approved investor sends exact-input demo USDC through `CapitalWindowRouter`. The hook verifies the demo window, oracle freshness, caps, signature, and token direction. Custom accounting returns restricted LCX sandbox output from the signed term curve, not from public AMM price discovery."

**0:35 - Debt and route proof**

"A stale coverage proof closes the debt route. A valid passport also cannot ride a generic router. The hook is the market boundary."

**1:25 - Close**

"This is not a public securities AMM. It is a v4-native primitive for controlled, auditable private-market investment ports."

## Judge checklist

- Clear non-generic use case: yes, investment ports for local operating businesses.
- Abloh-inspired product loop: yes, global ports, translation, local guide room, passport stamp.
- Operating readiness thesis: yes, admin work becomes underwriting evidence before any swap.
- Uniswap v4-native mechanism: yes, hooks, `PoolManager`, flash accounting, custom accounting, return deltas.
- Tests: yes, success paths, reverts, replay protection, missing passport, stale oracle, exact-output rejection, liquidity blocking, event trail.
- Brand leverage: yes, Ultramar Private Equities, LCX, issuer workroom, oracle, compliance boundary.
- Production realism: yes, sandbox/non-offer language, counsel/audit/custody disclaimers.

## Prize framing

Primary:

**Specialized Markets** - private-market investment ports are asset-class-specific liquidity. The hook models route selection, investor eligibility, transfer boundaries, ticket size, caps, window timing, covenant coverage, oracle freshness, and router provenance, which a generic public AMM does not model.

Secondary:

**Yield-Protected AMM** - private-market inventory is not left in a passive public LP pool. Public liquidity modification is blocked, issuer or escrow inventory is consumed only inside signed windows, and custom accounting settles reviewed exact-input terms.

Tertiary:

**Fair Flow Frontier** - signed, exact-input, windowed order flow with replay protection, caps, and eligibility.

Future:

**Curated Liquidity** - future curators can bring vetted local issuers, diligence rooms, and reporting quality.

## Non-offer disclaimer

This demo is for technical demonstration only. It is not legal, tax, accounting, or investment advice. It is not an offer to sell securities, a public exchange, broker-dealer activity, investment-adviser activity, custody, funds flow, or a live production transaction path. Production use would require issuer counsel, jurisdiction review, transfer controls, custody decisions, audits, monitoring, and operational approvals.

## Source basis

- Uniswap v4 whitepaper: https://app.uniswap.org/whitepaper-v4.pdf
- Uniswap v4 architecture: https://developers.uniswap.org/docs/protocols/v4/concepts/architecture
- Uniswap v4 custom accounting: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
- Atrium Uniswap course outline: https://atrium.academy/uniswap/course
- Atrium hookathon themes: https://blog.atrium.academy/uniswap-hook-incubator-2025-wrapped
