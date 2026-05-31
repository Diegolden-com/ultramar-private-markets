# Ultramar Port of Call

Judge-facing guide for the Uniswap v4 Hookathon submission.

## What it is

Ultramar Port of Call is an Ablo-style private-market discovery flow for local operating businesses. An eligible investor "travels" to a capital port, reviews translated diligence, receives a signed passport stamp, and enters a Uniswap v4 capital window.

The hook is the market boundary:

- No signed passport, no swap.
- No active window, no swap.
- No fresh issuer proof, no swap.
- No public LP behavior.
- Approved exact-input flow settles through v4 custom accounting.

## Try it

Run the product demo:

```bash
corepack yarn workspace @ultramar/ultramar dev
```

Open:

```text
http://localhost:3000/hookathon/port-of-call
```

Optional web pitch deck:

```text
http://localhost:3000/hookathon/port-of-call/deck
```

Run the onchain demo:

```bash
cd apps/private-equities/contracts
forge test --match-contract CapitalWindowHookTest
forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv
```

Run the full local verification:

```bash
corepack yarn hookathon:check
```

Run the optional Base Sepolia dry-run with official v4 `PoolManager`, mined hook address, window creation, and approved smoke swap:

```bash
corepack yarn hookathon:testnet:e2e
```

Generate a clean terminal proof for the demo video:

```bash
corepack yarn hookathon:video:proof
```

Capture browser frames and a short demo clip:

```bash
corepack yarn hookathon:capture:demo
```

Render a captioned WebM review cut for upload/editing:

```bash
corepack yarn hookathon:render:video
```

Run the submission preflight:

```bash
corepack yarn hookathon:submission:preflight
```

Verify the public links that will go into Tally:

```bash
corepack yarn hookathon:links:check
```

Generate the final readiness report:

```bash
corepack yarn hookathon:readiness
```

Generate the private, personalized Tally copy packet without committing personal data:

```bash
HOOKATHON_SUBMITTER_EMAIL="you@example.com" \
HOOKATHON_WORKED_WITH_TEAM="No" \
HOOKATHON_COURSE_RATING="5" \
corepack yarn hookathon:tally:personalize
```

Validate the same inputs without writing a private packet:

```bash
HOOKATHON_SUBMITTER_EMAIL="you@example.com" \
HOOKATHON_WORKED_WITH_TEAM="No" \
HOOKATHON_COURSE_RATING="5" \
corepack yarn hookathon:tally:personalize --check-only
```

Run the final strict preflight after filling external Tally URLs/details:

```bash
corepack yarn hookathon:submission:preflight:strict
```

The script should show:

- Approved settlement: `1500.00` USDC -> `1454.54` LCX at `1.0312` USDC/LCX.
- Missing passport blocked.
- Generic router blocked.
- Expired authorization blocked.
- Minimum output slippage blocked.
- Replayed authorization blocked.
- Stale issuer proof blocked.

The Foundry suite also covers router-bound passport digests, expired authorization deadlines, and signed minimum-output slippage protection.

The testnet dry-run should show a hook address ending in the `0xa88` permission mask plus smoke-swap deltas for `1500` mock USDC -> `1454.54` LCX. It does not broadcast or require funded keys.

## Submission status

- Public frontend, contract tests, demo script, copy, captioned video, and run-of-show are ready for submission.
- Completion audit: `docs/HOOKATHON_COMPLETION_AUDIT.md`
- Optional testnet deployment runbook: `docs/HOOKATHON_TESTNET_DEPLOYMENT.md`
- Atrium course alignment: `docs/HOOKATHON_ATRIUM_ALIGNMENT.md`
- Active theme strategy: `docs/HOOKATHON_ACTIVE_THEME_STRATEGY.md`
- Web deck source: `docs/HOOKATHON_SLIDE_DECK.md`
- Video recording kit: `docs/HOOKATHON_VIDEO_RECORDING_KIT.md`
- Exact Tally answers: `docs/HOOKATHON_TALLY_SUBMISSION.md`
- Final Tally copy packet: `docs/HOOKATHON_TALLY_FINAL_PACKET.md`
- Submission preflight report: `artifacts/hookathon/submission-preflight-latest.md`
- Strict preflight report: `artifacts/hookathon/submission-preflight-strict-latest.md`
- Public link report: `artifacts/hookathon/public-links-latest.md`
- Submission readiness report: `artifacts/hookathon/submission-readiness-latest.md`
- Private personalized Tally packet: `artifacts/hookathon/tally-final-personalized-latest.md`
- Public GitHub branch: `https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui`
- Public demo route: `https://ultramar.capital/hookathon/port-of-call`
- Public deck route: `https://ultramar.capital/hookathon/port-of-call/deck`
- Demo video: `https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm`
- Remaining off-repo work: fill submitter/team/rating fields, submit the form, and deploy to a public testnet only if the current prize rules require it.

## Why Uniswap v4

This is not a bespoke escrow contract with a Uniswap logo. It uses v4 as the settlement substrate:

- `PoolManager` provides the v4 pool and flash-accounting settlement path.
- `beforeSwap` validates the signed capital-window context.
- The authorization digest binds the passport to `CapitalWindowRouter`, so a generic v4 swap router cannot reuse it.
- `beforeSwapReturnDelta` replaces generic AMM price discovery with a windowed conversion curve.
- `beforeAddLiquidity` and `beforeRemoveLiquidity` block public LP behavior for this demo pool.
- Hook and registry events become the audit trail for CRM, portfolio, issuer reporting, and risk review.

## Files to inspect

- Demo route: `apps/ultramar/app/hookathon/port-of-call/page.tsx`
- Pitch deck route: `apps/ultramar/app/hookathon/port-of-call/deck/page.tsx`
- Scenario simulator: `apps/ultramar/components/hookathon-scenario-simulator.tsx`
- Hook: `apps/private-equities/contracts/src/CapitalWindowHook.sol`
- Registry: `apps/private-equities/contracts/src/CapitalWindowRegistry.sol`
- Router: `apps/private-equities/contracts/src/CapitalWindowRouter.sol`
- Demo script: `apps/private-equities/contracts/script/CapitalWindowDemo.s.sol`
- Testnet deploy script: `apps/private-equities/contracts/script/DeployCapitalWindowTestnet.s.sol`
- Testnet swap script: `apps/private-equities/contracts/script/ExecuteCapitalWindowTestnetSwap.s.sol`
- Video render script: `scripts/hookathon-render-video.mjs`
- Public link check script: `scripts/hookathon-public-links-check.mjs`
- Submission readiness script: `scripts/hookathon-readiness-report.mjs`
- Private Tally personalization script: `scripts/hookathon-personalize-tally.mjs`
- Submission preflight script: `scripts/hookathon-submission-preflight.mjs`
- Tests: `apps/private-equities/contracts/test/CapitalWindowHook.t.sol`
- Demo run-of-show: `docs/HOOKATHON_DEMO_RUN_OF_SHOW.md`
- Web deck source: `docs/HOOKATHON_SLIDE_DECK.md`
- Video recording kit: `docs/HOOKATHON_VIDEO_RECORDING_KIT.md`
- Submission copy: `docs/HOOKATHON_SUBMISSION_FORM.md`
- Exact Tally answers: `docs/HOOKATHON_TALLY_SUBMISSION.md`
- Final Tally copy packet: `docs/HOOKATHON_TALLY_FINAL_PACKET.md`
- Full packet: `docs/HOOKATHON_SUBMISSION_PACKET.md`
- Atrium alignment: `docs/HOOKATHON_ATRIUM_ALIGNMENT.md`
- Active theme strategy: `docs/HOOKATHON_ACTIVE_THEME_STRATEGY.md`
- Completion audit: `docs/HOOKATHON_COMPLETION_AUDIT.md`
- Testnet deployment runbook: `docs/HOOKATHON_TESTNET_DEPLOYMENT.md`

## Boundaries

This is a sandbox/testnet technical demo. It is not a public securities offering, broker-dealer activity, custody, investment advice, or a live production transaction path. Production use would require counsel, jurisdiction review, transfer controls, custody decisions, audit, monitoring, and operational approvals.

## Source basis

- Uniswap v4 whitepaper: https://app.uniswap.org/whitepaper-v4.pdf
- Uniswap v4 architecture: https://developers.uniswap.org/docs/protocols/v4/concepts/architecture
- Uniswap v4 custom accounting: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
- Atrium course outline: https://atrium.academy/uniswap/course
- Atrium hookathon themes: https://blog.atrium.academy/uniswap-hook-incubator-2025-wrapped
