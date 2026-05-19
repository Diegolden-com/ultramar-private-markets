# YC Application Draft - Ultramar

Working strategy: apply with Ultramar as private-market operating infrastructure, not as two unrelated financial products. The repo supports a stronger YC story around issuer workrooms, eligibility, accounting oracles, restricted token rails, and post-close reporting. Treat the Polymarket stack as technical proof of risk-engine ability unless you are intentionally applying as a fund infrastructure company.

Facts to verify before submitting:

- Current founder location and desired post-YC base.
- Whether anyone else wrote production code.
- Whether there are real users, pilots, LOIs, revenue, legal entities, or investments.
- Whether Lavanderias CX is actually available to discuss by name in the application.
- Whether you want to mention tokenization explicitly or lead with private-market workflow software.

## Recommended Core Framing

**Company name**

Ultramar

**Describe what your company does in 50 characters or less**

Private-market rails with issuer oracles

Alternative:

Auditable capital rails for private companies

**Company URL**

https://ultramar.capital

**Product link**

https://ultramar.capital/private-equities/assets/lcx

Alternative broader product demo:

https://ultramar.capital/private-equities

**Login credentials**

None for the public demo.

## Founders

**Who writes code, or does other technical work on your product? Was any of it done by a non-founder? Please explain.**

I write the product and technical work myself. The repo includes the Next.js/React product app, the private-equities reference implementation, the QuickBooks/oracle proof workflow, Solidity contracts, and the Polymarket strategy backend. I use AI coding and design tools as assistants, including Codex/Claude-style coding sessions and generated UI references from v0/Stitch, but the architecture, integration, debugging, and product decisions are founder-owned. [VERIFY: add any contractor or collaborator if applicable.]

**Are you looking for a cofounder?**

[CHOOSE ONE]

No. I am applying as a solo founder and am looking for early technical/operator hires after I validate the first issuer workflow.

Alternative:

Yes, selectively. I am looking for a cofounder with deep securities/compliance or private-market distribution experience.

## Founder Video Script

Hi, I am Diego Jimenez Vergara, founder of Ultramar. I am building the operating layer that makes private companies investable without pretending that tokenization alone solves diligence.

The first product is an issuer workroom for private-market raises. It combines a data room, investor eligibility workflow, accounting oracle, restricted token rails, and post-close reporting. The first concrete workflow is Lavanderias CX, a Mexico City operating business preparing an expansion round. Ultramar shows the asset, use of funds, diligence status, risks, and closing blockers while keeping commitments counsel-gated.

I have built the product myself: the public app, issuer pages, QuickBooks oracle prototype, Solidity contracts, and risk-engine infrastructure. The insight is that the hard part is not minting a token. The hard part is turning messy private-company operating data into something investors, counsel, and issuers can trust repeatedly.

YC is the right environment because this needs speed, focus, and direct customer pressure from issuers and investors.

## Company

**What is your company going to make? Please describe your product and what it does or will do.**

Ultramar is building the operating layer for private companies raising capital from eligible investors.

The product gives an issuer a counsel-gated workroom: asset memo, data room status, investor eligibility/KYC workflow, accounting oracle, restricted token and transfer controls, and post-close portfolio reporting. The first workflow is Lavanderias CX, a Mexico City laundromat expansion round. The public product explains the asset, target raise, use of funds, risks, and missing-before-close blockers, but it does not collect funds or accept binding commitments until counsel approves the offering path.

The core insight is that tokenization is not the product. The product is the workflow around diligence, eligibility, operating-data disclosure, transfer restrictions, and ongoing investor reporting. Tokens become useful only after the issuer, legal wrapper, investor permissions, and reporting controls are clear.

**Where do you live now, and where would the company be based after YC?**

[VERIFY]

Mexico City, Mexico / San Francisco, United States

Alternative if you are currently in the US:

[Current city], United States / San Francisco, United States

**Explain your decision regarding location.**

The first issuer workflow is in Mexico/LatAm private markets, where many operating businesses need smaller, structured growth capital and better investor reporting. After YC, I would base the company in San Francisco to be close to YC, fintech infrastructure companies, investors, and the regulatory/compliance network needed to make private-market software credible.

## Progress

**How far along are you?**

I have a live public product demo and an end-to-end technical prototype.

Built:

- Canonical Next.js app at `ultramar.capital` with private-equities routes for assets, deals, oracle, market, portfolio, legal, and research.
- Lavanderias CX issuer workroom with target raise context, use of funds, data room status, diligence process, investor process, risk factors, and closing blockers.
- QuickBooks/oracle reference implementation that converts accounting data into solvency/liquidity metrics and signed proofs.
- Solidity contracts for solvency registry, permissioned asset token, deal manager, and secondary-liquidity experiments.
- Polymarket backend that demonstrates broader risk-engine capability: ingestion, mapping, pricing, signals, risk checks, paper/live-shadow execution, idempotent order intents, reconciliation, kill switch, and canary ramp controls.

Not yet done:

- No production securities offering is live.
- No public page accepts funds, wire instructions, subscriptions, or binding commitments.
- KYC/KYB, legal offering path, data room documents, funds flow, and post-close reporting need to be validated with counsel and pilot issuers/investors.

**How long have each of you been working on this? How much full-time?**

The repo shows active development from February 2026 through May 2026, with consolidation into the current Ultramar app in May 2026. [VERIFY full-time status.] Suggested answer if true: I have worked on this since February 2026 and have been full-time since [date].

**What tech stack are you using, or planning to use? Include AI models and AI coding tools.**

Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Recharts, Vercel.

Backend/data: Python 3.10, FastAPI, SQLAlchemy, Alembic, PostgreSQL/SQLite, Docker Compose, httpx, websockets, pytest, ruff.

Private-market/oracle: QuickBooks API, Supabase references, viem, Solidity, Foundry, OpenZeppelin, Mantle Sepolia demo deployment.

Auth/investor UX references: Supabase Auth, Privy, KYC/KYB workflow planned.

AI tools: Codex, Claude/Claude Code-style agents, Vercel v0, Stitch. [ADD Cursor/OpenAI models/etc. only if actually used.]

**Optional: attach a coding agent session you are proud of.**

Best candidate: the Polymarket execution-hardening session, because it shows real engineering judgment under capital risk. It produced SDK-first market data, trading gateway abstraction, L2 startup checks, durable order intents, reconciliation worker, backlog SLA report, kill switch, incident runbook, and canary/ramp profiles. Attach the transcript if you can export it; otherwise use the commit range around Feb 25-26, 2026 as supporting evidence.

**Are people using your product?**

[VERIFY]

Recommended if no live pilot yet:

No paying users yet. The public demo is live, and I am using Lavanderias CX as the first issuer workflow. The next milestone is a counsel-approved closed pilot with [number] issuers and [number] eligible investors by [date].

**When will you have a version people can use?**

Public demo is usable now. The first gated pilot should be usable by [date], after counsel approves the offering path, eligibility checks, data room access, and funds-flow boundaries.

**Do you have revenue?**

[VERIFY]

Recommended if true:

No.

**Previous YC application / pivot**

[VERIFY]

If not applicable:

N/A.

**Incubator, accelerator, pre-accelerator**

[VERIFY]

If none:

No.

## Idea

**Why did you pick this idea? Domain expertise? How do you know people need it?**

I picked this after trying to make a real operating business investable through software. The surprising part was not tokenization. The hard part was everything around it: issuer documents, data room readiness, investor eligibility, operating metrics, accounting exports, transfer restrictions, and ongoing reporting.

The repo reflects that learning. Lavanderias CX is modeled as a counsel-gated capital raise workroom rather than a generic token listing. The product tracks use of funds, diligence status, missing documents, risks, investor process, and oracle readiness. That is the actual pain: private companies and investors do not share a reliable operating layer after the first conversation.

I know people need it because private companies already raise money through fragmented docs, WhatsApp/email, spreadsheets, and one-off legal processes. Investors want better ongoing disclosure, and issuers need a cheaper way to look institutionally prepared before they can raise. [ADD specific customer conversations, LOIs, issuer names, investor meetings, or waitlist numbers.]

**Who are your competitors? What do you understand that they do not?**

Competitors include Securitize, Tokeny, Texture, Republic, Carta, Forge, EquityZen, and Nasdaq Private Market.

Securitize/Tokeny/Texture focus on regulated tokenization infrastructure, often for institutional issuers and funds. Republic focuses on investor access and tokenized assets. Carta manages private-capital workflows and cap tables. Forge, EquityZen, and Nasdaq Private Market focus on secondary liquidity for later-stage private company shares.

What we understand differently: for smaller operating companies, the bottleneck is not issuing a token or creating a marketplace. The bottleneck is becoming capital-ready in the first place. Ultramar starts before issuance: data room, operating KPIs, accounting proofs, investor eligibility, legal boundaries, and post-close reporting. The wedge is issuer trust and continuous disclosure, not exchange liquidity.

**How do or will you make money? How much could you make?**

Initial revenue:

- Setup fee for issuer onboarding, data room, accounting integration, and investor workflow.
- Monthly SaaS fee for issuer workroom, oracle/reporting, investor CRM, and portfolio updates.
- Closing/admin fee only where legally allowed and through licensed partners if required.

Possible pricing:

- $2k to $10k setup per issuer.
- $500 to $5k/month per issuer depending on reporting complexity.
- 1% to 3% admin/success fee on approved closings where permitted.

If Ultramar supports 1,000 issuers raising an average of $500k/year and earns 2% where legally allowed, that is $10M/year in transaction revenue. If those issuers also pay $1k/month on average for reporting and investor operations, that is another $12M ARR. Larger issuers and fund/SPV workflows could make the market much larger, but the wedge should stay small and concrete.

**Other ideas considered**

- Polymarket/event-market arbitrage infrastructure: signal engine, risk dashboard, execution/reconciliation controls.
- Compliance-gated Uniswap v4 secondary liquidity for private-market asset tokens.
- Issuer accounting oracle as standalone infrastructure for RWA platforms.
- Capital raise readiness workroom for brick-and-mortar SMBs in LatAm.

## Equity

**Have you formed ANY legal entity yet?**

[VERIFY: Yes/No. Add entity name, jurisdiction, date if yes.]

**Have you taken any investment yet?**

[VERIFY: Yes/No.]

**Are you currently fundraising?**

[VERIFY: Yes/No.]

## Curious

**What convinced you to apply to Y Combinator?**

YC is the right forcing function for focus. Ultramar sits at the intersection of private markets, fintech infrastructure, accounting data, and regulated workflows. YC would help me compress customer discovery, sharpen the wedge, avoid overbuilding, and get in front of the right issuers, investors, and infrastructure partners.

[ADD if true: who encouraged you, YC events attended, YC alumni conversations.]

**How did you hear about Y Combinator?**

[VERIFY. Example: I have followed YC for years through Startup School, YC founder essays, and companies I admire.]

**Batch preference**

Summer 2026.

## Claims To Avoid Unless Verified

- Do not claim live AUM, live volume, or active trading from UI placeholders.
- Do not claim revenue, users, LOIs, or committed investors unless true.
- Do not imply Ultramar is a broker-dealer, ATS, transfer agent, investment adviser, fund, or public exchange unless an entity and licenses exist.
- Do not say people can buy LCX through the public site. The repo intentionally keeps LCX counsel-gated.
- Do not pitch the Polymarket hedge fund as the main YC company unless you want to answer investment-company, regulatory, and live-capital questions.

