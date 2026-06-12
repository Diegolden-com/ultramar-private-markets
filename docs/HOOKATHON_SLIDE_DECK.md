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
2. Markets pay for operating systems before they pay for instruments.
3. The product loop is Abloh for capital: travel, guide, passport, route.
4. A port can open equity, debt, secondary transfer, or conversion routes.
5. A generic AMM is the wrong primitive for private operating-business capital.
6. The v4 hook is the market boundary.
7. Proof matters: one approved demo settlement, six blocked paths.
8. The route proof maps cleanly to uniqueness, impact, functionality, and presentation.
9. The boundary stays explicit: sandbox demo only, not a public securities offer.

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

### 02 / Market Readiness

Markets pay for operating systems.

Sequence:

- Walmart lesson: markets fund operating systems, not category labels.
- LCX administration: daily close, utilization, route density, and ticket mix make a crowded laundry business underwritable.
- Omnichannel margin: pickup and delivery density plus store-level reporting create the margin route.
- Capital route: coverage proof can open a creditor route; margin and use-of-funds proof can open an equity window.
- Bridge line: `Walmart lesson -> LCX administration -> omnichannel margin -> debt/equity route`.

Speaker line:

"The Walmart lesson is not the multiple. It is the market signal: capital becomes available when administration turns operations into compounding infrastructure."

### 03 / Product Loop

Abloh for capital: travel, guide, passport, route.

Sequence:

- Travel: open a capital port and meet the issuer before the transaction surface.
- Guide: translate diligence, store economics, use of funds, and risk notes.
- Passport: attach KYC/KYB, jurisdiction, NDA, allocation, and transfer policy checks.
- Route: choose equity, debt covenant preview, secondary transfer, or conversion path.

Product grammar:

- Port: issuer workspace with the operator, issuer vehicle, documents, and operating proof.
- Claim: disclosure-minimized admin proof such as revenue freshness, margin route, current asset coverage, or covenant status.
- Route: capital path: equity, debt, secondary transfer, or conversion.
- Window: signed settlement period and terms inside one route.
- Passport: wallet-bound authorization carrying eligibility, allocation, route, deadline, and nonce.
- Hook: v4 market boundary that checks the route, returns custom accounting when appropriate, and emits the audit record.

### 04 / Capital Routes

A port can open equity, debt, secondary transfer, or conversion routes.

Sequence:

- Operating signal: issuer data, legal wrapper, reporting cadence, and route eligibility.
- Equity window: exact-input demo USDC settles into sandbox restricted LCX through v4 custom accounting.
- Debt covenant preview: current asset coverage must be fresh before the route can open.
- Secondary / conversion: future routes inherit the same passport and hook boundary.

Demo thesis:

- Market signal: the Walmart lesson becomes a product test for LCX administration.
- Route choice: omnichannel margin opens equity; current asset coverage opens a debt covenant preview.
- Hook proof: output appears only when passport, route, proof freshness, and signed terms agree.

90-second walkthrough:

- 00:00 frame the market: Walmart shows markets fund operating systems; LCX asks whether administration can make a crowded laundry financeable.
- 00:18 submit eligible order: omnichannel margin and fresh revenue open the equity window.
- 00:36 switch to debt route: current asset coverage decides creditor access.
- 00:54 use stale books: stale proof closes the route without repricing signed terms.
- 01:12 send via generic router: a passport is not a public swap ticket; the approved route is the market boundary.

### 05 / Specialized Market

A generic AMM is the wrong primitive for this asset class.

Market boundary:

- Primary: Specialized Markets.
- Secondary: Yield-Protected AMM.
- Port of Call fits Specialized Markets because the hook is an asset-class-specific market boundary rather than a public liquidity pool.

### 06 / v4 Mechanism

The hook is not decoration. It is the market boundary.

Mechanism:

- Router provenance: signed passport binds the order to `CapitalWindowRouter`.
- Window state: timing, caps, exact-input direction, deadline, and nonce checks execute in `beforeSwap`.
- Custom accounting: `beforeSwapReturnDelta` consumes payment and returns window-priced issuer-token output for the equity route.
- Route boundary: the debt preview uses the same stale-proof gate to show how covenant data can block non-equity access.
- Market boundary: public add/remove liquidity reverts.

### 07 / Signed Demo Term

Sandbox pre-money and FX become a signed demo term, then the hook executes approved demo settlement.

Show:

- Sandbox pre-money frame: `4.5M USD`.
- Restricted sandbox units: `4.5M restricted LCX`.
- Signed demo term: `1.00 demo USDC / restricted LCX`.
- FX policy: MXN economics use a signed snapshot, then a fixed demo USDC window term.
- Fixed/floating rule: the active demo window stays fixed after the signed FX snapshot; a floating FX policy only refreshes the next demo window before it opens.
- Signed demo steps: first `1,000 demo USDC` at `1.00 demo USDC/restricted LCX`, next `500 demo USDC` at `1.10 demo USDC/restricted LCX`.
- Result: `1,500 demo USDC -> 1,454.54 sandbox restricted LCX` at `1.0312 demo USDC/restricted LCX` effective.

Visual graph:

- Valuation-to-window bridge: sandbox pre-money ledger -> FX snapshot locked -> signed demo term.
- Signed demo settlement chart: the first `1,000 demo USDC` clears at `1.00 demo USDC/restricted LCX`; the next `500 demo USDC` clears at `1.10 demo USDC/restricted LCX`.
- Policy notes: `Fixed demo window` and `Floating policy` show that current fills are not repriced after settlement, while future demo windows can receive a new FX snapshot.
- The displayed effective term is `1.0312 demo USDC/restricted LCX`, proving the hook is executing fixed signed demo terms rather than floating AMM discovery.

Speaker line:

"The hook is not a valuation oracle or public listing surface. Ultramar approves sandbox valuation and FX terms before the demo window opens; v4 custom accounting enforces the signed demo term during restricted settlement."

### 08 / Proof Paths

One approved demo settlement, six blocked paths.

Commands:

```bash
corepack yarn hookathon:check
corepack yarn hookathon:video:proof
corepack yarn hookathon:capture:demo
corepack yarn hookathon:testnet:e2e
```

Evidence:

- Approved demo settlement: `1,500 demo USDC -> 1,454.54 sandbox restricted LCX` at `1.0312 demo USDC/restricted LCX` effective.
- Blocked paths: missing passport, generic router, expired, min output, replay, stale oracle.
- Foundry suite: 27 tests, including hook permission bits, router-bound passport digest, and exact signed demo term settlement.
- Testnet dry-run: Base Sepolia PoolManager, mined `0xa88` hook mask, window 1 smoke swap.

### 09 / Route Proof

The product can be verified from four claims.

- Uniqueness: Abloh for capital is easy to remember, but the mechanism is concrete v4 custom accounting.
- Impact: a reusable pattern for asset-class-specific markets where constraints become settlement rules.
- Functionality: frontend, simulator, Solidity tests, local demo script, capture script, and testnet dry-run path.
- Presentation: one sentence carries the story: the hook is the market boundary.

### Boundary And Close

Sandbox demo only. Not a public securities offer.

Closing line:

Uniswap v4 can host private-market investment ports without pretending they are public AMMs.

Evidence links:

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
