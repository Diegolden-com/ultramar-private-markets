# Hookathon winning scorecard: Ultramar Port of Call

Purpose: one-page judge scorecard for why this submission should rank highly, with direct evidence for each claim.

## Core claim

Ultramar Port of Call turns Uniswap v4 hooks into the market boundary for private operating-business capital windows.

The memorable product is Ablo for capital: travel to a local issuer, read translated diligence, receive a passport stamp, then enter a capital window.

The technical hook is concrete: `beforeSwap` verifies authorization and market constraints; `beforeSwapReturnDelta` returns deterministic issuer-token output through v4 custom accounting.

## Scorecard

| Criterion | Why it should score | Proof |
| --- | --- | --- |
| Uniqueness | The project is not a fee hook, a generic allowlist, or a public RWA AMM. It uses v4 to define an asset-class-specific Specialized Market where private-market constraints become settlement rules. | `CapitalWindowHook`, `CapitalWindowRouter`, `docs/HOOKATHON_ACTIVE_THEME_STRATEGY.md`, public demo |
| Functionality | The package includes a live frontend, public deck, scenario simulator, v4 hook, router, registry, local Foundry script, 27 hook tests, capture pipeline, captioned video, and optional Base Sepolia dry-run path. | `corepack yarn hookathon:check`, `corepack yarn hookathon:testnet:proof`, `corepack yarn hookathon:submission:operator` |
| Technical depth | The hook validates router-bound signed passports, exact-input direction, window timing, caps, nonce replay, deadline, issuer proof freshness, minimum output, and public LP reverts. | `apps/private-equities/contracts/test/CapitalWindowHook.t.sol` |
| v4 relevance | The demo uses `PoolManager` settlement and return-delta custom accounting rather than a standalone escrow with a Uniswap label. | `beforeSwap`, `beforeSwapReturnDelta`, `CapitalWindowRouter.unlockCallback` |
| Pricing clarity | The deck explains how pre-money and FX become signed terms before the window opens, then the hook executes the step curve. | Public deck slide `05 / Pricing example`; `testWindowStepCurveQuotesExactPricingExample` |
| Presentation | Judges can understand the product before reading Solidity: travel, guide, passport, capital window, audit trail. | `https://ultramar.capital/hookathon/port-of-call`, video, `docs/HOOKATHON_JUDGE_FAST_PATH.md` |
| Safety boundary | The demo stays a sandbox. It does not claim a public securities offer, live investment access, custody, broker-dealer operation, or production compliance. | Demo badges, `HOOKATHON_README.md`, `docs/HOOKATHON_COMPLETION_AUDIT.md` |

## Five proof points to mention

1. The hook is the market boundary, not decoration.
2. The passport is bound to `CapitalWindowRouter`, so a generic router cannot reuse a valid signature.
3. Public add/remove liquidity reverts because the pool is a specialized capital window, not a public AMM.
4. Pricing is deterministic signed window math, not hidden oracle repricing.
5. Successful settlement emits reconciliation events for CRM, portfolio, issuer reporting, and risk review.

## Pricing proof

The demo pricing curve is explicit:

```text
4.5M USD pre-money / 4.5M LCX fully diluted = 1.00 USDC/LCX base
FX policy = snapshot, then fixed
Tranche 1 = 1,000 USDC at 1.00 USDC/LCX = 1,000.00 LCX
Tranche 2 = 500 USDC at 1.10 USDC/LCX = 454.54 LCX
Effective = 1,500 USDC -> 1,454.54 LCX at 1.0312 USDC/LCX
```

Evidence:

- Deck marker: `Pre-money ledger -> FX snapshot locked -> Hook step curve`.
- Solidity test: `testWindowStepCurveQuotesExactPricingExample`.
- Public captions marker: `testWindowStepCurveQuotesExactPricingExample proves 1,500 USDC returns 1,454.54 LCX at 1.0312 effective`.

## Judge route

Open in order:

1. Demo: https://ultramar.capital/hookathon/port-of-call
2. Deck: https://ultramar.capital/hookathon/port-of-call/deck
3. Video: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
4. Fast path: `docs/HOOKATHON_JUDGE_FAST_PATH.md`
5. Contract tests: `apps/private-equities/contracts/test/CapitalWindowHook.t.sol`

Run:

```bash
corepack yarn hookathon:check
```

Expected terminal close:

```text
Demo complete: one approved settlement, six blocked paths.
```

## Current submission state

As of the latest operator run: Local package failures are `0`.

The only remaining submission blockers are private Tally inputs and the final Tally confirmation receipt:

- `HOOKATHON_SUBMITTER_EMAIL`
- `HOOKATHON_WORKED_WITH_TEAM`
- `HOOKATHON_COURSE_RATING`
- `HOOKATHON_TEAM_DETAILS`, only if team status is `Yes`
- post-submit receipt from the official Tally confirmation
