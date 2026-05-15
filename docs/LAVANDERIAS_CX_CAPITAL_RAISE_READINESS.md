# Lavanderias CX capital raise readiness

Working objective: make Lavanderias CX investable through Ultramar.capital without turning the public website into an unapproved securities offering.

This is an operating checklist, not legal, tax, accounting, or investment advice. Counsel must approve the jurisdiction, issuer, exemption or registration path, offering documents, marketing language, eligibility rules, transfer controls, and funds flow before any money or binding commitment is accepted.

## Current position

Ultramar already has the right public scaffolding:

- Public product route: `/private-equities`.
- Asset route: `/private-equities/assets/lcx`.
- Deal route: `/private-equities/deals`.
- Legal boundary route: `/private-equities/legal`.
- Oracle concept route: `/private-equities/oracle`.

The main gap is that LCX was still presented like a generic marketplace listing. The asset now needs to behave like a capital raise workroom: clear round target, use of funds, data room status, diligence process, risks, and closing blockers.

Implementation status: the Ultramar app now treats LCX as a counsel-gated capital raise workroom, not a generic marketplace asset. The remaining readiness blockers are outside the public product shell: counsel approval, issuer documents, investor eligibility operations, data room contents, and final funds-flow/subscription controls.

## Non-negotiable boundary

Do not collect money, publish wire instructions, accept binding commitments, or present public copy as a live offer until counsel has approved the path.

Relevant source checks:

- Links below were rechecked on May 13, 2026. These are regulatory orientation sources only; counsel still owns final interpretation and transaction design.
- SEC offering pathway guidance says a business may not offer or sell securities unless registered or exempt: https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/offering-pathways
- SEC Regulation Crowdfunding requires transactions to happen through a registered intermediary and has advertising limits: https://www.sec.gov/resources-small-businesses/exempt-offerings/regulation-crowdfunding
- SEC accredited investor guidance is relevant if US private-market investors are targeted: https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/accredited-investors
- CNBV describes Mexican fintech/crowdfunding activities as reserved activities requiring express authorization: https://www.gob.mx/cnbv/acciones-y-programas/sector-fintech
- CNBV defines Instituciones de Financiamiento Colectivo as authorized entities that connect investors and solicitors through digital means for debt, equity, co-ownership, or royalty financing: https://www.gob.mx/cnbv/acciones-y-programas/instituciones-de-tecnologia-financiera

## Round package

Target working frame:

- Asset: Lavanderias CX.
- Route: `/private-equities/assets/lcx`.
- Round type: primary expansion round.
- Public stage: data room buildout.
- Internal target raise: USD 560,000.
- Current public boundary: informational only, counsel-gated before commitments.
- Candidate instruments: preferred equity or revenue-share note, pending counsel.

Open decisions:

- Final issuer entity and legal name.
- Mexico-only, US-only, or mixed investor base.
- Whether Ultramar acts only as software/data-room infrastructure or touches regulated solicitation, matching, brokerage, custody, funds flow, or transfer activity.
- Whether the round should use a private placement, regulated crowdfunding, direct strategic investor process, SPV, or another approved path.
- Whether public LCX pages can show target economics at all after counsel review.

## Data room checklist

Required before serious investor calls:

- Issuer formation documents, bylaws, powers, board approvals, and beneficial ownership record.
- Current cap table, debt schedule, liens, guarantees, related-party balances, and existing investor rights.
- Monthly P&L, balance sheet, cash flow, bank statements, and reconciliations for at least 24 months where available.
- Store-level KPI package: revenue, tickets, machine utilization, wash/dry mix, repeat customers, water, electricity, rent, payroll, maintenance, downtime, and site margin.
- Tax filings, payroll records, invoices, supplier contracts, and utility bills.
- Store leases, renewal dates, deposit obligations, permits, licenses, insurance, and compliance gaps.
- Equipment list with age, maintenance history, replacement cost, warranties, and supplier lead times.
- Use-of-funds model by site, with capex, opening working capital, contingency, and milestone release logic.
- Financial model with base, downside, and expansion scenarios.
- Risk factors and plain-English investor FAQ.
- Monthly investor update template and KPI definitions.
- Subscription documents, transfer restrictions, funds-flow memo, and closing checklist after counsel approves.

## Ultramar product checklist

Public pages:

- Show LCX as a specific expansion round, not a vague private equity asset.
- Make the target raise and use of funds visible only as informational context.
- Show what is missing before close so investors do not mistake interest for availability.
- Add explicit boundary copy: no funds or binding commitments on public pages.

Gated workflow:

- Investor interest capture with CRM status.
- Eligibility screen: KYC/KYB, investor category, jurisdiction, suitability, sanctions, and transfer-control checks.
- NDA and data room access control.
- Document versioning, watermarking, and audit log.
- Q&A tracker with issuer-approved answers.
- Final allocation table and subscription workflow.
- Post-close portfolio view and monthly reporting cadence.

Oracle workflow:

- Map accounting exports to assets, liabilities, revenue, gross margin, cash, debt, lease obligations, and data freshness.
- Keep raw financials private; show investor-facing proofs and ratios only after issuer approval.
- Log exceptions when bank statements, accounting exports, and store KPIs do not reconcile.
- Timestamp every proof and define who can sign it.

## Implementation closure

Closed in the Ultramar product shell:

- `apps/ultramar/lib/deals.ts` now models LCX as Lavanderias CX with a `capitalRaise` package: USD 560,000 target raise, working instrument, counsel-gated close window, use-of-funds lines, proof points, milestones, data room status, investor process, CRM stages, risk factors, and missing-before-close blockers.
- `/private-equities/assets/lcx` now renders the round memo, explicit public boundary, proof/gating section, use of funds, closing milestones, data room status, investor process, risks, and before-close blockers.
- `/private-equities/assets` and `/private-equities/deals` now surface LCX as a data-room-buildout expansion round with target-raise context rather than just a generic APY card.
- `/private-equities/legal` now includes closing-readiness and gated-diligence language plus a capital acceptance boundary.
- Portfolio API/UI and research links now use the Lavanderias CX name consistently.
- The legacy `apps/private-equities` demo no longer presents LCX with presale copy, live swap actions, or mock investment success states; its market and deal widgets now show counsel-gated/read-only access.
- A follow-on Uniswap v4 architecture is documented in `docs/UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md` for counsel-gated secondary liquidity.

Still not closed, and intentionally not implemented in public code:

- No public app page collects funds, publishes wire instructions, accepts subscription orders, or treats interest as binding.
- No issuer legal entity, exemption path, data room document, investor eligibility decision, or funds-flow process is final until counsel and the issuer approve it.
- The oracle route remains a sandbox proof surface until real accounting exports, reconciliation rules, exception handling, signer policy, and issuer approval are connected.

## Investor materials

Minimum package:

- 10-slide investor deck.
- 2-page investment memo.
- One-page teaser with no uncontrolled return promises.
- Data room index.
- Use-of-funds model.
- Risk memo.
- Legal process memo.
- Investor FAQ.
- Monthly update template.
- Closing timeline.

Investor deck outline:

1. What Lavanderias CX operates.
2. Why the expansion is financeable now.
3. Current store economics and proof.
4. Use of funds by milestone.
5. Market and neighborhood selection logic.
6. Operations, suppliers, equipment, and maintenance.
7. Financial model and downside case.
8. Legal structure and investor eligibility boundary.
9. Ultramar oracle/reporting workflow.
10. Timeline, close conditions, and next steps.

## Priority execution plan

Week 0: legal and issuer path.

- Choose counsel.
- Decide target investor jurisdictions.
- Decide whether Ultramar is platform-only or participates in regulated activity.
- Freeze public copy until counsel approves the line between education and solicitation.

Week 1: diligence pack.

- Collect entity, cap table, leases, permits, bank, accounting, tax, insurance, and equipment records.
- Build the data room index.
- Draft risk factors and investor FAQ.
- Build first financial model.

Week 2: product gating.

- Turn public LCX page into an informational memo.
- Add gated investor access flow.
- Add document status tracking.
- Connect accounting export to oracle mock fields.
- Add CRM stage labels: interest, eligibility, NDA, diligence, allocation, subscription, closed.

Week 3: investor readiness.

- Finalize teaser, memo, deck, data room, and Q&A.
- Run counsel review on copy and documents.
- Prepare first 25 investor targets.
- Schedule diligence calls.
- Open only the approved gated workflow.

## Definition of done

Lavanderias CX is capital-ready when:

- Counsel has approved the offering path and public/private language.
- The issuer entity, signing authority, and cap table are clean.
- The data room answers the first 80 percent of investor diligence without a live call.
- Investor eligibility and transfer controls are operational.
- Subscription and funds-flow steps are final and gated.
- Ultramar can show investors ongoing reporting after the close.
- No public page can accidentally accept a security purchase, commitment, or funds transfer.
