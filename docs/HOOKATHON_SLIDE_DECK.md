# Hookathon slide deck: Ultramar Port of Call

Purpose: source narrative for the public web deck at `/hookathon/port-of-call/deck`.

Public deck URL, verified live on June 2, 2026:

```text
https://ultramar.capital/hookathon/port-of-call/deck
```

Local deck URL:

```text
http://localhost:3000/hookathon/port-of-call/deck
```

## Claim spine

1. Private-market capital breaks before settlement.
2. The product loop is Ablo for capital: travel, guide, passport, window.
3. The official Tally framing is UHI8 Specialized Markets.
4. A generic AMM is the wrong primitive for private operating-business capital.
5. The v4 hook is the market boundary.
6. Proof matters: one approved settlement, six blocked paths.
7. The submission maps cleanly to uniqueness, impact, functionality, and presentation.
8. The boundary stays explicit: sandbox demo only, not a public securities offer.

## Slide outline

### Title

Ultramar Port of Call turns operating businesses into v4 investment ports.

Proof object:

- Theme: Specialized Markets
- Asset: Lavanderias CX
- Proof: 27 hook tests

### 01 / Problem

Private-market capital breaks before settlement.

Key constraints:

- Language: investors cannot inspect local operating proof with enough context.
- Eligibility: issuer, jurisdiction, NDA, transfer policy, and caps sit outside settlement.
- Execution: a public AMM cannot know when a private window is valid or stale.

### 02 / Product Loop

Ablo for capital: travel, guide, passport, window.

Sequence:

- Travel: open a capital port and meet the issuer before the transaction surface.
- Guide: translate diligence, store economics, use of funds, and risk notes.
- Passport: attach KYC/KYB, jurisdiction, NDA, allocation, and transfer policy checks.
- Window: execute exact-input USDC only through a v4 hook with custom accounting.

### 03 / Capital Routes

A port can open equity, debt, secondary transfer, or conversion routes.

Sequence:

- Operating signal: issuer data, legal wrapper, reporting cadence, and route eligibility.
- Equity window: exact-input USDC settles into LCX through v4 custom accounting.
- Debt covenant preview: current asset coverage must be fresh before the route can open.
- Secondary / conversion: future routes inherit the same passport and hook boundary.

### 04 / Specialized Market

A generic AMM is the wrong primitive for this asset class.

Submission angle:

- Primary: Specialized Markets.
- Secondary: Yield-Protected AMM.
- The official Tally form lists UHI8 Specialized Markets.
- Port of Call treats the hook as an asset-class-specific market boundary rather than a public liquidity pool.

### 05 / v4 Mechanism

The hook is not decoration. It is the market boundary.

Mechanism:

- Router provenance: signed passport binds the order to `CapitalWindowRouter`.
- Window state: timing, caps, exact-input direction, deadline, and nonce checks execute in `beforeSwap`.
- Custom accounting: `beforeSwapReturnDelta` consumes payment and returns window-priced issuer-token output for the equity route.
- Route boundary: the debt preview uses the same stale-proof gate to show how covenant data can block non-equity access.
- Market boundary: public add/remove liquidity reverts.

### 06 / Pricing Example

Pre-money and FX become signed window terms, then the hook executes the curve.

Show:

- Pre-money frame: `4.5M USD`.
- Sandbox fully diluted units: `4.5M LCX`.
- Base price: `1.00 USDC / LCX`.
- FX policy: MXN economics use a signed snapshot, then a fixed USDC window price.
- Fixed/floating rule: the active window stays fixed after the signed FX snapshot; a floating FX policy only refreshes the next window before it opens.
- Curve: first `1,000 USDC` at `1.00`, next `500 USDC` at `1.10`.
- Result: `1,500 USDC -> 1,454.54 LCX` at `1.0312 USDC/LCX` effective.

Visual graph:

- Valuation-to-window bridge: pre-money ledger -> FX snapshot locked -> hook step curve.
- Step curve chart: the first `1,000 USDC` clears at `1.00 USDC/LCX`; the next `500 USDC` clears at `1.10 USDC/LCX`.
- Policy notes: `Fixed window` and `Floating policy` show that current fills are not repriced after settlement, while future windows can receive a new FX snapshot.
- The displayed effective price is `1.0312 USDC/LCX`, proving the hook is executing fixed signed terms rather than floating AMM discovery.

Speaker line:

"The hook is not a valuation oracle. Ultramar approves valuation and FX terms before the window opens; v4 custom accounting enforces those terms during settlement."

### 07 / Proof Paths

One approved settlement, six blocked paths.

Commands:

```bash
corepack yarn hookathon:check
corepack yarn hookathon:video:proof
corepack yarn hookathon:capture:demo
corepack yarn hookathon:testnet:e2e
```

Evidence:

- Approved settlement: `1,500 USDC -> 1,454.54 LCX` at `1.0312 USDC/LCX` effective.
- Blocked paths: missing passport, generic router, expired, min output, replay, stale oracle.
- Foundry suite: 27 tests, including hook permission bits, router-bound passport digest, and exact step-curve pricing.
- Testnet dry-run: Base Sepolia PoolManager, mined `0xa88` hook mask, window 1 smoke swap.

### 08 / Judge Frame

The submission is built around the four scoring questions.

- Uniqueness: Ablo for capital is easy to remember, but the mechanism is concrete v4 custom accounting.
- Impact: a reusable pattern for asset-class-specific markets where constraints become settlement rules.
- Functionality: frontend, simulator, Solidity tests, local demo script, capture script, and testnet dry-run path.
- Presentation: one sentence carries the story: the hook is the market boundary.

### Boundary And Close

Sandbox demo only. Not a public securities offer.

Closing line:

Uniswap v4 can host private-market investment ports without pretending they are public AMMs.

Judge packet links:

- Demo video: `https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/final-demo-latest.webm`
- Base Sepolia proof: `https://github.com/Diegolden-com/ultramar-private-markets/releases/download/hookathon-port-of-call-demo-2026-05-31/testnet-dry-run-latest.md`
- Winning scorecard: `https://github.com/Diegolden-com/ultramar-private-markets/blob/codex/landing-wave-route-ui/docs/HOOKATHON_WINNING_SCORECARD.md`
- Source branch: `https://github.com/Diegolden-com/ultramar-private-markets/tree/codex/landing-wave-route-ui`

Production boundary:

- Counsel.
- Jurisdiction review.
- Transfer controls.
- Custody decisions.
- Audit.
- Monitoring.
- Operational approvals.
