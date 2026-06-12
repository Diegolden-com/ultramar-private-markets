# Hookathon Tally submission: exact field answers

Purpose: copy/paste source for the official Atrium async-course capstone form.

Authoritative form inspected on May 31, 2026:

```text
https://tally.so/r/VLV1pa
```

The form itself says the current Hookathon theme is **2026 UHI8: Specialized Markets**. Use Specialized Markets as the primary answer in this Tally submission, even though the public roadmap also lists later 2026 themes.

## Capstone requirements from Atrium Learn

The logged-in Capstone page says:

- Public open-source GitHub repo must be included.
- Demo/explainer video up to 5 minutes max must be included.
- Project must build a Uniswap v4 hook or directly interface with hooks.
- Project must be original; copied workshop/past-cohort code is not considered.
- Only new code and functionality implemented for the capstone is considered.
- Project must have either a frontend or tests.
- Hooks are evaluated on uniqueness, impact, functionality, and presentation pitch.

## Field Answers

### Project Title

```text
Ultramar Port of Call
```

### Email

```text
[submitter email]
```

### 1-2 sentence description of your project

```text
Ultramar Port of Call creates investment ports for private operating businesses: an Abloh-inspired discovery app where eligible investors review translated diligence, receive a signed passport stamp, and choose an equity window, debt covenant preview, secondary transfer, or conversion route. The Uniswap v4 hook is the market boundary for those routes, enforcing router-bound authorization, exact-input windows, oracle freshness, caps, and custom-accounting settlement.
```

### Did you integrate any of our partners?

```text
Leave the sponsor-partner multiselect blank. No formal sponsor-partner integration beyond Uniswap v4 itself.
```

### How did you integrate our partners, if any?

```text
No additional partner protocol was integrated. The project focuses tightly on Uniswap v4 core mechanics: PoolManager settlement, hook permission bits, beforeSwap validation, beforeSwapReturnDelta custom accounting, and a router-bound periphery path.
```

### Does your project address the current Uniswap Hookathon theme?

```text
Yes, my project addresses the theme.
```

### Current-theme explanation backup

```text
Yes. The form lists the current theme as Specialized Markets, and Port of Call is designed as an asset-class-specific liquidity system for private operating-business capital routes. Generic AMMs are a poor fit for this asset class because eligibility, transfer policy, ticket size, timing, issuer proof freshness, covenant coverage, and allocation caps are not continuous public variables. The hook turns those constraints into a v4-native specialized market: public LP changes are blocked, execution is exact-input only, custom accounting proves deterministic equity-window settlement, the demo previews a debt covenant route, and signed passports bind order flow to the intended router.
```

Current public Tally field map on May 31, 2026 did not expose a separate textarea for this explanation. Keep this answer as a backup if the form changes or a judge asks for explicit theme rationale.

### Project tags

```text
Select: RWA, Custom hooks, Custom Routers, KYC, Compliance, Oracle, Illiquid Assets, Private Debt, Price Discovery, Other
Other text: Specialized Markets, Investment Ports, Capital Windows, Debt Covenant Preview, Capital Route Intake, Custom Accounting, Return Delta Hook, Router-Bound Authorization, Permissioned Liquidity, Liquidity Protection
```

### GitHub Repo

```text
https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui
```

### My Github repo is public, so it can be judged

```text
Yes
```

Verified with `gh repo view Diegolden-com/ultramar-private-markets --json visibility,url` on May 31, 2026: visibility is `PUBLIC`. Use the branch URL above until the Hookathon package is merged into the default branch.

### Slide Deck link

```text
https://ultramar.capital/hookathon/port-of-call/deck
```

Verified live on June 11, 2026 with production render QA and public link checks. Source deck backup:

```text
Source deck: docs/HOOKATHON_SLIDE_DECK.md
```

### Demo video link

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm
```

Release page with captions:

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/tag/hookathon-port-of-call-demo-2026-05-31
```

Base Sepolia dry-run proof report:

```text
https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md
```

### Project link, if there's a front end

```text
https://ultramar.capital/hookathon/port-of-call
```

Verified live on June 11, 2026. Local reproducibility route:

```text
Local route: http://localhost:3000/hookathon/port-of-call
```

### Problem / Background: What inspired the idea? What problems are you solving?

```text
Private-market capital usually breaks before settlement. Cross-border investors struggle with language, diligence, eligibility, legal boundaries, allocation, and reporting; issuers struggle to present operating proof without turning public materials into an uncontrolled offering. The Walmart lesson is that the market pays for administration that can absorb capital: even a competitive operating business can become investable when data, margin strategy, controls, and legal instruments are credible. That is Ultramar's thesis: a traditional business should always be market-ready, able to raise through debt or equity when its operating proof supports the route. Port of Call expresses that as a capital readiness gate: admin control and omnichannel margin strategy can support equity, while current asset coverage and covenant freshness can support debt.

Ultramar Port of Call turns that into an Abloh-inspired discovery loop. The investor travels to a local operating business, reviews translated diligence, receives a signed passport, and then chooses a route: equity window, debt covenant preview, secondary transfer, or conversion path. A normal public AMM is the wrong primitive because each route has asset-specific constraints: who can participate, when a window is open, what price terms apply, what disclosure-minimized claim is fresh enough, what transfer policy is accepted, and whether issuer proof is fresh enough to execute.
```

### Impact: What makes this project unique? What impact will this make?

```text
The project is unique because the hook is not just a permission list or fee tweak. It creates a Specialized Market for private operating-business capital routes: the product starts with a capital-route intake, then the hook enforces the boundary for the route that is actually open. In the current Solidity proof, the pool uses v4 PoolManager settlement and beforeSwapReturnDelta to replace generic AMM price discovery with deterministic equity-window settlement. In the product demo, the same boundary model is shown for a debt covenant preview: the route opens only while the current asset coverage proof is fresh, and a stale proof blocks access before any debt instrument is treated as executable.

The deck shows the sandbox math explicitly, and `testWindowStepCurveQuotesExactPricingExample` proves the same sandbox math in Solidity: approved sandbox pre-money and FX terms produce a fixed `1.00 demo USDC/restricted LCX` signed window term. The FX rule is explicit: the active window is fixed after the signed FX snapshot, while a floating policy can refresh the next window before it opens; filled orders are never repriced. The hook then applies a `1,000 demo USDC` first step with a `10%` tranche premium and returns `1,454.54 sandbox restricted LCX` for `1,500 demo USDC` at `1.0312 demo USDC/restricted LCX` effective. Public add/remove liquidity reverts, signed passports are bound to CapitalWindowRouter, stale issuer proofs are rejected, replayed authorizations fail, and successful executions emit reconciliation events for CRM, portfolio, issuer reporting, covenant monitoring, and risk review.

The impact is a new pattern for v4: asset-class-specific markets where legal/product constraints become programmable settlement boundaries without rebuilding a bespoke exchange from scratch.
```

### Challenges: What was challenging about building this project?

```text
The hard part was making the hook feel like a real v4 market instead of a standalone escrow contract with a Uniswap label. The implementation had to bind passport signatures to the intended router, use v4 custom accounting correctly, encode the hook permission mask, block generic router bypasses, reject exact-output paths, protect signed minimum output, handle replay/deadline checks, model oracle freshness, and keep public LP behavior out of the demo pool. A second challenge was packaging the product so judges can understand the Abloh-like workflow first and then verify the hook behavior through tests, local scripts, and a Base Sepolia dry-run path.
```

### Did you work with a team?

```text
[Yes/No]
```

If you choose `Yes`, Tally shows a required team-details textarea. Provide team member names and backgrounds there. If you choose `No`, this field stays hidden.

### Do you plan to continue working on this or another Hook project after graduation

```text
Yes :)
```

### Future plans support, if shown

```text
Yes. I plan to keep developing Port of Call as an Ultramar Private Equities primitive: reusable v4 infrastructure for passport-gated issuer windows, debt covenant routes, translated diligence, operating-proof freshness, and post-trade reconciliation. The areas where Atrium support would be most useful are hook audits, production-grade router/periphery review, and introductions to teams exploring RWA, private credit, or specialized-market deployments.
```

### On a scale from 1-5, how would you rate your Uniswap v4 Course experience?

```text
[1-5]
```

### Tell us more about what parts of Uniswap v4 Course you found most helpful and what you would want to change in your experience.

```text
The most useful parts were the progression from v4 architecture into return-delta hooks, router/periphery design, hook deployment constraints, and hook security. Those topics directly shaped this project: the router-bound passport digest, beforeSwapReturnDelta custom accounting, permission-bit verification, generic-router rejection, replay protection, and testnet deployment runbook all map back to the course arc. The main improvement I would suggest is keeping the current Hookathon theme and submission requirements synchronized across the public roadmap, course page, and Tally form so builders can frame projects against one authoritative target.
```

## Required Repo Evidence

- Public README: `HOOKATHON_README.md`
- Frontend route: `apps/ultramar/app/hookathon/port-of-call/page.tsx`
- Web pitch deck: `apps/ultramar/app/hookathon/port-of-call/deck/page.tsx`
- Source deck outline: `docs/HOOKATHON_SLIDE_DECK.md`
- Hook: `apps/private-equities/contracts/src/CapitalWindowHook.sol`
- Router: `apps/private-equities/contracts/src/CapitalWindowRouter.sol`
- Registry: `apps/private-equities/contracts/src/CapitalWindowRegistry.sol`
- Tests: `apps/private-equities/contracts/test/CapitalWindowHook.t.sol`
- Local proof: `corepack yarn hookathon:check`
- Terminal video proof: `corepack yarn hookathon:video:proof`
- Base Sepolia proof: `corepack yarn hookathon:testnet:proof`
- Browser capture assets: `corepack yarn hookathon:capture:demo`
- Captioned review cut: `corepack yarn hookathon:render:video`
- Public link check: `corepack yarn hookathon:links:check`
- Submission preflight: `corepack yarn hookathon:submission:preflight`
- Strict final preflight: `corepack yarn hookathon:submission:preflight:strict`
