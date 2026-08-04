export type ResearchLinkTarget = {
  label: string;
  href: string;
  description: string;
};

export type ResearchArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  cluster: "Private markets" | "Polymarket arbitrage";
  publishedAt: string;
  updatedAt: string;
  image: string;
  keywords: string[];
  takeaways: string[];
  linkTargets: ResearchLinkTarget[];
};

export const researchArticles: ResearchArticle[] = [
  {
    "slug": "polymarket-arbitrage-explainer",
    "eyebrow": "Market structure memo",
    "title": "How prediction-market prices diverge from derivatives-implied probabilities",
    "description": "A practical explainer for allocators and market-structure readers on why Polymarket prices can separate from derivatives-implied probability models.",
    "cluster": "Polymarket arbitrage",
    "publishedAt": "2026-05-13",
    "updatedAt": "2026-05-13",
    "image": "/tarot-market.png",
    "keywords": [
      "Polymarket arbitrage",
      "prediction market arbitrage",
      "event-market mispricing",
      "derivatives-implied probability"
    ],
    "takeaways": [
      "Prediction markets and derivatives markets can price the same macro event through different participant bases, constraints, and liquidity cycles.",
      "The spread is only useful when the comparison model is explicit, repeatable, and tied to risk controls.",
      "Ultramar treats Polymarket arbitrage as monitored fund discipline, not a one-off trade idea."
    ],
    "linkTargets": [
      {
        "label": "Arbitrage Hedge Fund",
        "href": "/arbitrage-hedge-fund",
        "description": "The main Polymarket-first fund product."
      },
      {
        "label": "Signals",
        "href": "/arbitrage-hedge-fund/signals",
        "description": "The signal board for observed probability dislocations."
      },
      {
        "label": "Risk",
        "href": "/arbitrage-hedge-fund/risk",
        "description": "Sizing, exposure, hedge, and model-drift controls."
      }
    ]
  },
  {
    "slug": "tokenized-private-equity-primer",
    "eyebrow": "Private markets primer",
    "title": "What has to exist before private equity can move on token rails",
    "description": "A primer for RWA investors, issuers, and fintech operators on the operating layer needed before tokenized private equity can be useful.",
    "cluster": "Private markets",
    "publishedAt": "2026-05-13",
    "updatedAt": "2026-05-13",
    "image": "/tarot-law.png",
    "keywords": [
      "tokenized private equity",
      "tokenized real-world assets",
      "RWA investing",
      "private-market asset marketplace"
    ],
    "takeaways": [
      "The token is not the product; issuer onboarding, legal wrappers, eligibility, data, custody, and transfer controls are the product.",
      "A useful private-market product separates primary issuer rounds from secondary transfer views.",
      "Ultramar Private Equities is framed as a controlled rail rather than an unrestricted public exchange."
    ],
    "linkTargets": [
      {
        "label": "Private Equities",
        "href": "/private-equities",
        "description": "The product for controlled tokenized private-market access."
      },
      {
        "label": "Assets",
        "href": "/private-equities/assets",
        "description": "Primary and secondary private-market assets."
      },
      {
        "label": "Legal",
        "href": "/private-equities/legal",
        "description": "Compliance and legal boundaries for private-market access."
      }
    ]
  },
  {
    "slug": "issuer-oracle-operating-data",
    "eyebrow": "Issuer oracle memo",
    "title": "Why operating data matters more than token wrappers for private-market trust",
    "description": "A memo for founders, CFOs, and RWA infrastructure teams on using issuer operating data to make tokenized private markets more understandable.",
    "cluster": "Private markets",
    "publishedAt": "2026-05-13",
    "updatedAt": "2026-05-13",
    "image": "/tarot-oracle.png",
    "keywords": [
      "issuer oracle",
      "RWA transparency",
      "solvency proof",
      "private-market trust"
    ],
    "takeaways": [
      "Private-market investors need a repeatable way to inspect issuer state after the initial offering.",
      "An issuer oracle should compress accounting and operating data into signals that investors can understand without exposing every internal detail.",
      "Oracle-backed context makes asset profiles and portfolio views more credible than token metadata alone."
    ],
    "linkTargets": [
      {
        "label": "Oracle",
        "href": "/private-equities/oracle",
        "description": "Issuer accounting oracle and solvency proof."
      },
      {
        "label": "Lavanderias CX",
        "href": "/private-equities/assets/lcx",
        "description": "A controlled review of a potential secondary transfer; not a live offer."
      },
      {
        "label": "Legal",
        "href": "/private-equities/legal",
        "description": "Compliance boundaries around private-market access."
      }
    ]
  },
  {
    "slug": "event-market-risk-controls",
    "eyebrow": "Risk controls memo",
    "title": "Sizing, liquidity, and model-drift controls for event-market arbitrage",
    "description": "A memo for LPs, allocators, and crypto fund analysts on the controls required before event-market arbitrage can be treated as fund infrastructure.",
    "cluster": "Polymarket arbitrage",
    "publishedAt": "2026-05-13",
    "updatedAt": "2026-05-13",
    "image": "/tarot-law.png",
    "keywords": [
      "event-market arbitrage risk",
      "Polymarket risk controls",
      "arbitrage sizing",
      "crypto fund risk"
    ],
    "takeaways": [
      "The investable object is not just the spread; it is the spread plus sizing, liquidity, resolution, and model-drift controls.",
      "Allocator-facing dashboards should connect active signals to exposure and guardrails.",
      "Research strategies should remain research until their controls are ready for investor review."
    ],
    "linkTargets": [
      {
        "label": "Risk",
        "href": "/arbitrage-hedge-fund/risk",
        "description": "Risk controls for the fund product."
      },
      {
        "label": "Dashboard",
        "href": "/arbitrage-hedge-fund/dashboard",
        "description": "Allocator signal and exposure dashboard."
      },
      {
        "label": "Research",
        "href": "/arbitrage-hedge-fund/research",
        "description": "Strategy ideas kept under research review."
      }
    ]
  }
];

export function findResearchArticle(slug: string) {
  return researchArticles.find((article) => article.slug === slug);
}
