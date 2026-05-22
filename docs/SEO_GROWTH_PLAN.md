# Ultramar.capital SEO Growth Plan

## Positioning

Primary domain: `https://ultramar.capital`

Core topical clusters:

- Private markets: tokenized private equity, RWA investing, private-market asset marketplace, issuer oracle, compliance-aware transfers.
- Polymarket arbitrage: prediction market arbitrage, Polymarket signals, event-market mispricing, allocator risk controls.
- Platform brand: Ultramar.capital as the canonical brand that owns both product lines.

## Technical SEO Baseline

- Keep only canonical `ultramar.capital` URLs in the sitemap.
- Keep only the `www.ultramar.capital` to `ultramar.capital` redirect; do not publish prelaunch subdomain aliases.
- Keep auth pages `noindex`.
- Keep API routes out of crawlable discovery surfaces.
- Keep JSON-LD aligned with visible page content: Organization, WebSite, WebPage, Service, BreadcrumbList, ItemList, and FAQPage where the FAQ is visible.
- Update sitemap `lastModified` only when main content, schema, or important internal links change.

## Linkable Assets To Build

1. Polymarket arbitrage explainer

   Target: allocators and market-structure readers.

   Angle: "How prediction-market prices diverge from derivatives-implied probabilities."

   Link targets: `/arbitrage-hedge-fund`, `/arbitrage-hedge-fund/signals`, `/arbitrage-hedge-fund/risk`.

2. Tokenized private equity primer

   Target: RWA investors, issuers, fintech/legal operators.

   Angle: "What has to exist before private equity can move on token rails."

   Link targets: `/private-equities`, `/private-equities/assets`, `/private-equities/legal`.

3. Issuer oracle memo

   Target: founders, CFOs, RWA infrastructure teams.

   Angle: "Why operating data matters more than token wrappers for private-market trust."

   Link targets: `/private-equities/oracle`, `/private-equities/assets/lcx`.

4. Risk controls memo

   Target: LPs, allocators, crypto fund analysts.

   Angle: "Sizing, liquidity, and model-drift controls for event-market arbitrage."

   Link targets: `/arbitrage-hedge-fund/risk`, `/arbitrage-hedge-fund/dashboard`.

## Implemented Routes

- Research index: `/research`
- Polymarket arbitrage explainer: `/research/polymarket-arbitrage-explainer`
- Tokenized private equity primer: `/research/tokenized-private-equity-primer`
- Issuer oracle memo: `/research/issuer-oracle-operating-data`
- Risk controls memo: `/research/event-market-risk-controls`

Implementation notes:

- Each memo has visible long-form content, Article JSON-LD, WebPage JSON-LD, BreadcrumbList JSON-LD, canonical metadata, Open Graph/Twitter metadata, and internal links to the product pages listed above.
- The research index has ItemList JSON-LD and is included in the sitemap.
- Home, Private Equities, Arbitrage Hedge Fund, header navigation, footer navigation, and the sitemap now link to the research library or article pages.
- Outreach templates live in `docs/BACKLINK_OUTREACH.md`.

## Backlink Acquisition

Allowed targets:

- Editorial mentions in fintech, RWA, crypto market-structure, and alternative-investment publications.
- Partner ecosystem pages where Ultramar is genuinely integrated or referenced.
- Founder/operator interviews that discuss private markets, Polymarket signals, or issuer data.
- Data-driven research citations from the linkable assets above.
- Relevant podcast/show-note links and conference speaker pages.

Avoid:

- Buying links that pass ranking value.
- Large-scale guest post networks.
- Excessive reciprocal link exchanges.
- Low-quality directories and bookmark sites.
- Exact-match anchor blasts.
- Automated link creation.

Anchor text mix:

- Brand: `Ultramar.capital`, `Ultramar`, `Ultramar Private Equities`.
- Partial match: `tokenized private-market platform`, `Polymarket arbitrage signals`, `issuer oracle workflow`.
- Natural URL: `https://ultramar.capital/private-equities`.

## 30 Day Execution

Week 1:

- Submit `https://ultramar.capital/sitemap.xml` in Google Search Console.
- Inspect `/`, `/private-equities`, `/arbitrage-hedge-fund`, and `/private-equities/assets` with URL Inspection.
- Publish one private-market primer and one Polymarket arbitrage explainer.

Week 2:

- Pitch 15 relevant fintech/RWA/newsletter editors with one research asset, not a generic homepage pitch.
- Add partner/profile links from Molino, Diego Golden, and any real project pages that already mention Ultramar.
- Create social and founder posts that link to the specific research pages.

Week 3:

- Publish issuer oracle memo.
- Pitch RWA infrastructure communities and founder newsletters.
- Add internal links from the memo to `/private-equities/oracle`, `/private-equities/legal`, and one asset detail page.

Week 4:

- Publish risk-controls memo.
- Pitch allocator, crypto fund, and prediction-market newsletters.
- Review Search Console queries and expand pages that already receive impressions.

## Measurement

Track weekly:

- Indexed pages and crawl errors.
- Queries by product cluster.
- Click-through rate by page title.
- Referring domains by quality and topical relevance.
- Internal links to product pages.
- Conversions from organic sessions to asset, signal, or auth intent pages.
