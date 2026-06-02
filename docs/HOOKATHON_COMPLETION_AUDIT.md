# Hookathon completion audit: Ultramar Port of Call

Purpose: keep the Hookathon package honest. This file maps the original goal to concrete repo evidence, verification commands, and remaining off-repo work.

## Current verdict

The public submission package is ready to submit as a sandbox demo once the remaining personal Tally fields are filled. The final completion gate is now an ignored local receipt generated after Tally accepts the submission.

The broader goal is not fully complete until the Tally form is submitted and, if required by the current prize rules, the team broadcasts or demonstrates on a supported public testnet.

## Requirement map

| Requirement | Status | Evidence |
| --- | --- | --- |
| Design a memorable use case | Ready | `docs/HOOKATHON_USECASE_ULTRAMAR_PORT_OF_CALL.md` defines Ultramar Port of Call: Ablo-style private-market discovery plus passport-gated v4 capital windows. |
| Leverage Ultramar Capital branding | Ready | `/hookathon/port-of-call` uses Ultramar Private Equities, Lavanderias CX, LCX, capital ports, issuer workroom, and compliance-aware boundaries. |
| Make it Ablo-esque | Ready | The product loop is travel feed -> local guide room -> translated diligence -> passport stamp -> capital window -> return ticket. |
| Align with Atrium course arc | Ready | `docs/HOOKATHON_ATRIUM_ALIGNMENT.md` maps the Safari Atrium outline to return-delta hooks, routers/periphery, hook security, and capstone packaging. |
| Align with official Tally theme | Ready | `docs/HOOKATHON_ACTIVE_THEME_STRATEGY.md` and `docs/HOOKATHON_TALLY_SUBMISSION.md` update the primary framing to UHI8 Specialized Markets because the official Tally form says that is the current theme. Yield-Protected and Fair Flow remain secondary angles. |
| Anchor in Uniswap v4 | Ready | `CapitalWindowHook` uses v4 hook callbacks, `PoolManager`, exact-input routing, flash-accounting settlement, and `beforeSwapReturnDelta` custom accounting. |
| Avoid a generic permissioned pool | Ready | The hook replaces AMM price discovery with a windowed conversion curve, rejects public LP modification, and binds signed passports to `CapitalWindowRouter`. The pricing example is explicit: `4.5M USD` pre-money, `4.5M LCX` sandbox units, signed FX snapshot, `1,000 USDC` step, `10%` tranche premium, and `1,500 USDC -> 1,454.54 LCX` at `1.0312 USDC/LCX` effective. |
| Provide onchain proof | Ready | `apps/private-equities/contracts/test/CapitalWindowHook.t.sol` covers successful primary/secondary flows and adversarial reverts. |
| Provide a judge-visible demo | Ready externally | `https://ultramar.capital/hookathon/port-of-call` is live and `apps/ultramar/app/hookathon/port-of-call/page.tsx` plus `apps/ultramar/components/hookathon-scenario-simulator.tsx` expose the story, controls, simulator, event trail, and revert proof. |
| Provide a judge fast path | Ready | `docs/HOOKATHON_JUDGE_FAST_PATH.md` gives a 10-minute review route through the demo, deck, video, GitHub branch, rubric map, v4 mechanism, and commands. |
| Provide a winning scorecard | Ready | `docs/HOOKATHON_WINNING_SCORECARD.md` compresses the judge-facing case into a one-page rubric map with proof for uniqueness, functionality, technical depth, v4 relevance, pricing clarity, presentation, and safety boundary. |
| Provide a pitch deck link | Ready externally | `https://ultramar.capital/hookathon/port-of-call/deck` is live; `apps/ultramar/app/hookathon/port-of-call/deck/page.tsx` is the web deck for the optional Tally deck field, and `docs/HOOKATHON_SLIDE_DECK.md` stores the claim spine. |
| Provide a local scripted walkthrough | Ready | `apps/private-equities/contracts/script/CapitalWindowDemo.s.sol` prints one approved settlement and six blocked paths. |
| Provide submission copy | Ready | `docs/HOOKATHON_SUBMISSION_FORM.md` contains copy/paste fields, demo URL placeholders, repository map, commands, tests, and disclaimer language. |
| Provide exact Tally answers | Ready | `docs/HOOKATHON_TALLY_SUBMISSION.md` maps every visible Tally field to a concrete answer or required placeholder. |
| Provide final Tally copy packet | Ready | `docs/HOOKATHON_TALLY_FINAL_PACKET.md` gives a single browser-session copy order, link list, pre-submit gates, and post-submit evidence checklist. |
| Provide video/run-of-show | Ready externally | `docs/HOOKATHON_DEMO_RUN_OF_SHOW.md` contains the two-minute recording script, and the public GitHub release includes the rendered WebM plus captions. |
| Provide recording proof artifact | Ready | `corepack yarn hookathon:video:proof` generates `artifacts/hookathon/terminal-proof-latest.md` with required settlement and revert markers for the final video. |
| Provide browser capture assets | Ready | `corepack yarn hookathon:capture:demo` captures key demo frames and `artifacts/hookathon/video/demo-flow-latest.webm` for editing/upload prep. |
| Provide captioned review cut | Ready externally | `corepack yarn hookathon:render:video` renders `artifacts/hookathon/video/final-demo-latest.webm`, captions, and a manifest from the browser frames and terminal proof; the rendered WebM and VTT are uploaded to the public GitHub release. |
| Provide submission preflight | Ready locally | `corepack yarn hookathon:submission:preflight` verifies required repo files, generated artifacts, proof markers, video manifest, and known external Tally placeholders. |
| Provide public-link preflight | Ready externally | `corepack yarn hookathon:links:check` verifies the Tally form, public GitHub branch, raw Tally copy, production demo, production deck, pricing markers, video asset, captions asset, release page, Uniswap v4 whitepaper, public Atrium course page, and v4 docs sources, then writes `artifacts/hookathon/public-links-latest.md`. |
| Provide public render QA | Ready externally | `corepack yarn hookathon:public:render:qa` opens the production demo and deck with Playwright in desktop/mobile viewports, verifies key content including the pricing slide markers (`Pre-money and FX`, `Snapshot, then fixed`, `FX snapshot locked`, `Hook step curve`, `1.0312`), visible media, screenshots, and page-level horizontal overflow, then writes `artifacts/hookathon/public-render-qa-latest.md`. |
| Provide privacy hygiene check | Ready locally | `corepack yarn hookathon:privacy:check` verifies that private submitter inputs, personalized packets, browser-session artifacts, and Tally receipts are ignored by git and not tracked. |
| Provide live Tally field map | Ready externally | `corepack yarn hookathon:tally:field-map` parses the current public Tally form, verifies the UHI8 Specialized Markets marker, maps required fields to `docs/HOOKATHON_TALLY_FINAL_PACKET.md`, and writes `artifacts/hookathon/tally-field-map-latest.md`. |
| Provide live Tally render QA | Ready externally | `corepack yarn hookathon:tally:live:qa` opens the public Tally form with Playwright in desktop/mobile viewports, verifies UHI8/theme and required field copy, checks that it does not appear closed, and writes `artifacts/hookathon/tally-live-qa-latest.md`. |
| Provide Tally fill plan | Ready locally | `corepack yarn hookathon:tally:fill-plan` combines the live Tally field map with the public or private Tally packet, then writes exact field actions to `artifacts/hookathon/tally-fill-plan-latest.md`. |
| Provide Tally browser-session pack | Ready locally | `corepack yarn hookathon:tally:session` turns the fill plan into ignored Markdown/HTML copy aids at `artifacts/hookathon/tally-browser-session-latest.*`. The HTML is submit-ready only after the private personalized packet removes personal placeholders. |
| Provide browser-session QA | Ready locally | `corepack yarn hookathon:tally:session:qa` opens the ignored HTML pack with Playwright, captures desktop/mobile screenshots, checks controls, and verifies no horizontal overflow. |
| Provide final submit operator | Ready locally | `corepack yarn hookathon:submission:operator` refreshes public links, public render QA, Tally field mapping, fill plan, browser session pack, preflight, readiness, and final handoff, then writes ignored `artifacts/hookathon/final-submit-run-latest.md`. In `--strict` mode it requires personal inputs from shell env or ignored `artifacts/hookathon/final-submit.env` and a submit-ready session pack. |
| Provide final submit handoff | Ready locally | `corepack yarn hookathon:submission:handoff` writes ignored `artifacts/hookathon/final-handoff-latest.md` with current branch/sync state, public links including the Base Sepolia dry-run proof, missing private inputs, strict operator gate, Tally open step, receipt command, and completion condition without including personal values. |
| Provide readiness report | Ready locally | `corepack yarn hookathon:readiness` writes `artifacts/hookathon/submission-readiness-latest.md`, separating repo readiness from the personal fields and Tally confirmation evidence still required before the thread goal can be marked complete. |
| Provide private personalized Tally packet | Ready locally | `corepack yarn hookathon:tally:personalize` validates submitter email, team status, course rating, and team details if team status is `Yes`, then writes `artifacts/hookathon/tally-final-personalized-latest.md` without committing personal data. Use `--check-only` to validate without writing. |
| Provide post-submit Tally receipt | Ready locally / external pending | `corepack yarn hookathon:submission:receipt` validates Tally submitted-at time and confirmation evidence, then writes ignored `artifacts/hookathon/submission-receipt-latest.md` and `.json`. The artifact should be generated only after the official form accepts the submission. |
| Keep non-offer/compliance boundary clear | Ready | `HOOKATHON_README.md`, `docs/HOOKATHON_SUBMISSION_FORM.md`, and the demo route use sandbox/non-offer framing. |
| Public GitHub branch | Ready externally after push | `gh repo view Diegolden-com/ultramar-private-markets --json visibility,url` returned `visibility: PUBLIC` and `https://github.com/Diegolden-com/ultramar-private-markets` on May 31, 2026. The Tally copy points judges to `https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui` so they inspect the Hookathon package before it is merged to the default branch. |
| Public frontend deployment | Ready externally | Production routes were redeployed and verified live on June 2, 2026: `https://ultramar.capital/hookathon/port-of-call` and `https://ultramar.capital/hookathon/port-of-call/deck` returned HTTP 200 after Vercel aliasing. The deck route includes the pricing graph markers `FX snapshot locked` and `Hook step curve`, plus `basePrice = preMoneyUsd / fullyDilutedUnits`; both demo and deck expose judge packet links for video, Base Sepolia proof, scorecard, and source branch. |
| Formal Hookathon submission | External pending | The copy is ready, but the actual Atrium/Devfolio/Tally submission must be sent outside the repo. After submission, generate `artifacts/hookathon/submission-receipt-latest.md` with `corepack yarn hookathon:submission:receipt`; until that receipt exists with real confirmation evidence, the goal is not complete. |
| Demo video upload | Ready externally | GitHub release `hookathon-port-of-call-demo-2026-05-31` includes refreshed `final-demo-latest.webm`, captions, and public `testnet-dry-run-latest.md` proof uploaded on June 2, 2026. The WebM is 5,135,057 bytes and the VTT verifies `testWindowStepCurveQuotesExactPricingExample` plus `1.0312 effective`. Direct video URL: `https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm`. |
| Testnet deployment | E2E dry-run ready / broadcast pending | Local v4 proof exists. `docs/HOOKATHON_TESTNET_DEPLOYMENT.md`, `DeployCapitalWindowTestnet.s.sol`, and `ExecuteCapitalWindowTestnetSwap.s.sol` define the public-testnet path. `corepack yarn hookathon:testnet:proof` writes `artifacts/hookathon/testnet-dry-run-latest.md` after a Base Sepolia dry-run without `--broadcast`, including mined hook deployment, window creation, and an approved exact-input smoke swap through the official `PoolManager`; the public report is `https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md`. Explorer-verifiable deployment/swap remains external pending. |

## Verification gate

Run from the monorepo root:

```bash
corepack yarn hookathon:check
```

Optional networked dry-run against Base Sepolia:

```bash
corepack yarn hookathon:testnet:e2e
```

Compact Base Sepolia dry-run proof:

```bash
corepack yarn hookathon:testnet:proof
```

Clean terminal proof for recording:

```bash
corepack yarn hookathon:video:proof
```

Browser capture assets:

```bash
corepack yarn hookathon:capture:demo
```

Captioned WebM review cut:

```bash
corepack yarn hookathon:render:video
```

Submission preflight:

```bash
corepack yarn hookathon:submission:preflight
```

Public link preflight:

```bash
corepack yarn hookathon:links:check
```

Public render QA:

```bash
corepack yarn hookathon:public:render:qa
```

Privacy hygiene check:

```bash
corepack yarn hookathon:privacy:check
```

Live Tally field map:

```bash
corepack yarn hookathon:tally:field-map
```

Live Tally render QA:

```bash
corepack yarn hookathon:tally:live:qa
```

Tally fill plan:

```bash
corepack yarn hookathon:tally:fill-plan
```

Tally browser-session pack:

```bash
corepack yarn hookathon:tally:session
```

Tally browser-session QA:

```bash
corepack yarn hookathon:tally:session:qa
```

Final submit operator:

```bash
corepack yarn hookathon:submission:operator
```

Final submit handoff:

```bash
corepack yarn hookathon:submission:handoff
```

The operator creates an ignored private input file at `artifacts/hookathon/final-submit.env` if it does not already exist.

Submission readiness report:

```bash
corepack yarn hookathon:readiness
```

Post-submit private receipt after Tally confirms:

```bash
HOOKATHON_TALLY_SUBMITTED_AT="REPLACE_WITH_ISO_TIMESTAMP_FROM_CONFIRMATION" HOOKATHON_TALLY_CONFIRMATION="REPLACE_WITH_TALLY_CONFIRMATION_TEXT_OR_ID" HOOKATHON_TALLY_EVIDENCE="REPLACE_WITH_SCREENSHOT_OR_EMAIL_REFERENCE" corepack yarn hookathon:submission:receipt
```

Private personalized Tally packet:

```bash
HOOKATHON_SUBMITTER_EMAIL="you@example.com" HOOKATHON_WORKED_WITH_TEAM="No" HOOKATHON_COURSE_RATING="5" corepack yarn hookathon:tally:personalize
```

If team status is `Yes`, add `HOOKATHON_TEAM_DETAILS`.

Strict final preflight after filling external Tally details:

```bash
corepack yarn hookathon:submission:preflight:strict
```

This should run:

- `corepack yarn workspace @ultramar/ultramar lint`
- `corepack yarn workspace @ultramar/ultramar typecheck`
- `corepack yarn workspace @ultramar/ultramar build`
- `forge test`
- `forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv`

The optional testnet dry-run should simulate deployment through the official Base Sepolia v4 `PoolManager`, mine the hook address to the `0xa88` permission mask, create window `1`, and execute one approved exact-input smoke swap. It does not broadcast.

Expected terminal markers:

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

## Critical tests

Judges should inspect these first:

- `testHookAddressEncodesOnlyCapitalWindowPermissions`
- `testAuthorizationDigestBindsPassportToCapitalRouter`
- `testPrimaryConversionWindowExecutesCustomAccountingSwap`
- `testSecondaryLiquidityWindowRoutesCashToEscrow`
- `testMissingPassportHookDataReverts`
- `testGenericRouterWithCapitalPassportReverts`
- `testExpiredAuthorizationReverts`
- `testAuthorizationReplayReverts`
- `testMinimumOutputSlippageReverts`
- `testStaleOracleReverts`
- `testExactOutputReverts`
- `testUnauthorizedLiquidityModificationReverts`

## Demo recording checklist

1. Start the app with `corepack yarn workspace @ultramar/ultramar dev`.
2. Open `http://localhost:3000/hookathon/port-of-call`.
3. Record the hero, travel feed, passport, quote, Approved simulator state, event reconciliation, Generic router revert, pitch deck close, and terminal markers.
4. Keep the voiceover anchored on one sentence: "The hook is the market boundary."
5. Do not present LCX as publicly available for purchase.
6. Use `docs/HOOKATHON_VIDEO_RECORDING_KIT.md` for capture settings, upload copy, and final QA.

## Source audit

Use public, shareable sources in the submitted materials:

- Uniswap v4 whitepaper: https://app.uniswap.org/whitepaper-v4.pdf
- Uniswap v4 architecture docs: https://developers.uniswap.org/docs/protocols/v4/concepts/architecture
- Uniswap v4 custom accounting docs: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
- Atrium public course outline: https://atrium.academy/uniswap/course
- Atrium 2026 hookathon themes: https://blog.atrium.academy/uniswap-hook-incubator-2025-wrapped
- Atrium/Tally capstone form: https://tally.so/r/VLV1pa

The private Atrium Learn session can inform internal prep, but the submission should cite public sources that judges can open without a logged-in Safari session.

## Remaining decision

If the current Hookathon rules reward explorer-verifiable deployment more than local proof, run the testnet deployment path next and add explorer links to the submission form. If they reward product clarity and technical depth, submit now with the public frontend, public video, public GitHub branch, and `corepack yarn hookathon:check` as the reproducibility proof.
