# Hookathon Tally final copy packet

Purpose: single-pass copy order for the official Atrium capstone form at `https://tally.so/r/VLV1pa`.

Use `docs/HOOKATHON_TALLY_SUBMISSION.md` as the canonical long source. This packet is the submitter-facing checklist for the final browser session.

## Pre-submit gate

Run these from the monorepo root immediately before opening Tally:

```bash
corepack yarn hookathon:links:check
corepack yarn hookathon:public:render:qa
corepack yarn hookathon:privacy:check
corepack yarn hookathon:tally:field-map
corepack yarn hookathon:tally:live:qa
corepack yarn hookathon:tally:fill-plan
corepack yarn hookathon:tally:session
corepack yarn hookathon:tally:session:qa
corepack yarn hookathon:submission:preflight
corepack yarn hookathon:submission:operator
corepack yarn hookathon:submission:handoff
corepack yarn hookathon:readiness
```

Do not submit while these placeholders remain:

```text
[submitter email]
[Yes/No]
[1-5]
```

To avoid committing personal data, generate a private packet under ignored `artifacts/`:

```bash
HOOKATHON_SUBMITTER_EMAIL="you@example.com" \
HOOKATHON_WORKED_WITH_TEAM="No" \
HOOKATHON_COURSE_RATING="5" \
corepack yarn hookathon:tally:personalize
```

If `HOOKATHON_WORKED_WITH_TEAM="Yes"`, also set `HOOKATHON_TEAM_DETAILS`.

Use `--check-only` with the same environment variables to validate without writing the private packet.

Use `artifacts/hookathon/tally-final-personalized-latest.md` for the final browser copy/paste session. If you instead fill the tracked docs directly, run:

```bash
corepack yarn hookathon:submission:preflight:strict
```

For a copy-button browser aid, generate and open the ignored local session pack:

```bash
corepack yarn hookathon:tally:session
corepack yarn hookathon:tally:session:qa
```

Open `artifacts/hookathon/tally-browser-session-latest.html` alongside the Tally form. It is submit-ready only after the personal placeholders are replaced by the private personalized packet.

To refresh every Tally-facing artifact in one pass before opening the form, including the private handoff, run:

```bash
corepack yarn hookathon:submission:operator
```

For the final personal-data run, set `HOOKATHON_SUBMITTER_EMAIL`, `HOOKATHON_WORKED_WITH_TEAM`, and `HOOKATHON_COURSE_RATING`; if team status is `Yes`, also set `HOOKATHON_TEAM_DETAILS`. Then run:

```bash
corepack yarn hookathon:submission:operator --strict
```

The operator also creates and reads an ignored private env file at `artifacts/hookathon/final-submit.env`. You can fill that file instead of exporting shell variables:

```text
HOOKATHON_SUBMITTER_EMAIL=
HOOKATHON_WORKED_WITH_TEAM=
HOOKATHON_COURSE_RATING=
HOOKATHON_TEAM_DETAILS=
```

The strict operator run writes `artifacts/hookathon/final-submit-run-latest.md` and should say `Ready for Tally submit: yes` before pressing Submit in Tally.

The operator also regenerates the one-page private handoff. To generate only the handoff after an operator run:

```bash
corepack yarn hookathon:submission:handoff
```

It writes `artifacts/hookathon/final-handoff-latest.md` without including personal values.

## Links to keep open

```text
Tally form: https://tally.so/r/VLV1pa
GitHub repo: https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui
Project demo: https://ultramar.capital/hookathon/port-of-call
Pitch deck: https://ultramar.capital/hookathon/port-of-call/deck
Demo video: https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
Video release page: https://github.com/Diegolden-com/ultramar-private-markets/releases/tag/hookathon-port-of-call-demo-2026-05-31
```

## Copy Order

### Project Title

```text
Ultramar Port of Call
```

### Email

```text
[submitter email]
```

### 1-2 sentence description

```text
Ultramar Port of Call is an Ablo-style private-market discovery app where eligible investors travel to local operating businesses, receive a signed passport stamp, and enter a Uniswap v4 capital window. The v4 hook creates a Specialized Market for private operating-business capital by enforcing router-bound authorization, exact-input windows, oracle freshness, caps, and custom-accounting settlement.
```

### Did you integrate any of our partners?

```text
Leave the sponsor-partner multiselect blank. No formal sponsor-partner integration beyond Uniswap v4 itself.
```

### Partner integration details

```text
No additional partner protocol was integrated. The project focuses tightly on Uniswap v4 core mechanics: PoolManager settlement, hook permission bits, beforeSwap validation, beforeSwapReturnDelta custom accounting, and a router-bound periphery path.
```

### Current theme

```text
Yes, my project addresses the theme.
```

### Project tags

```text
Select: RWA, Custom hooks, Custom Routers, KYC, Compliance, Oracle, Illiquid Assets, Private Debt, Price Discovery, Other
Other text: Specialized Markets, Capital Windows, Custom Accounting, Return Delta Hook, Router-Bound Authorization, Permissioned Liquidity, Liquidity Protection
```

### GitHub Repo

```text
https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui
```

### My Github repo is public, so it can be judged

```text
Yes
```

### Slide Deck link

```text
https://ultramar.capital/hookathon/port-of-call/deck
```

### Demo video link

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
```

### Project link

```text
https://ultramar.capital/hookathon/port-of-call
```

### Problem / Background

```text
Private-market capital usually breaks before settlement. Cross-border investors struggle with language, diligence, eligibility, legal boundaries, allocation, and reporting; issuers struggle to present operating proof without turning public materials into an uncontrolled offering. A normal public AMM is the wrong primitive for local-business capital windows because the market has asset-specific constraints: who can participate, when a window is open, what price terms apply, what transfer policy is accepted, and whether issuer proof is fresh enough to execute.

Ultramar Port of Call turns that into an Ablo-style discovery loop. The investor travels to a local operating business, reviews translated diligence, receives a signed passport, and then executes only through a Uniswap v4 hook that enforces the capital-window boundary.
```

### Impact

```text
The project is unique because the hook is not just a permission list or fee tweak. It creates a Specialized Market for private operating-business capital: the pool uses v4 PoolManager settlement, but the hook replaces generic AMM price discovery with a deterministic windowed conversion curve via beforeSwapReturnDelta. Public add/remove liquidity reverts, signed passports are bound to CapitalWindowRouter, stale issuer proofs are rejected, replayed authorizations fail, and successful executions emit reconciliation events for CRM, portfolio, issuer reporting, and risk review.

The impact is a new pattern for v4: asset-class-specific markets where legal/product constraints become programmable settlement boundaries without rebuilding a bespoke exchange from scratch.
```

### Challenges

```text
The hard part was making the hook feel like a real v4 market instead of a standalone escrow contract with a Uniswap label. The implementation had to bind passport signatures to the intended router, use v4 custom accounting correctly, encode the hook permission mask, block generic router bypasses, reject exact-output paths, protect signed minimum output, handle replay/deadline checks, model oracle freshness, and keep public LP behavior out of the demo pool. A second challenge was packaging the product so judges can understand the Ablo-like workflow first and then verify the hook behavior through tests, local scripts, and a Base Sepolia dry-run path.
```

### Did you work with a team?

```text
[Yes/No]
```

### Team details, if team Yes

```text
{{TEAM_DETAILS_IF_YES}}
```

### Continue after graduation

```text
Yes :)
```

### Future plans support, if shown

```text
Yes. I plan to keep developing Port of Call as an Ultramar Private Equities primitive: a reusable v4 pattern for passport-gated issuer windows, translated diligence, operating-proof freshness, and post-trade reconciliation. The areas where Atrium support would be most useful are hook audits, production-grade router/periphery review, and introductions to teams exploring RWA or specialized-market deployments.
```

### Course rating

```text
[1-5]
```

### Course feedback

```text
The most useful parts were the progression from v4 architecture into return-delta hooks, router/periphery design, hook deployment constraints, and hook security. Those topics directly shaped this project: the router-bound passport digest, beforeSwapReturnDelta custom accounting, permission-bit verification, generic-router rejection, replay protection, and testnet deployment runbook all map back to the course arc. The main improvement I would suggest is keeping the current Hookathon theme and submission requirements synchronized across the public roadmap, course page, and Tally form so builders can frame projects against one authoritative target.
```

## Final review before Submit

- GitHub repo field uses the branch URL, not only the repository root.
- Demo video field uses the direct WebM asset URL.
- Project link field uses `https://ultramar.capital/hookathon/port-of-call`.
- Slide deck field uses `https://ultramar.capital/hookathon/port-of-call/deck`.
- There are no bracketed placeholders in the form.
- The non-offer sandbox framing remains in the project description, demo, README, and video.

## Post-submit evidence

After Tally confirms submission, capture the confirmation page or confirmation email, then generate the private ignored receipt:

```bash
HOOKATHON_TALLY_SUBMITTED_AT="REPLACE_WITH_ISO_TIMESTAMP_FROM_CONFIRMATION" \
HOOKATHON_TALLY_CONFIRMATION="REPLACE_WITH_TALLY_CONFIRMATION_TEXT_OR_ID" \
HOOKATHON_TALLY_EVIDENCE="REPLACE_WITH_SCREENSHOT_OR_EMAIL_REFERENCE" \
corepack yarn hookathon:submission:receipt
```

If useful for private audit, include `HOOKATHON_SUBMITTER_EMAIL`; the receipt is written under ignored `artifacts/`.

Validate the values without writing the private receipt:

```bash
HOOKATHON_TALLY_SUBMITTED_AT="REPLACE_WITH_ISO_TIMESTAMP_FROM_CONFIRMATION" \
HOOKATHON_TALLY_CONFIRMATION="REPLACE_WITH_TALLY_CONFIRMATION_TEXT_OR_ID" \
HOOKATHON_TALLY_EVIDENCE="REPLACE_WITH_SCREENSHOT_OR_EMAIL_REFERENCE" \
corepack yarn hookathon:submission:receipt --check-only
```

Then rerun:

```bash
corepack yarn hookathon:readiness
```
