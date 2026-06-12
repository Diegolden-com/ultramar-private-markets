# Hookathon video recording kit: Ultramar Port of Call

Purpose: make the final two-minute demo fast to record, easy to verify, and aligned with the official Tally **Specialized Markets** framing.

## Recording objective

Ship one concise video that proves three things:

1. The product is memorable: Abloh-inspired travel into a local-business capital port.
2. The hook is v4-native: `PoolManager`, router-bound `hookData`, `beforeSwap`, and `beforeSwapReturnDelta`.
3. The Specialized Markets angle is real: private operating-business capital needs asset-class-specific eligibility, caps, transfer boundaries, oracle freshness, and router provenance.

## Preflight

Run the full gate first:

```bash
corepack yarn hookathon:check
```

Generate a clean terminal proof file for the recording:

```bash
corepack yarn hookathon:video:proof
```

Capture reusable browser frames and a short `.webm` interaction clip:

```bash
corepack yarn hookathon:capture:demo
```

Render a captioned WebM review cut from the captured frames and terminal proof:

```bash
corepack yarn hookathon:render:video
```

Run the final local submission preflight:

```bash
corepack yarn hookathon:submission:preflight
```

After replacing the remaining Tally placeholders with real values, run the strict gate:

```bash
corepack yarn hookathon:submission:preflight:strict
```

The proof is written to:

```text
artifacts/hookathon/terminal-proof-latest.md
```

The capture script writes:

```text
artifacts/hookathon/capture-manifest-latest.md
artifacts/hookathon/frames/*.png
artifacts/hookathon/video/demo-flow-latest.webm
```

The render script writes:

```text
artifacts/hookathon/video/final-demo-latest.webm
artifacts/hookathon/video/final-demo-latest.vtt
artifacts/hookathon/video/final-demo-manifest-latest.md
```

Uploaded release asset:

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
```

The preflight script writes:

```text
artifacts/hookathon/submission-preflight-latest.md
artifacts/hookathon/submission-preflight-strict-latest.md
```

Optional networked proof:

```bash
corepack yarn hookathon:testnet:e2e
```

Use the testnet command only if the video or submission needs a Base Sepolia dry-run. It does not broadcast.

## Capture setup

- Browser: `http://localhost:3000/hookathon/port-of-call`
- Optional deck: `http://localhost:3000/hookathon/port-of-call/deck`
- Browser zoom: `90%` or `100%`, whichever keeps the hero and right-side asset visible.
- Terminal font: 14-16 pt.
- Screen: record the browser full-width through the deck close, then switch to terminal proof for the final 13 seconds.
- Recording tool: QuickTime, OBS, Loom, or the platform recorder. Export 1080p if available.

Start the app:

```bash
corepack yarn workspace @ultramar/ultramar dev
```

Run terminal proof in a second terminal:

```bash
corepack yarn hookathon:video:proof
```

If the terminal output is too noisy, show the generated proof file and zoom into `## Clean terminal markers`.

If the browser capture needs a different port:

```bash
HOOKATHON_CAPTURE_PORT=3002 corepack yarn hookathon:capture:demo
```

If local `ffmpeg` is not installed, use `corepack yarn hookathon:render:video` to create a captioned WebM review cut. It is intentionally silent; record the voiceover over that cut if the final upload platform expects narration.

## Captioned review cut

| Time | Screen | Voiceover |
| --- | --- | --- |
| 0:00-0:08 | Hero | "Private-market capital breaks before settlement: language, diligence, eligibility, legal limits, allocation, and reporting are disconnected." |
| 0:08-0:16 | Market readiness | "The Walmart lesson becomes an operating-company question: what changed inside LCX that makes equity or debt investible?" |
| 0:16-0:25 | Operating readiness map | "Admin work becomes underwriting evidence: daily close, margin route, current asset coverage, and reporting freshness become route-specific claims." |
| 0:25-0:35 | Equity route approved | "Why this click matters: omnichannel operations are credible enough to open primary equity, then the hook settles signed window terms." |
| 0:35-0:45 | Debt covenant stale | "A green ratio from stale books is not credit risk proof; stale covenant data closes the debt route before settlement." |
| 0:45-0:53 | Generic router revert | "A valid passport cannot ride the wrong route. The signature is bound to `CapitalWindowRouter`, so generic v4 routing reverts." |
| 0:53-1:01 | Pricing policy | "Most active windows should be fixed. If the issuer cannot explain the tranche logic, the curve should not exist." |
| 1:01-1:09 | Specialized market claim | "Private operating-business capital needs eligibility, caps, transfer boundaries, oracle freshness, and router provenance inside settlement." |
| 1:09-1:17 | Deck capital routes | "A port can open equity, debt, secondary transfer, or conversion routes while the hook stays the market boundary." |
| 1:17-1:25 | Pricing proof | "`testWindowStepCurveQuotesExactPricingExample` keeps its exact test name and proves the signed demo term: `1,500 demo USDC -> 1,454.54 sandbox restricted LCX` at `1.0312 demo USDC/restricted LCX` effective." |
| 1:25-1:33 | Deck close | "Uniswap v4 can host private-market investment ports without pretending they are public AMMs." |
| 1:33-1:46 | Terminal proof | "The local proof shows one approved settlement and six blocked paths. The hook is the market boundary." |

## Required visual beats

- `Uniswap v4 Hookathon` and `Sandbox / non-offer` badges.
- `Specialized Markets` as the primary angle.
- Operating readiness map: `Admin work becomes underwriting evidence.`
- Route-specific signals: daily close, margin route, current asset coverage, and reporting freshness.
- `1,454.54 sandbox restricted LCX` expected demo output.
- Pricing proof: `testWindowStepCurveQuotesExactPricingExample`.
- `27 hook tests` if using the deck route.
- Scenario simulator `Approved`.
- Scenario simulator `Debt covenant preview` with stale coverage, plus `Generic router`.
- `Why this click matters` panel.
- Audit/indexer event panel.
- Signed demo term and pitch deck closing line if using the optional deck route.
- Terminal marker: `Demo complete: one approved settlement, six blocked paths.`

## Upload copy

Title:

```text
Ultramar Port of Call - Specialized Markets for Uniswap v4 Investment Ports
```

Description:

```text
Ultramar Port of Call is an Abloh-inspired private-market discovery demo for the Uniswap v4 Hookathon. Investors travel to a local business, receive a signed eligibility passport, and choose an equity window, debt covenant preview, secondary transfer, or conversion route. The hook creates a Specialized Market for private operating-business capital by enforcing route, eligibility, ticket size, caps, transfer boundaries, router provenance, oracle freshness, and exact-input custom-accounting settlement.

Sandbox/testnet technical demo only. Not an offer, investment advice, custody, broker-dealer activity, or a live production transaction path.
```

Submission note:

```text
Run `corepack yarn hookathon:check` for app build, typecheck, Foundry tests, and local demo proof. Run `corepack yarn hookathon:video:proof` for the clean terminal markers shown in the video. Run `corepack yarn hookathon:render:video` to reproduce the captioned WebM review cut.
```

## QA before upload

- The video is under two minutes, or the platform permits the chosen length.
- Use the uploaded release asset above, or use `artifacts/hookathon/video/final-demo-latest.webm` as the base layer for a narrated edit if a different hosting platform is preferred.
- The first 20 seconds explain the user problem, not Solidity internals.
- The Specialized Markets framing is explicit.
- The revert path is visible.
- The terminal proof shows one approved settlement plus six blocked paths.
- The non-offer disclaimer appears in the UI or description.
- No claim says LCX is publicly investable.
- No wallet secret, RPC key, or private submission page is visible.
