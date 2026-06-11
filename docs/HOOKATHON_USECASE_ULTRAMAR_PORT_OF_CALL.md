# Ultramar Port-of-Call Hookathon use case

Working objective: win the Uniswap v4 Hookathon with a use case that combines Ultramar's private-market brand, an Ablo-style discovery loop, and a technically credible v4 hook.

Companion artifacts:

- `docs/HOOKATHON_SUBMISSION_PACKET.md` converts this thesis into a demo-day pitch, technical walkthrough, objections, and build plan.
- `docs/HOOKATHON_SUBMISSION_FORM.md` provides copy/paste fields for the actual submission form.

## Verdict

Build **Ultramar Port of Call**: an Ablo-style cross-border capital discovery experience where eligible investors meet local operating businesses, review translated diligence, and can enter counsel-gated investment ports through a Uniswap v4 hook.

The underlying hook is not a generic DEX listing. It is a controlled settlement primitive for route-aware private-market access:

- Equity route: USDC in, restricted issuer asset token out.
- Debt route: fresh covenant proof before access can open.
- Exact-input only.
- Eligible investors only.
- Active windows only.
- Signed allocation only.
- Oracle freshness and issuer status required.
- Public liquidity modification blocked.

The demo asset should be **Lavanderias CX**, because the repo already models it as a Mexico City operating-business expansion round with a target raise, use of funds, data-room status, investor process, risk factors, and oracle readiness.

## Why this should win

Most hook demos compete on fee logic, LP optimization, or MEV variants. Those are valid, but crowded. Ultramar can make the hook feel like a new market category:

> Uniswap v4 as programmable investment-port infrastructure for private-market assets, not as another public RWA exchange.

The hook adds value in a way judges can inspect:

- **Custom accounting** turns a pool interaction into a windowed conversion curve instead of public AMM price discovery.
- **beforeSwap** enforces eligibility, authorization, caps, window timing, oracle freshness, and route policy.
- **beforeAddLiquidity / beforeRemoveLiquidity** prevent public LP behavior that would break the legal/product boundary.
- **Singleton and flash accounting** let the routed transaction settle inside v4's architecture while the hook controls the business logic.
- **Swap events emitted by the hook** give Ultramar a clean reconciliation trail for CRM, portfolio reporting, issuer reporting, and audit review.

The product story is simple enough for non-technical judges:

> "Travel to a local business, meet the operator, read diligence in your language, get eligibility stamped, then choose the capital route. The hook is the border control."

## Ablo-style product loop

Ablo's memorable loop was global discovery plus translation: meet someone elsewhere, understand them instantly, and feel like you traveled there. Ultramar adapts that loop to capital formation.

1. **Travel feed**

   The investor opens a global feed of local operating businesses. Each card is a "port": Mexico City laundromats, Sao Paulo logistics, Austin real estate, etc. The app does not show a buy button. It shows the operator, location, proof state, and access status.

2. **Local guide room**

   The investor enters a live diligence room. Operator updates, Q&A, data-room summaries, and KPI explanations are translated into the investor's language. The room feels conversational, but every claim links back to a controlled diligence object.

3. **Passport stamp**

   The investor completes KYC/KYB, jurisdiction, suitability, NDA, and transfer-policy checks. Ultramar issues a signed authorization payload for a specific window, amount, recipient, deadline, and nonce.

4. **Capital route**

   The v4 hook accepts exact-input USDC for the equity route only if the passport stamp is valid and the window is open. It returns the restricted asset token from issuer or escrow inventory according to the configured window curve. A debt route can use the same passport and freshness boundary to gate covenant access before a live debt instrument is issued.

5. **Return ticket**

   If counsel and issuer policy allow secondary liquidity, a company-sponsored secondary window lets approved sellers and buyers settle through the same hook constraints. No uncontrolled peer-to-peer transfer and no public market promise.

## Hook design

Use the existing architecture direction in `docs/UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md` and brand the demo as `PortOfCallHook` externally. The implementation can remain `CapitalWindowHook` if renaming would add risk.

### Contracts

- `AssetToken`: restricted ERC20 representing the issuer asset or round instrument.
- `SolvencyRegistry`: stores issuer status and freshness flags, not raw private financials.
- `CapitalWindowRegistry`: stores windows, caps, per-investor limits, price steps, oracle requirements, and active/paused/closed state.
- `CapitalWindowHook`: v4 hook enforcing the window.
- `CapitalWindowRouter`: the only approved route from the Ultramar app into `PoolManager`.

### Critical callback behavior

- `beforeAddLiquidity`: revert unless the caller is an approved operational account. For the hackathon, block public add liquidity entirely.
- `beforeRemoveLiquidity`: revert for public users. The window uses issuer or escrow inventory, not passive public LP shares.
- `beforeSwap`: require exact input, approved router, approved pool key, payment-token-to-asset-token direction, active window, eligible investor, signed authorization, unspent nonce, cap availability, min output, deadline, and fresh issuer status.
- `beforeSwapReturnDelta`: consume the full exact input and return the calculated asset-token output using the window curve.
- Swap event emission: emit reconciliation metadata from `beforeSwap` after the registry consumes the window. Add an `afterSwap` permission only if the demo needs post-swap metadata that cannot be emitted safely from `beforeSwap`.

### Quote model

MVP pricing should be a windowed step conversion curve:

- Base price comes from approved round terms.
- The hook applies configured step premiums as scheduled tranches fill.
- Oracle data can pause or permit a window, but should not silently reprice the security.
- Secondary windows can use fixed-price, capped auction, or issuer-approved seller escrow parameters.

Demo example:

- Lavanderias CX uses a sandbox valuation frame of `USD 4.5M` pre-money and `4.5M` fully diluted LCX units, producing a `1.00 USDC/LCX` base price.
- MXN operating economics should be translated through a signed FX snapshot before the window opens; the hook should execute the resulting USDC terms instead of floating FX inside a swap.
- The primary window uses `stepSize = 1,000 USDC` and `stepPriceBps = 1,000`, so `1,500 USDC` settles as `1,000 LCX` at `1.00` plus `454.54 LCX` at `1.10`, for `1,454.54 LCX` at `1.0312 USDC/LCX` effective.

## Demo asset: Lavanderias CX

Lavanderias CX is a better demo than an abstract RWA because it is concrete:

- Local operating business in Mexico City.
- USD 560,000 expansion round.
- Use of funds maps to new-store capex, equipment, working capital, compliance/data room, and contingency.
- Investor process already has stages: interest, eligibility, NDA, diligence, allocation, subscription, closed.
- Oracle story is believable: accounting exports and store-level KPIs become investor-facing freshness and solvency context.

The demo should avoid claiming that an actual security is for sale. Treat every token and transaction as sandbox/testnet.

## Hackathon MVP

### Onchain

- Deploy or run locally with mock USDC, mock LCX asset token, registry, hook, and router.
- Initialize one v4 pool on a supported testnet or local fork.
- Mine and verify the hook address permissions.
- Run `forge script script/CapitalWindowDemo.s.sol:CapitalWindowDemo -vv` locally to print one approved settlement plus missing-passport, generic-router, expired-authorization, minimum-output, replay, and stale-oracle blocked paths.
- Write/keep tests for:
  - hook address encodes only the intended v4 permissions,
  - approved investor conversion succeeds,
  - unapproved investor reverts,
  - expired signature reverts,
  - stale oracle reverts,
  - outside-window swap reverts,
  - cap breach reverts,
  - exact-output swap reverts,
  - minimum-output slippage reverts,
  - missing passport `hookData` reverts,
  - replayed authorization reverts,
  - public add/remove liquidity reverts,
  - direct generic route with a router-bound passport reverts,
  - `WindowConsumed` and `CapitalWindowHookSwap` events are emitted for audit reconciliation.

### Frontend

Add a focused demo surface, separate from public production pages:

- "Ports" feed with Lavanderias CX as the featured port.
- Translated diligence/Q&A mock panel.
- Passport stamp status: eligibility, NDA, allocation, signature, oracle freshness.
- Capital route intake: equity quote with exact USDC input and expected LCX output, plus debt covenant preview with current asset coverage.
- Scenario simulator for Approved, Missing passport, Replay, Stale oracle, and Generic router states, each tied to a Foundry test.
- Testnet transaction button only after all demo gates pass.
- Audit trail panel showing hook events after swap and mapping them to CRM, portfolio, issuer reporting, and risk review rows.

### Pitch video flow

1. Start with the problem: cross-border capital for local businesses dies in language, trust, compliance, and settlement gaps.
2. Show the Ablo-style feed: an investor "travels" to Mexico City and meets Lavanderias CX.
3. Show translated diligence and oracle freshness.
4. Stamp eligibility.
5. Execute the equity window through the hook, then show the debt covenant preview.
6. Try an ineligible swap and show it revert.
7. Close with the thesis: Uniswap v4 can host specialized, compliance-aware investment ports without pretending every private asset is a public AMM.

## Prize positioning

As of the published Atrium 2026 roadmap, the strongest fit depends on the current cohort:

- **UHI8 - Specialized Markets:** frame the hook as asset-class-specific liquidity for private operating-business investment ports. Route selection, eligibility, transfer policy, ticket size, timing, allocation caps, covenant coverage, oracle freshness, and router provenance are market structure, not generic AMM parameters.
- **UHI9 - Yield-Protected AMM:** frame the hook as a protected conversion market where the liquidity side avoids passive LP impermanent-loss exposure. Public LP deposits are blocked; issuer or escrow inventory is consumed only inside signed, capped, oracle-gated windows. Yield comes from reviewed real-world round terms and reporting, not toxic AMM inventory risk.
- **UHI10 - Fair Flow Frontier:** frame it as fair-flow infrastructure: signed order intent, exact-input windows, caps, delayed/scheduled fills, no toxic public routing, and audit-grade order provenance.
- **UHI11 - Curated Liquidity:** frame it as a curated-liquidity network where local guides/operators, diligence reviewers, and approved curators earn reputation by bringing high-quality issuer windows onchain.

As of May 31, 2026, the official Tally form linked from Atrium Capstone says the current theme is **UHI8 Specialized Markets**. Use **Specialized Markets for private-market investment ports** as the immediate pitch, with yield protection and fair-flow controls as proof.

## What not to build

- Do not present the pool as a live public securities market.
- Do not let the frontend accept real funds, subscription orders, or binding commitments.
- Do not use oracle data to auto-reprice an issuer security without explicit reviewed terms.
- Do not depend on a generic Universal Router path for eligibility enforcement.
- Do not overbuild live translation. Mock the translation UI for the demo and keep the onchain proof tight.

## Source notes

- Uniswap v4 whitepaper: https://app.uniswap.org/whitepaper-v4.pdf
- Uniswap v4 architecture docs: https://developers.uniswap.org/docs/protocols/v4/concepts/architecture
- Uniswap v4 custom accounting docs: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
- Atrium 2026 hookathon themes: https://blog.atrium.academy/uniswap-hook-incubator-2025-wrapped
- Atrium course outline: https://atrium.academy/uniswap/course
- Ablo inspiration: global discovery, live translation, and remote cultural exploration.
