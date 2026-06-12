# Hookathon active theme strategy: Tally UHI8 Specialized Markets

Purpose: keep the submission aligned with the official Tally form linked from the logged-in Atrium Capstone page as of May 31, 2026.

The public Atrium 2026 roadmap and the official Tally form are not perfectly synchronized. The public roadmap lists later 2026 themes, but the Tally form at `https://tally.so/r/VLV1pa` explicitly says the current Hookathon theme is **2026 UHI8: Specialized Markets**.

For the formal submission, the form is the authoritative target. Lead with **Specialized Markets**. Use Yield-Protected AMM and Fair Flow Frontier as secondary technical proof.

## Primary claim

**Ultramar Port of Call is a Uniswap v4 Specialized Market for private operating-business investment ports.**

The hook specializes the market around the constraints of private operating-business capital routes: eligibility, transfer policy, ticket size, timing, allocation caps, oracle freshness, covenant coverage, router provenance, and deterministic exact-input settlement.

## Evidence map

| UHI8 Specialized Markets need | Port of Call proof |
| --- | --- |
| Asset-class-specific liquidity | Private operating-business investment ports have route, eligibility, timing, ticket, transfer, covenant, and issuer-proof constraints that generic public AMMs do not model. |
| Custom pricing and risk parameters | `beforeSwapReturnDelta` replaces open AMM price discovery with deterministic equity-window settlement while the demo previews debt covenant routing. |
| Controlled trade sizes | Registry windows enforce min ticket, max ticket, total cap, and per-investor cap. |
| Chain-localized v4 path | The testnet path targets official Base Sepolia/Sepolia v4 `PoolManager` deployments and mines the hook address permission bits. |
| Liquidity protection | `beforeAddLiquidity` and `beforeRemoveLiquidity` revert. The pool does not let public LPs warehouse opaque sandbox restricted LCX issuer inventory. |
| Prove adverse paths fail | Tests cover generic-router rejection, missing passport, replay, expired authorization, stale oracle, min-output slippage, exact-output rejection, cap breaches, and public LP blocking. |
| Keep it on v4 rails | `CapitalWindowRouter` settles through `PoolManager`; `CapitalWindowHook` returns custom accounting deltas. |

## Demo framing

Lead with this:

> Generic AMMs are not expressive enough for private operating-business capital. Port of Call uses Uniswap v4 to create specialized investment ports: signed passport, capital-route intake, exact-input equity execution, debt covenant preview, capped windows, fresh issuer proof, blocked generic routing, and custom accounting for deterministic conversion terms.

Then show:

1. Investor travels to Lavanderias CX.
2. Passport stamp creates signed `hookData`.
3. Capital-route intake separates the restricted LCX sandbox equity window from the debt covenant preview.
4. Approved exact-input swap settles `1,500 demo USDC -> 1,454.54 sandbox restricted LCX`.
5. Generic router, replay, or stale covenant proof reverts or blocks access.
6. Public liquidity modification is blocked by tests.

## Secondary framing

- **Yield-Protected AMM:** public LP deposits are blocked; issuer or escrow inventory is consumed only inside signed, capped, oracle-gated windows.
- **Fair Flow Frontier:** signed order intent, router-bound authorization, exact-input windows, replay protection, and blocked public routing reduce toxic flow.
- **Curated Liquidity:** future curators can source issuer windows, diligence rooms, and reporting quality.

## Copy rule

Use **Specialized Markets** as the primary category for the Tally form. Keep **Yield-Protected AMM** and **Fair Flow Frontier** as secondary technical angles only.

## Source basis

- Atrium Capstone form inspected on May 31, 2026: https://tally.so/r/VLV1pa
- Atrium 2026 roadmap: https://blog.atrium.academy/uniswap-hook-incubator-2025-wrapped
- Atrium public Uniswap incubator page: https://atrium.academy/uniswap
- Uniswap v4 custom accounting docs: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
