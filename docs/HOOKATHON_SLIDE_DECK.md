# Hookathon slide deck: Ultramar Port of Call

Purpose: source narrative for the public web deck at `/hookathon/port-of-call/deck`.

Public deck URL, verified live on May 31, 2026:

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

### 1. Title

Ultramar Port of Call makes the hook a passport checkpoint for private-market capital.

Proof object:

- Theme: Specialized Markets
- Asset: Lavanderias CX
- Proof: 26 hook tests

### 2. Problem

Private-market capital breaks before settlement.

Key constraints:

- Language: investors cannot inspect local operating proof with enough context.
- Eligibility: issuer, jurisdiction, NDA, transfer policy, and caps sit outside settlement.
- Execution: a public AMM cannot know when a private window is valid or stale.

### 3. Product Loop

Ablo for capital: travel, guide, passport, window.

Sequence:

- Travel: open a capital port and meet the issuer before the transaction surface.
- Guide: translate diligence, store economics, use of funds, and risk notes.
- Passport: attach KYC/KYB, jurisdiction, NDA, allocation, and transfer policy checks.
- Window: execute exact-input USDC only through a v4 hook with custom accounting.

### 4. Specialized Market

A generic AMM is the wrong primitive for this asset class.

Submission angle:

- Primary: Specialized Markets.
- Secondary: Yield-Protected AMM.
- The official Tally form lists UHI8 Specialized Markets.
- Port of Call treats the hook as an asset-class-specific market boundary rather than a public liquidity pool.

### 5. v4 Mechanism

The hook is not decoration. It is the market boundary.

Mechanism:

- Router provenance: signed passport binds the order to `CapitalWindowRouter`.
- Window state: timing, caps, exact-input direction, deadline, and nonce checks execute in `beforeSwap`.
- Custom accounting: `beforeSwapReturnDelta` consumes payment and returns window-priced issuer-token output.
- Market boundary: public add/remove liquidity reverts.

### 6. Pricing Example

Pre-money and FX become signed window terms, then the hook executes the curve.

Show:

- Pre-money frame: `4.5M USD`.
- Sandbox fully diluted units: `4.5M LCX`.
- Base price: `1.00 USDC / LCX`.
- FX policy: MXN economics use a signed snapshot, then a fixed USDC window price.
- Curve: first `1,000 USDC` at `1.00`, next `500 USDC` at `1.10`.
- Result: `1,500 USDC -> 1,454.54 LCX` at `1.0312 USDC/LCX` effective.

Speaker line:

"The hook is not a valuation oracle. Ultramar approves valuation and FX terms before the window opens; v4 custom accounting enforces those terms during settlement."

### 7. Proof Paths

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
- Foundry suite: 26 tests, including hook permission bits and router-bound passport digest.
- Testnet dry-run: Base Sepolia PoolManager, mined `0xa88` hook mask, window 1 smoke swap.

### 8. Judge Frame

The submission is built around the four scoring questions.

- Uniqueness: Ablo for capital is easy to remember, but the mechanism is concrete v4 custom accounting.
- Impact: a reusable pattern for asset-class-specific markets where constraints become settlement rules.
- Functionality: frontend, simulator, Solidity tests, local demo script, capture script, and testnet dry-run path.
- Presentation: one sentence carries the story: the hook is the market boundary.

### 9. Boundary And Close

Sandbox demo only. Not a public securities offer.

Closing line:

Uniswap v4 can host private-market windows without pretending they are public AMMs.

Production boundary:

- Counsel.
- Jurisdiction review.
- Transfer controls.
- Custody decisions.
- Audit.
- Monitoring.
- Operational approvals.
