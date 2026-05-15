export type ResearchLinkTarget = {
  label: string;
  href: string;
  description: string;
};

export type ResearchSection = {
  heading: string;
  body: string[];
};

export type ResearchArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  angle: string;
  cluster: "Private markets" | "Polymarket arbitrage";
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  image: string;
  keywords: string[];
  takeaways: string[];
  sections: ResearchSection[];
  linkTargets: ResearchLinkTarget[];
};

export const researchArticles: ResearchArticle[] = [
  {
    slug: "polymarket-arbitrage-explainer",
    eyebrow: "Market structure memo",
    title: "How prediction-market prices diverge from derivatives-implied probabilities",
    description:
      "A practical explainer for allocators and market-structure readers on why Polymarket prices can separate from derivatives-implied probability models.",
    audience: "Allocators and market-structure readers",
    angle: "How prediction-market prices diverge from derivatives-implied probabilities.",
    cluster: "Polymarket arbitrage",
    publishedAt: "2026-05-13",
    updatedAt: "2026-05-13",
    readingTime: "7 min read",
    image: "/tarot-market.png",
    keywords: [
      "Polymarket arbitrage",
      "prediction market arbitrage",
      "event-market mispricing",
      "derivatives-implied probability",
    ],
    takeaways: [
      "Prediction markets and derivatives markets can price the same macro event through different participant bases, constraints, and liquidity cycles.",
      "The spread is only useful when the comparison model is explicit, repeatable, and tied to risk controls.",
      "Ultramar treats Polymarket arbitrage as a monitored fund workflow, not a one-off trade idea.",
    ],
    sections: [
      {
        heading: "Why the spread exists",
        body: [
          "Prediction-market prices express what a venue's participants are willing to pay for event exposure. Derivatives-implied probabilities express what can be inferred from liquid instruments that react to the same underlying event. Those are related signals, but they are not the same market.",
          "Divergence can appear when Polymarket liquidity is thin, when resolution language is narrower than a macro narrative, when derivatives move faster than event-market order books, or when participants face different funding and custody constraints.",
        ],
      },
      {
        heading: "What makes the comparison investable",
        body: [
          "A spread is not automatically an arbitrage. The fund workflow has to normalize event definitions, data latency, liquidity, venue rules, hedge availability, and the probability model used to compare prices.",
          "That is why Ultramar routes users from the thesis into signals and risk. The signal board explains what the system is observing; the risk page explains how sizing, concentration, and model drift are controlled before allocation.",
        ],
      },
      {
        heading: "How Ultramar frames the product",
        body: [
          "The commercial product is Polymarket-first. Lending markets and derivatives-only strategies remain research context until they have enough data quality, risk language, and allocator-facing controls to graduate.",
          "That boundary matters for search and for investor communication: the page should rank for Polymarket arbitrage without implying that every adjacent strategy is already live capital infrastructure.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Arbitrage Hedge Fund",
        href: "/arbitrage-hedge-fund",
        description: "The main Polymarket-first fund product surface.",
      },
      {
        label: "Signals",
        href: "/arbitrage-hedge-fund/signals",
        description: "The signal board for observed probability dislocations.",
      },
      {
        label: "Risk",
        href: "/arbitrage-hedge-fund/risk",
        description: "Sizing, exposure, hedge, and model-drift controls.",
      },
    ],
  },
  {
    slug: "tokenized-private-equity-primer",
    eyebrow: "Private markets primer",
    title: "What has to exist before private equity can move on token rails",
    description:
      "A primer for RWA investors, issuers, and fintech operators on the operating layer needed before tokenized private equity can be useful.",
    audience: "RWA investors, issuers, fintech operators, and legal teams",
    angle: "What has to exist before private equity can move on token rails.",
    cluster: "Private markets",
    publishedAt: "2026-05-13",
    updatedAt: "2026-05-13",
    readingTime: "8 min read",
    image: "/tarot-law.png",
    keywords: [
      "tokenized private equity",
      "tokenized real-world assets",
      "RWA investing",
      "private-market asset marketplace",
    ],
    takeaways: [
      "The token is not the product; issuer onboarding, legal wrappers, eligibility, data, custody, and transfer controls are the product.",
      "A useful private-market interface separates primary issuer rounds from secondary transfer views.",
      "Ultramar Private Equities is framed as a controlled rail rather than an unrestricted public exchange.",
    ],
    sections: [
      {
        heading: "Tokenization is the last mile, not the first",
        body: [
          "Private equity does not become investable just because ownership can be represented by a token. The harder work is deciding what the asset is, which legal wrapper governs it, who is eligible to participate, what information the issuer must provide, and how transfers are restricted.",
          "That operating layer is why Ultramar presents Private Equities as a workflow: assets, deals, oracle data, market views, portfolio state, and legal boundaries all need to be legible together.",
        ],
      },
      {
        heading: "The market needs separate lanes",
        body: [
          "Primary rounds and secondary transfers are different jobs. Primary rounds need issuer context, minimum tickets, offering mechanics, and diligence. Secondary transfers need eligibility, lockups, issuer restrictions, and jurisdiction-specific compliance controls.",
          "Bundling those lanes into one generic marketplace creates ambiguity. Ultramar keeps assets, deals, market, portfolio, oracle, and legal pages separate so investors and issuers can understand which workflow they are entering.",
        ],
      },
      {
        heading: "What investors should expect to see",
        body: [
          "A serious tokenized private-equity rail should show asset narrative, valuation context, compliance status, operating data, transfer boundaries, and portfolio reporting. It should avoid unmanaged return promises and clearly state that production participation requires legal and eligibility checks.",
          "That is the search position for Ultramar Private Equities: tokenized private-market access with visible operating controls.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Private Equities",
        href: "/private-equities",
        description: "The product page for tokenized private-market workflows.",
      },
      {
        label: "Assets",
        href: "/private-equities/assets",
        description: "The marketplace surface for primary and secondary private-market assets.",
      },
      {
        label: "Legal",
        href: "/private-equities/legal",
        description: "The compliance and legal boundary page.",
      },
    ],
  },
  {
    slug: "issuer-oracle-operating-data",
    eyebrow: "Issuer oracle memo",
    title: "Why operating data matters more than token wrappers for private-market trust",
    description:
      "A memo for founders, CFOs, and RWA infrastructure teams on using issuer operating data to make tokenized private markets more understandable.",
    audience: "Founders, CFOs, and RWA infrastructure teams",
    angle: "Why operating data matters more than token wrappers for private-market trust.",
    cluster: "Private markets",
    publishedAt: "2026-05-13",
    updatedAt: "2026-05-13",
    readingTime: "6 min read",
    image: "/tarot-oracle.png",
    keywords: [
      "issuer oracle",
      "RWA transparency",
      "solvency proof",
      "private-market trust",
    ],
    takeaways: [
      "Private-market investors need a repeatable way to inspect issuer state after the initial offering.",
      "An issuer oracle should compress accounting and operating data into signals that investors can understand without exposing every internal detail.",
      "Oracle-backed context makes asset pages and portfolio views more credible than token metadata alone.",
    ],
    sections: [
      {
        heading: "The trust problem after the token is minted",
        body: [
          "Token wrappers can describe ownership mechanics, but they do not tell investors whether an issuer is still operating well. Private-market trust depends on updates: revenue quality, liabilities, cash movement, liquidity, and solvency signals.",
          "Without a data bridge, investors are left with static offering documents and fragmented communication. That weakens the case for tokenized private markets because the asset may move on-chain while issuer information remains opaque.",
        ],
      },
      {
        heading: "What an issuer oracle should do",
        body: [
          "The oracle should not dump raw accounting systems into the market. It should transform operating data into signed, interpretable signals: solvency context, liquidity state, data recency, and confidence boundaries.",
          "For issuers, that creates a repeatable disclosure workflow. For investors, it creates a cleaner diligence surface. For the platform, it makes asset discovery, market eligibility, and portfolio reporting more coherent.",
        ],
      },
      {
        heading: "How Ultramar uses the idea",
        body: [
          "Ultramar connects the oracle concept to asset pages and portfolio state. A listed company like Lavanderias CX should not be evaluated only by ticker and image; it should have an operating-data path that can mature into investor-facing proof.",
          "That is why the issuer oracle is a ranking asset and a product asset: it gives RWA readers a concrete reason to understand Ultramar beyond the tokenization narrative.",
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
        label: "Lavanderias CX",
        href: "/private-equities/assets/lcx",
        description: "A representative private-market operating asset.",
      },
      {
        label: "Legal",
        href: "/private-equities/legal",
        description: "Compliance boundaries around private-market access.",
      },
    ],
  },
  {
    slug: "event-market-risk-controls",
    eyebrow: "Risk controls memo",
    title: "Sizing, liquidity, and model-drift controls for event-market arbitrage",
    description:
      "A memo for LPs, allocators, and crypto fund analysts on the controls required before event-market arbitrage can be treated as fund infrastructure.",
    audience: "LPs, allocators, and crypto fund analysts",
    angle: "Sizing, liquidity, and model-drift controls for event-market arbitrage.",
    cluster: "Polymarket arbitrage",
    publishedAt: "2026-05-13",
    updatedAt: "2026-05-13",
    readingTime: "7 min read",
    image: "/tarot-law.png",
    keywords: [
      "event-market arbitrage risk",
      "Polymarket risk controls",
      "arbitrage sizing",
      "crypto fund risk",
    ],
    takeaways: [
      "The investable object is not just the spread; it is the spread plus sizing, liquidity, resolution, and model-drift controls.",
      "Allocator-facing dashboards should connect active signals to exposure and guardrails.",
      "Research strategies should remain research until their controls are ready for investor review.",
    ],
    sections: [
      {
        heading: "Why controls need to be visible",
        body: [
          "Event-market arbitrage can look simple when reduced to a spread. In practice, the spread is only one input. Venue liquidity, event resolution rules, timing, hedge quality, and model drift can dominate the outcome.",
          "That is why Ultramar surfaces risk next to the signal workflow. Allocators need to see how the system thinks about exposure before they can evaluate the opportunity.",
        ],
      },
      {
        heading: "Core controls",
        body: [
          "Sizing should be capped by confidence, liquidity, drawdown tolerance, and concentration. Exposure monitoring should separate open notional, stale signals, realized PnL, and venue-specific risk. Hedge discipline should define where derivatives inform probabilities versus where they become active hedges.",
          "The dashboard exists to make these controls inspectable. The risk page exists to explain the policy behind the dashboard.",
        ],
      },
      {
        heading: "The graduation rule",
        body: [
          "Adjacent strategies can be valuable research without being marketable products. A strategy should graduate only after data quality, risk limits, and allocator language are complete.",
          "That boundary protects the brand and the investor: Ultramar can publish research while keeping the live product focused on Polymarket-first arbitrage.",
        ],
      },
    ],
    linkTargets: [
      {
        label: "Risk",
        href: "/arbitrage-hedge-fund/risk",
        description: "The risk-control page for the fund product.",
      },
      {
        label: "Dashboard",
        href: "/arbitrage-hedge-fund/dashboard",
        description: "Allocator-facing signal and exposure dashboard.",
      },
      {
        label: "Research",
        href: "/arbitrage-hedge-fund/research",
        description: "Research-only strategy backlog.",
      },
    ],
  },
];

export function findResearchArticle(slug: string) {
  return researchArticles.find((article) => article.slug === slug);
}
