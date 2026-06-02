# Hookathon judge fast path: Ultramar Port of Call

Purpose: give judges a 10-minute route through the submission without making them reconstruct the evidence from the whole repo.

## First open

1. Product demo: https://ultramar.capital/hookathon/port-of-call
2. Web deck: https://ultramar.capital/hookathon/port-of-call/deck
3. Demo video: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
4. GitHub branch: https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui
5. Base Sepolia dry-run proof: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md
6. Winning scorecard: `docs/HOOKATHON_WINNING_SCORECARD.md`

One sentence to remember:

> The hook is the market boundary.

Ultramar Port of Call is an Ablo-style discovery app for private-market capital. An eligible investor travels to a local operating business, reads translated diligence, receives a signed passport, and enters a Uniswap v4 capital window only if the hook verifies the route, window, authorization, cap, nonce, and oracle freshness.

## Rubric map

| Scoring area | What to look for | Evidence |
| --- | --- | --- |
| Uniqueness | This is not a fee tweak, public RWA pool, or generic permission list. The product turns private operating-business capital formation into a v4 Specialized Market. | `docs/HOOKATHON_USECASE_ULTRAMAR_PORT_OF_CALL.md`, `docs/HOOKATHON_ACTIVE_THEME_STRATEGY.md`, `/hookathon/port-of-call` |
| Impact | The pattern lets asset-class constraints become settlement rules: eligibility, transfer policy, window timing, ticket size, caps, route provenance, and issuer-proof freshness. | `docs/HOOKATHON_SUBMISSION_PACKET.md`, `docs/HOOKATHON_TALLY_SUBMISSION.md` |
| Functionality | The repo includes a frontend, simulator, v4 hook, router, registry, local demo script, 27 hook tests, video proof, public links, and optional Base Sepolia dry-run path. | `corepack yarn hookathon:check`, `apps/private-equities/contracts/test/CapitalWindowHook.t.sol`, `scripts/hookathon-video-proof.mjs` |
| Presentation | The story is legible before the code: travel, guide, passport, capital window. The deck and video then lead into the technical proof. | `docs/HOOKATHON_SLIDE_DECK.md`, `docs/HOOKATHON_DEMO_RUN_OF_SHOW.md`, public deck and video |

## v4 mechanism

Inspect these files first:

- `apps/private-equities/contracts/src/CapitalWindowHook.sol`
- `apps/private-equities/contracts/src/CapitalWindowRouter.sol`
- `apps/private-equities/contracts/src/CapitalWindowRegistry.sol`
- `apps/private-equities/contracts/test/CapitalWindowHook.t.sol`
- `apps/private-equities/contracts/script/CapitalWindowDemo.s.sol`

The hook uses the v4 flow as the settlement substrate:

- `beforeSwap` verifies approved router provenance, exact-input direction, signed passport, deadline, nonce, cap, window state, and issuer proof freshness.
- `beforeSwapReturnDelta` performs custom accounting so the pool interaction returns window-priced issuer-token output rather than generic AMM price discovery.
- `beforeAddLiquidity` and `beforeRemoveLiquidity` block public LP behavior for the demo pool.
- `CapitalWindowRouter` routes the approved transaction into `PoolManager`, so the demo is not a standalone escrow contract with a Uniswap label.

Pricing is explicit window math, not hidden oracle repricing:

- `4.5M USD` pre-money and `4.5M LCX` sandbox units produce a `1.00 USDC/LCX` base price.
- MXN operating economics use a signed FX snapshot before the USDC window opens.
- A `1,000 USDC` step with a `10%` tranche premium returns `1,454.54 LCX` for `1,500 USDC`, or `1.0312 USDC/LCX` effective.
- The public deck shows this as slide `05 / Pricing example`, including the visual bridge `Pre-money ledger -> FX snapshot locked -> Hook step curve`.

## Fast local verification

Run the full local package gate:

```bash
corepack yarn hookathon:check
```

Expected proof markers:

```text
APPROVED window 1
MISSING PASSPORT window 2
GENERIC ROUTER window 3
EXPIRED AUTHORIZATION window 4
MIN OUTPUT window 5
REPLAY window 6
STALE ORACLE window 7
Demo complete: one approved settlement, six blocked paths.
```

Run only the contract-focused path:

```bash
cd apps/private-equities/contracts
forge test --match-contract CapitalWindowHookTest
forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv
```

Optional public-testnet simulation, without broadcasting:

```bash
corepack yarn hookathon:testnet:e2e
```

Compact Base Sepolia dry-run proof report:

```bash
corepack yarn hookathon:testnet:proof
```

Public report: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md

It verifies a non-broadcast dry-run against chain `84532`, the official Base Sepolia `PoolManager`, a mined hook address ending in `0xa88`, window `1`, and the same `1,500 USDC -> 1,454.54 LCX` quote shown in the pricing slide.

## Technical questions

| Question | Short answer | Proof |
| --- | --- | --- |
| Why Uniswap v4? | Hooks and custom accounting let a standard pool become a specialized capital-window market. | `beforeSwap`, `beforeSwapReturnDelta`, `PoolManager` route |
| Why not a bespoke escrow? | v4 provides the pool interface, singleton settlement, flash accounting, and composable route surface while the hook owns market-specific rules. | `CapitalWindowRouter`, `CapitalWindowHook` |
| How is price determined? | Approved round and FX terms set the base price before the window opens; the hook applies the configured step curve and emits the effective price. | `CapitalWindowRegistry._quote`, deck slide `05 / Pricing example` |
| Can a generic router bypass the gate? | No. Passport signatures bind the authorization to `CapitalWindowRouter`; generic-router reuse reverts. | `testGenericRouterWithCapitalPassportReverts` |
| Can users add public liquidity? | No. Public add/remove liquidity reverts in the demo pool. | `testUnauthorizedLiquidityModificationReverts` |
| Can a stale issuer proof execute? | No. Oracle freshness is checked before settlement. | `testStaleOracleReverts` |
| Is this claiming production compliance? | No. It is a sandbox/testnet technical demo with explicit non-offer boundaries. | `HOOKATHON_README.md`, demo UI, video copy |

## Boundary

This submission is a sandbox/testnet demo, not a live securities market, broker-dealer workflow, custody product, investment advice, or public purchase path. Production deployment would require counsel, jurisdiction review, transfer controls, custody decisions, audits, monitoring, and operational approvals.
