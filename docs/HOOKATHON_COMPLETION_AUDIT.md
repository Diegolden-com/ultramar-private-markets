# Hookathon completion audit: Ultramar Port of Call

Purpose: keep the Hookathon package honest. This file maps the original goal to concrete repo evidence, verification commands, and remaining off-repo work.

## Current verdict

The public submission package is ready to submit as a sandbox demo once the remaining personal Tally fields are filled.

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
| Avoid a generic permissioned pool | Ready | The hook replaces AMM price discovery with a windowed conversion curve, rejects public LP modification, and binds signed passports to `CapitalWindowRouter`. |
| Provide onchain proof | Ready | `apps/private-equities/contracts/test/CapitalWindowHook.t.sol` covers successful primary/secondary flows and adversarial reverts. |
| Provide a judge-visible demo | Ready externally | `https://ultramar.capital/hookathon/port-of-call` is live and `apps/ultramar/app/hookathon/port-of-call/page.tsx` plus `apps/ultramar/components/hookathon-scenario-simulator.tsx` expose the story, controls, simulator, event trail, and revert proof. |
| Provide a pitch deck link | Ready externally | `https://ultramar.capital/hookathon/port-of-call/deck` is live; `apps/ultramar/app/hookathon/port-of-call/deck/page.tsx` is the web deck for the optional Tally deck field, and `docs/HOOKATHON_SLIDE_DECK.md` stores the claim spine. |
| Provide a local scripted walkthrough | Ready | `apps/private-equities/contracts/script/CapitalWindowDemo.s.sol` prints one approved settlement and six blocked paths. |
| Provide submission copy | Ready | `docs/HOOKATHON_SUBMISSION_FORM.md` contains copy/paste fields, demo URL placeholders, repository map, commands, tests, and disclaimer language. |
| Provide exact Tally answers | Ready | `docs/HOOKATHON_TALLY_SUBMISSION.md` maps every visible Tally field to a concrete answer or required placeholder. |
| Provide video/run-of-show | Ready externally | `docs/HOOKATHON_DEMO_RUN_OF_SHOW.md` contains the two-minute recording script, and the public GitHub release includes the rendered WebM plus captions. |
| Provide recording proof artifact | Ready | `corepack yarn hookathon:video:proof` generates `artifacts/hookathon/terminal-proof-latest.md` with required settlement and revert markers for the final video. |
| Provide browser capture assets | Ready | `corepack yarn hookathon:capture:demo` captures key demo frames and `artifacts/hookathon/video/demo-flow-latest.webm` for editing/upload prep. |
| Provide captioned review cut | Ready externally | `corepack yarn hookathon:render:video` renders `artifacts/hookathon/video/final-demo-latest.webm`, captions, and a manifest from the browser frames and terminal proof; the rendered WebM and VTT are uploaded to the public GitHub release. |
| Provide submission preflight | Ready locally | `corepack yarn hookathon:submission:preflight` verifies required repo files, generated artifacts, proof markers, video manifest, and known external Tally placeholders. |
| Keep non-offer/compliance boundary clear | Ready | `HOOKATHON_README.md`, `docs/HOOKATHON_SUBMISSION_FORM.md`, and the demo route use sandbox/non-offer framing. |
| Public GitHub branch | Ready externally after push | `gh repo view Diegolden-com/ultramar-private-markets --json visibility,url` returned `visibility: PUBLIC` and `https://github.com/Diegolden-com/ultramar-private-markets` on May 31, 2026. The Tally copy points judges to `https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui` so they inspect the Hookathon package before it is merged to the default branch. |
| Public frontend deployment | Ready externally | Production routes verified live on May 31, 2026: `https://ultramar.capital/hookathon/port-of-call` and `https://ultramar.capital/hookathon/port-of-call/deck` returned HTTP 200 with the expected Hookathon and deck content. |
| Formal Hookathon submission | External pending | The copy is ready, but the actual Atrium/Devfolio/Tally submission must be sent outside the repo. |
| Demo video upload | Ready externally | GitHub release `hookathon-port-of-call-demo-2026-05-31` includes `final-demo-latest.webm` and captions. Direct video URL: `https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm`. |
| Testnet deployment | E2E dry-run ready / broadcast pending | Local v4 proof exists. `docs/HOOKATHON_TESTNET_DEPLOYMENT.md`, `DeployCapitalWindowTestnet.s.sol`, and `ExecuteCapitalWindowTestnetSwap.s.sol` define the public-testnet path. A Base Sepolia dry-run succeeded without `--broadcast`, including mined hook deployment, window creation, and an approved exact-input smoke swap through the official `PoolManager`; explorer-verifiable deployment/swap remains external pending. |

## Verification gate

Run from the monorepo root:

```bash
corepack yarn hookathon:check
```

Optional networked dry-run against Base Sepolia:

```bash
corepack yarn hookathon:testnet:e2e
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
