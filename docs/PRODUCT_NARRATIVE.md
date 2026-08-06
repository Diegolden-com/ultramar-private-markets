# Ultramar Product Narrative

This document preserves product and market-structure context that should guide implementation, metadata, agent answers, and future copy without returning long explanations to the public UI.

## Platform boundary

The `ultramar.capital` apex app is the canonical public home for exactly two
capital products:

1. **Private Equities** — controlled private-market workflows for issuers and eligible investors.
2. **Arbitrage Hedge Fund** — a Polymarket-first fund surface for allocators reviewing signals, exposure, and risk.

Capital is the umbrella brand, not a third product. Public pages explain and route; they do not accept funds, create commitments, or imply unrestricted exchange access.

Ultramar Real Estate is an independent public land-listing site at
`realestate.ultramar.capital`. It is not a third apex product and does not inherit
the capital platform's investment-product taxonomy.

## Private Equities

The product connects four operating jobs:

- **Asset and issuer intake:** identify the asset, issuer, valuation frame, round or transfer type, and available diligence.
- **Primary capital:** keep issuer rounds distinct from general discovery. Round terms, use of funds, instrument, closing readiness, and final documents govern participation.
- **Issuer oracle:** transform source-bound accounting and operating data into signed solvency, liquidity, recency, and confidence signals. The oracle is a disclosure and availability control, not an automatic valuation engine.
- **Eligible transfers:** keep secondary activity separate from primary issuance and subject to eligibility, lockups, issuer restrictions, jurisdiction, and transfer controls.

A token wrapper is not the product by itself. Useful private-market infrastructure also needs issuer onboarding, a legal wrapper, investor eligibility, custody and settlement decisions, data quality, transfer restrictions, and post-close reporting.

Public asset pages may show representative terms and readiness. Production participation requires issuer-specific documents, KYC/KYB where relevant, investor-category or suitability checks, jurisdiction review, custody setup, counsel approval, and transfer controls.

## Arbitrage Hedge Fund

V1 is Polymarket-first. The product compares event-market implied probabilities with explicit, repeatable model probabilities and treats persistent differences as signals for review—not automatic trades.

An investable decision combines the spread with:

- signal confidence and persistence;
- venue liquidity and concentration;
- notional and position limits;
- hedge context;
- event-resolution language and timing;
- stale data, counterparty, and model-drift controls.

The allocator dashboard connects signals to exposure and guardrails. A visible spread can remain monitored indefinitely when controls are incomplete.

Lending markets and derivative-only arbitrage remain research. A strategy graduates only after its data quality, risk limits, failure modes, monitoring, and allocator-facing language are complete enough for review.

## Market-structure positions

The press and research routes now expose a compact summary and a next action. The underlying positions are:

- **Onchain instruments:** their operational value is a shared source of truth for ownership, eligibility, settlement, transfer history, and programmable restrictions—not a token ticker alone.
- **Private secondaries:** better rails should improve ownership records, issuer state, price confidence, controlled settlement, and transfer enforcement instead of presenting every private asset as continuously liquid.
- **Continuous disclosure:** private-market trust depends on current operating evidence. Source-bound telemetry, anomaly detection, and explainable signals can improve review without exposing every raw internal record.
- **Controlled access:** broader participation must still respect offering paths, investor limits, jurisdiction, documents, and issuer-approved restrictions.

## Capital Windows architecture

Capital Windows use Uniswap v4 custom accounting as the final conversion step for approved primary capital calls or company-sponsored secondary windows, not as an always-on public securities AMM.

The design separates responsibilities:

- a registry schedules windows, authorization, caps, and oracle requirements;
- a narrow router supports exact-input payment-to-company-token conversion;
- a hook applies windowed custom accounting and rejects invalid state;
- a restricted asset token provides a second transfer-control layer.

Operating data gates availability and freshness; approved deal or tender terms set the conversion price. Production use still requires counsel, transfer-agent and custody processes, deployment verification, monitoring, invariant testing, audit, and issuer-specific documents.

See [UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md](./UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md) for the technical design.

## Copy rules

- Lead with the screen's object, current state, available action, and next step.
- Prefer tables, metrics, filters, controls, and warnings over narrative sections.
- Keep compliance boundaries close to the affected action.
- Do not promote research as active product scope.
- Keep detailed architecture in docs and discovery summaries in `llms.txt` / `llms-full.txt`.
- Do not restore removed FAQ, manifesto, editorial-principle, or “how to read this page” sections unless user research identifies a specific unmet question.
