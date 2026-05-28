export type PressLinkTarget = {
  label: string;
  href: string;
  description: string;
};

export type PressSection = {
  heading: string;
  body: string[];
};

export type PressArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  thesis: string;
  cluster: "Onchain instruments" | "Private-market access" | "AI compliance";
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  image: string;
  keywords: string[];
  takeaways: string[];
  sections: PressSection[];
  linkTargets: PressLinkTarget[];
  technicalReferences?: PressLinkTarget[];
};

const capitalWindowsAppLinks: PressLinkTarget[] = [
  {
    label: "Open Private Equities",
    href: "/private-equities",
    description: "The canonical Ultramar app surface for gated private-market workflows.",
  },
  {
    label: "View company-token asset",
    href: "/private-equities/assets/lcx",
    description: "A concrete company-token workspace with asset context and capital terms.",
  },
  {
    label: "Review capital windows",
    href: "/private-equities/deals",
    description: "Issuer rounds and controlled capital-call style workflow context.",
  },
  {
    label: "Open secondary context",
    href: "/private-equities/market",
    description: "The app route for controlled transfer and secondary-liquidity context.",
  },
  {
    label: "Check eligibility gate",
    href: "/private-equities/legal",
    description: "The app boundary for counsel review, eligibility, and access controls.",
  },
  {
    label: "Request access",
    href: "/auth/sign-up",
    description: "The account request route before gated investor workflows.",
  },
];

export const pressArticles: PressArticle[] = [
  {
    slug: "capital-windows-uniswap-v4-custom-accounting",
    eyebrow: "Uniswap v4 hackathon submission",
    title: "Capital Windows: Gated company-token conversion with Uniswap v4 custom accounting",
    description:
      "Ultramar Capital Windows use Uniswap v4 custom accounting as a gated final conversion step for approved primary capital calls and company-sponsored secondary liquidity windows.",
    audience: "Uniswap v4 judges, hook builders, RWA teams, private-market operators, and capital-formation reviewers",
    thesis:
      "Private-company liquidity should not be an always-on public AMM. It should be a scheduled, permissioned conversion window where eligibility, allocation, oracle freshness, caps, timing, and transfer controls are enforced before USDC becomes company tokens.",
    cluster: "Onchain instruments",
    publishedAt: "2026-05-28",
    updatedAt: "2026-05-28",
    readingTime: "10 min read",
    image: "/data-infrastructure.png",
    keywords: [
      "Uniswap v4 custom accounting",
      "Uniswap v4 hooks",
      "custom accounting hook",
      "capital calls",
      "tokenized private equity",
      "permissioned liquidity",
      "RWA liquidity",
      "private company secondary liquidity",
      "company token conversion",
      "capital windows",
    ],
    takeaways: [
      "The implementation treats a Uniswap v4 pool as the final conversion step for approved capital workflows, not as an open public exchange.",
      "The hook uses `beforeSwapReturnDelta` custom accounting to replace generic AMM execution with a windowed step conversion curve.",
      "Primary conversion and secondary liquidity are both supported, but only through scheduled windows with signed authorization, investor caps, oracle freshness, and exact-input routing.",
    ],
    sections: [
      {
        heading: "The goal is not a public securities AMM",
        body: [
          "Private-company liquidity is usually structured. The company, counsel, transfer agent, or platform controls who can participate, when the window opens, which securities can move, what price or pricing method applies, and how much can be sold. That is closer to a tender window, capital call, or controlled closing than to an always-on public pool.",
          "Capital Windows are built around that reality. The pool is the last step after investor eligibility, data-room access, allocation, counsel-reviewed terms, and signed authorization. Public Ultramar pages remain informational. The transaction path belongs behind a gated app and router.",
        ],
      },
      {
        heading: "What was implemented",
        body: [
          "The demo adds `CapitalWindowRegistry`, `CapitalWindowHook`, and `CapitalWindowRouter` to the Private Equities contract workspace. The registry schedules windows, records investor limits, checks oracle freshness, verifies authorizer signatures, and tracks filled capacity. The router pre-settles exact-input payment into Uniswap v4 `PoolManager`. The hook validates the window and returns a custom accounting delta that delivers company-token output.",
          "The Foundry tests use the real Uniswap v4 `PoolManager` from `v4-core`. They cover primary conversion, secondary liquidity, outside-window rejection, total-cap rejection, per-investor-cap rejection, stale oracle rejection, unapproved investor rejection, invalid signature rejection, exact-output rejection, and public liquidity modification rejection.",
        ],
      },
      {
        heading: "Why custom accounting matters",
        body: [
          "A normal AMM curve is the wrong default for approved private-market conversion. Primary capital calls and secondary windows often use approved terms, not continuous public price discovery. Uniswap v4 custom accounting lets the hook consume the entire exact input and replace the concentrated-liquidity swap with a custom window curve.",
          "In this implementation, the base price comes from the approved window. Optional step increments can change the conversion rate as scheduled tranches fill. The curve is not trying to infer fair value from raw accounting data during a swap. The oracle gates availability and freshness; it does not silently reprice the company.",
        ],
      },
      {
        heading: "Primary conversion windows",
        body: [
          "A primary conversion window models the final step of a capital call or approved issuer round. The investor has already passed the platform workflow. The window defines the payment token, company token, treasury recipient, start and end time, total cap, per-investor cap, minimum ticket, base price, step size, and required oracle freshness.",
          "When the approved investor sends exact-input USDC through the gated router, the hook verifies the signed payload and window state, routes cash to the issuer treasury, and releases company tokens from hook-held inventory. If the window is paused, expired, stale, over capacity, or missing authorization, the swap reverts.",
        ],
      },
      {
        heading: "Secondary liquidity windows",
        body: [
          "Secondary liquidity uses the same primitive with a different recipient and mode. Instead of routing cash to the issuer treasury, the window can route cash to seller escrow or a settlement recipient while approved buyers receive company tokens from controlled inventory.",
          "That matters because private-company secondaries should often be company-sponsored and event-based. A window can be dual-sided or tender-like without pretending the asset has unrestricted public market liquidity. The hook blocks generic public LP add/remove actions in the custom-accounting pool.",
        ],
      },
      {
        heading: "The gated router is part of the design",
        body: [
          "Uniswap v4 hooks see the router as the sender, not the end investor. Capital Windows handle that by requiring `hookData` with a window id, investor address, minimum company-token output, deadline, nonce, and authorizer signature. The registry verifies the signer and marks the authorization as used.",
          "The router is intentionally narrow: exact input only, payment-token-to-company-token only, and tied to approved pool keys. This keeps generic routing from becoming the compliance boundary. The restricted `AssetToken` remains a second layer of defense because only whitelisted infrastructure and investors can send or receive the company token.",
        ],
      },
      {
        heading: "Oracle checks gate availability",
        body: [
          "The hook reads the local `SolvencyRegistry` through the window registry. Each window can require a fresh issuer proof, a minimum solvency ratio, and a minimum liquidity ratio. If the proof is missing, stale, or below the window threshold, conversion stops.",
          "This is intentionally conservative. Operating data is a risk gate, not an automatic pricing oracle. The company-token price for a window should come from approved round documents, tender terms, or counsel-reviewed secondary mechanics. The oracle tells the system whether the window is allowed to operate.",
        ],
      },
      {
        heading: "Production path",
        body: [
          "This is a hackathon implementation and architecture proof. A production version would need counsel-approved offering paths, transfer-agent workflow, custody decisions, hook address mining, deployment verification, monitoring, invariant testing, third-party audit, and issuer-specific documents before any real capital moves.",
          "The ambitious claim is narrower and stronger than a generic RWA AMM: Uniswap v4 can be the programmable settlement layer for structured private-market windows. The hook is valuable because it makes the compliant path more deterministic, not because it removes the need for legal, operational, or investor-protection work.",
        ],
      },
    ],
    linkTargets: capitalWindowsAppLinks,
    technicalReferences: [
      {
        label: "Uniswap v4 custom accounting",
        href: "https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting",
        description: "Uniswap documentation for return deltas, hook accounting, and custom curves.",
      },
      {
        label: "Uniswap v4 AsyncSwap hooks",
        href: "https://developers.uniswap.org/docs/protocols/v4/guides/hooks/async-swap",
        description: "The exact-input custom accounting pattern used to replace native swap logic.",
      },
      {
        label: "Uniswap v4 architecture",
        href: "https://developers.uniswap.org/docs/protocols/v4/concepts/architecture",
        description: "Hooks, singleton PoolManager, flash accounting, and custom accounting context.",
      },
      {
        label: "Nasdaq Private Market liquidity",
        href: "https://www.nasdaqprivatemarket.com/liquidity/",
        description: "Reference point for company-sponsored private-company liquidity windows.",
      },
      {
        label: "SEC private secondary markets",
        href: "https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/private-secondary-markets",
        description: "SEC overview of private secondary transactions and resale restrictions.",
      },
      {
        label: "ERC-3643 compliance framework",
        href: "https://docs.erc3643.org/erc-3643/overview-of-the-protocol/built-in-compliance-framework",
        description: "Reference point for identity-aware, offering-aware token transfer controls.",
      },
    ],
  },
  {
    slug: "why-capital-markets-need-onchain-instruments-now",
    eyebrow: "Market structure position",
    title: "Why capital markets need onchain instruments now",
    description:
      "The case for onchain instruments is not speculation. It is a market-structure response to private-market opacity, slow settlement, high secondary fees, and unequal access.",
    audience: "Founders, investors, fintech operators, and market-structure readers",
    thesis:
      "Onchain instruments are needed because ownership, disclosure, eligibility, settlement, and transfer controls can no longer live in disconnected back-office systems.",
    cluster: "Onchain instruments",
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    readingTime: "8 min read",
    image: "/data-infrastructure.png",
    keywords: [
      "onchain instruments",
      "onchain capital markets",
      "tokenized equity",
      "tokenized private equity",
      "real world assets",
      "RWA tokenization",
      "private market infrastructure",
    ],
    takeaways: [
      "The strongest argument for onchain instruments is operational, not ideological: markets need a shared source of truth for ownership, eligibility, settlement, and transfer history.",
      "Private-market access cannot scale while liquidity, pricing confidence, and disclosure remain trapped in manual workflows.",
      "AI-native compliance and onchain transfer controls can make private assets more legible without pretending every company is ready for a traditional public listing.",
    ],
    sections: [
      {
        heading: "The bottleneck is no longer demand",
        body: [
          "Investors already want access to private-company growth before the public-market debut. Founders already want cleaner liquidity paths for employees, early backers, and strategic holders. The bottleneck is the operating system between those two groups.",
          "Private-market transactions still depend on fragmented documents, manual eligibility checks, limited price confidence, long settlement paths, and expensive intermediaries. That is why a market can have demand and still feel illiquid.",
        ],
      },
      {
        heading: "Onchain instruments make the asset programmable",
        body: [
          "A useful onchain instrument is not just a token with a ticker. It is an ownership record that can carry transfer restrictions, holding periods, investor permissions, cap-table updates, audit trails, and settlement logic in a single rails layer.",
          "This matters because the private-market problem is not solved by creating more marketplaces. It is solved by reducing the cost of trust. If ownership and transfer rules are visible to the system, the market can price and settle with less manual reconciliation.",
        ],
      },
      {
        heading: "Disclosure has to become continuous",
        body: [
          "The old model asks investors to trust periodic PDFs, delayed financial statements, and sporadic issuer updates. That cadence is weak for assets that may trade continuously and globally.",
          "A modern rail should connect issuer bank data, receivables, payables, accounting systems, customer concentration, renewal data, and cash-flow telemetry into compliance signals. The market does not need every raw document in public. It needs a reliable way to know whether the issuer remains healthy, current, and eligible for trading.",
        ],
      },
      {
        heading: "The regulatory answer is encoded control, not lawless access",
        body: [
          "The serious version of tokenized equity does not argue that securities rules disappear. It argues that many checks can move from manual paperwork into programmable controls: investor category, jurisdiction, lockup, transfer restriction, whitelist, and audit trail.",
          "That distinction matters. Onchain instruments can expand access while preserving boundaries. The goal is not to ignore regulation. The goal is to make the compliant path cheaper, faster, and more transparent than the informal path.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Private Equities",
        href: "/private-equities",
        description: "The Ultramar product surface for tokenized private-market workflows.",
      },
      {
        label: "Issuer Oracle",
        href: "/private-equities/oracle",
        description: "The operating-data layer for issuer monitoring and solvency context.",
      },
      {
        label: "Legal Gate",
        href: "/private-equities/legal",
        description: "The eligibility and transfer-control boundary for private-market access.",
      },
    ],
  },
  {
    slug: "private-secondaries-need-transparent-rails",
    eyebrow: "Secondary market analysis",
    title: "Private secondaries need transparent rails, not more toll booths",
    description:
      "Secondary markets for private shares remain expensive, manual, and low-confidence. Tokenized rails can compress the distance between seller intent, buyer eligibility, price discovery, and settlement.",
    audience: "Secondary buyers, founders, early employees, and private-market operators",
    thesis:
      "The secondary market tax is a symptom of weak infrastructure: every transfer has to rebuild trust from scratch.",
    cluster: "Private-market access",
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    readingTime: "7 min read",
    image: "/abstract-financial-growth-chart-geometric-shapes.jpg",
    keywords: [
      "private secondary market",
      "secondary market fees",
      "tokenized private shares",
      "private company liquidity",
      "private market price discovery",
    ],
    takeaways: [
      "High secondary fees are easier to charge when ownership records, transfer approvals, pricing, and settlement remain fragmented.",
      "Tokenized private shares can lower friction only when the token is connected to real legal rights and issuer-approved transfer rules.",
      "Transparent rails should increase price confidence before they increase trading speed.",
    ],
    sections: [
      {
        heading: "The market is liquid in interest, illiquid in execution",
        body: [
          "Private secondaries often have buyers and sellers, but the actual transaction can still be slow and expensive. Buyers need confidence in the asset, the seller needs a clean transfer path, the issuer may have approval rights, and intermediaries charge for stitching the process together.",
          "That structure creates a toll booth around information scarcity. A buyer who lacks real-time price signals, compliance status, or operating context demands a discount. A platform that controls access to scarce liquidity can charge a high fee.",
        ],
      },
      {
        heading: "A better rail starts with approved transfer logic",
        body: [
          "The first improvement is not a faster matching engine. It is an asset that knows who can hold it, when it can move, what restrictions apply, and which issuer approvals are required.",
          "Once those rules are encoded, the marketplace can focus on price discovery instead of reconstructing basic permissioning for every transaction. That is the difference between a digitized process and market infrastructure.",
        ],
      },
      {
        heading: "Price confidence needs issuer state",
        body: [
          "A private-company token without issuer state is still a blind trade. Investors need a signal about revenue quality, cash position, burn rate, liabilities, data recency, and material anomalies.",
          "Continuous issuer telemetry does not eliminate diligence, but it can change the baseline. The market can move from rumor and stale decks toward comparable operating signals that everyone can inspect at the same time.",
        ],
      },
      {
        heading: "Lower fees should come from lower reconciliation cost",
        body: [
          "A credible onchain secondary rail should reduce intermediation because settlement, cap-table updates, audit history, and transfer restrictions are handled by shared infrastructure.",
          "If the system still needs the same manual checks in the same sequence, tokenization has not solved the economic problem. The point is to remove redundant coordination while preserving the controls that make the transfer valid.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Private Market",
        href: "/private-equities/market",
        description: "The Ultramar market route for private-market pricing and transfer context.",
      },
      {
        label: "Assets",
        href: "/private-equities/assets",
        description: "The asset discovery surface for private-market opportunities.",
      },
      {
        label: "Compliance",
        href: "/compliance",
        description: "The public control surface for eligibility, diligence, and transfer boundaries.",
      },
    ],
  },
  {
    slug: "ai-compliance-is-the-disclosure-layer-for-tokenized-equity",
    eyebrow: "AI compliance thesis",
    title: "AI compliance is the disclosure layer tokenized equity is missing",
    description:
      "Tokenized equity needs more than settlement rails. It needs continuous machine-readable disclosure that can detect anomalies, score issuer health, and explain risk to investors.",
    audience: "Fintech builders, compliance teams, issuers, and RWA investors",
    thesis:
      "AI compliance should function as a continuous disclosure layer that compresses issuer operating data into reviewable investor signals.",
    cluster: "AI compliance",
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    readingTime: "8 min read",
    image: "/tarot-oracle.png",
    keywords: [
      "AI compliance",
      "AI disclosure",
      "tokenized equity compliance",
      "issuer oracle",
      "continuous compliance monitoring",
      "financial data oracle",
    ],
    takeaways: [
      "AI compliance is most useful when it evaluates source data, flags anomalies, and explains score changes instead of producing unsupported opinions.",
      "The right comparison is not AI versus perfect oversight. It is AI-supported continuous review versus expensive periodic review that can miss problems for months.",
      "Model risk is real, so high-stakes compliance should benchmark multiple models, retain audit logs, and route edge cases to human review.",
    ],
    sections: [
      {
        heading: "Periodic disclosure is mismatched to continuous markets",
        body: [
          "If private assets can trade on always-on rails, disclosure cannot remain a quarterly or annual ritual. Investors need to know whether the issuer is connected, current, solvent, and operating within expected bounds.",
          "AI compliance can evaluate bank data, accounting feeds, receivables, payables, payment processors, customer concentration, renewal rates, and unusual related-party activity. The output should be a score, a plain-language explanation, and an audit trail of what changed.",
        ],
      },
      {
        heading: "The model should not pretend to be a regulator",
        body: [
          "The useful role for AI is narrower and more practical: anomaly detection, document consistency checks, data freshness scoring, burn-rate analysis, revenue quality signals, and fraud-pattern monitoring.",
          "That layer can give investors a common reference point without exposing every sensitive contract or internal ledger entry. A score is not a legal opinion. It is a market signal backed by source-data access and repeatable methodology.",
        ],
      },
      {
        heading: "Hallucination risk has to be designed around",
        body: [
          "Financial ratings cannot rely on a single model answer with no evidence trail. The system needs deterministic calculations where possible, retrieval from source systems, model comparison, confidence scoring, and human escalation for edge cases.",
          "Traditional ratings agencies have also failed under incentive pressure. AI does not remove that history, but it can reduce some forms of influence if the methodology is transparent, source-bound, and benchmarked across models.",
        ],
      },
      {
        heading: "The investor benefit is legibility",
        body: [
          "The goal is not to make every investor read raw financials. The goal is to make issuer state legible enough that investors can compare assets, understand why a score moved, and see when data access breaks.",
          "A market with shared issuer signals is more credible than a market that only shows price, volume, and a logo. Tokenized equity needs that disclosure layer before it deserves broad investor trust.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Oracle",
        href: "/private-equities/oracle",
        description: "The issuer accounting oracle and solvency proof workflow.",
      },
      {
        label: "Issuer Oracle Research",
        href: "/research/issuer-oracle-operating-data",
        description: "A research memo on why operating data matters for private-market trust.",
      },
      {
        label: "Compliance",
        href: "/compliance",
        description: "Compliance operating boundaries for Ultramar.capital.",
      },
    ],
  },
  {
    slug: "retail-access-to-private-companies-should-not-wait-for-ipo",
    eyebrow: "Access thesis",
    title: "Retail access to private companies should not wait for the IPO",
    description:
      "The public-private market boundary increasingly withholds growth from ordinary investors while allowing riskier forms of speculation elsewhere. Onchain instruments offer a more controlled access path.",
    audience: "Retail platforms, policy readers, founders, and private-market investors",
    thesis:
      "If investors can access highly speculative assets, the policy question is not whether risk exists in private companies. It is whether private-company risk can be disclosed, limited, and transferred through better infrastructure.",
    cluster: "Private-market access",
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    readingTime: "7 min read",
    image: "/shipping-logistics.png",
    keywords: [
      "retail private market access",
      "private company investing",
      "tokenized private companies",
      "private equity access",
      "Reg A tokenized equity",
      "onchain investor protection",
    ],
    takeaways: [
      "Many companies now stay private long enough that public investors receive access after a large share of growth has already occurred.",
      "Retail access should be expanded through controlled structures: eligibility, limits, disclosures, lockups, and transfer rules.",
      "Onchain instruments make those controls easier to enforce consistently across investors, issuers, and secondary transfers.",
    ],
    sections: [
      {
        heading: "The growth arrives before the public listing",
        body: [
          "The old bargain was simple: private markets were early and risky, public markets were broader and more transparent. That bargain has weakened as strong companies stay private longer and public investors enter later in the value-creation cycle.",
          "When ordinary investors can speculate in volatile crypto assets, prediction markets, and levered public-market instruments, a blanket exclusion from private-company upside becomes harder to defend as investor protection alone.",
        ],
      },
      {
        heading: "Access needs constraints, not mythology",
        body: [
          "Private-company investing is risky. Many companies fail, information is imperfect, and liquidity can disappear. A serious access model should say that clearly instead of marketing private assets as guaranteed democratization.",
          "But risk is not an argument for permanent exclusion. It is an argument for investment limits, issuer standards, disclosure requirements, eligibility checks, transparent transfer restrictions, and clear loss language.",
        ],
      },
      {
        heading: "Onchain controls are more enforceable than PDF promises",
        body: [
          "A subscription agreement can describe who may hold an asset. A smart contract can enforce a whitelist. A disclosure policy can require updates. An issuer oracle can show when data access is stale.",
          "That does not replace legal structure, but it gives the legal structure a live operating layer. Retail access becomes more defensible when the system can enforce limits and show investors the status of the controls.",
        ],
      },
      {
        heading: "The better market is not necessarily fully public",
        body: [
          "Not every private company should become a traditional public company. Some need controlled liquidity, investor education, and lighter reporting than a full exchange listing while still giving stakeholders a path to participate.",
          "Tokenized private-market rails can occupy that middle ground: more transparent than informal secondaries, more controlled than unrestricted speculation, and more accessible than late-stage allocation controlled only by institutions.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Tokenized Private Equity Primer",
        href: "/research/tokenized-private-equity-primer",
        description: "A primer on the operating layer required for tokenized private equity.",
      },
      {
        label: "Deals",
        href: "/private-equities/deals",
        description: "The capital raise and deal pipeline surface.",
      },
      {
        label: "Legal",
        href: "/private-equities/legal",
        description: "Eligibility, compliance, and legal boundary route.",
      },
    ],
  },
];

export function findPressArticle(slug: string) {
  return pressArticles.find((article) => article.slug === slug);
}
