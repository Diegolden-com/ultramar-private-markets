# Hookathon video recording kit: Ultramar Port of Call

Purpose: make the final two-minute demo fast to record, easy to verify, and aligned with the official Tally **Specialized Markets** framing.

## Recording objective

Ship one concise video that proves three things:

1. The product is memorable: Ablo-style travel into a local-business capital port.
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
- Screen: record the browser full-width for the first 100 seconds, then switch to terminal proof for the final 20 seconds.
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

## Two-minute take

| Time | Screen | Voiceover |
| --- | --- | --- |
| 0:00-0:15 | Hero | "Private-market capital breaks before settlement: language, diligence, eligibility, legal limits, allocation, and reporting are disconnected." |
| 0:15-0:30 | Travel feed | "Ultramar Port of Call is Ablo for capital. The investor travels to Mexico City and enters Lavanderias CX before any transaction exists." |
| 0:30-0:45 | Passport and quote | "The diligence room creates a signed passport: window id, investor, minimum output, deadline, nonce, and authorizer signature." |
| 0:45-1:05 | Approved simulator | "The approved flow sends exact-input USDC through `CapitalWindowRouter`. The hook verifies the passport and returns LCX through v4 custom accounting." |
| 1:05-1:20 | Specialized market claim | "This is the Specialized Markets angle: private operating-business capital needs eligibility, timing, caps, transfer boundaries, oracle freshness, and router provenance inside the market itself." |
| 1:20-1:38 | Generic router or replay | "A valid passport cannot ride the wrong route or replay the same nonce. The hook rejects it before any custom delta is returned." |
| 1:38-1:50 | Event reconciliation | "`WindowConsumed` and `CapitalWindowHookSwap` become CRM, portfolio, issuer reporting, and risk-review rows." |
| 1:50-2:00 | Deck close or terminal proof | "The local proof shows one approved settlement and six blocked paths. The hook is the market boundary." |

## Required visual beats

- `Uniswap v4 Hookathon` and `Sandbox / non-offer` badges.
- `Specialized Markets` as the primary angle.
- `1,454.54 LCX` expected output.
- Scenario simulator `Approved`.
- Scenario simulator `Generic router` or `Replay`.
- Audit/indexer event panel.
- Pitch deck closing line if using the optional deck route.
- Terminal marker: `Demo complete: one approved settlement, six blocked paths.`

## Upload copy

Title:

```text
Ultramar Port of Call - Specialized Markets for Uniswap v4 Capital Windows
```

Description:

```text
Ultramar Port of Call is an Ablo-style private-market discovery demo for the Uniswap v4 Hookathon. Investors travel to a local business, receive a signed eligibility passport, and enter a v4 capital window. The hook creates a Specialized Market for private operating-business capital by enforcing eligibility, ticket size, caps, transfer boundaries, router provenance, oracle freshness, and exact-input custom-accounting settlement.

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
