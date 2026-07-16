export type PressLinkTarget = {
  label: string;
  href: string;
  description: string;
};

export type PressArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  cluster: "Onchain instruments" | "Private-market access" | "AI compliance";
  publishedAt: string;
  updatedAt: string;
  image: string;
  keywords: string[];
  takeaways: string[];
  linkTargets: PressLinkTarget[];
};

export const pressArticles: PressArticle[] = [
  {
    "slug": "capital-windows-uniswap-v4-custom-accounting",
    "eyebrow": "Capital Windows design",
    "title": "Capital Windows: Gated company-token conversion with Uniswap v4 custom accounting",
    "description": "Ultramar Capital Windows use Uniswap v4 custom accounting as a gated final conversion step for approved primary capital calls and company-sponsored secondary liquidity windows.",
    "cluster": "Onchain instruments",
    "publishedAt": "2026-05-28",
    "updatedAt": "2026-05-28",
    "image": "/data-infrastructure.png",
    "keywords": [
      "Uniswap v4 custom accounting",
      "Uniswap v4 hooks",
      "custom accounting hook",
      "capital calls",
      "tokenized private equity",
      "permissioned liquidity",
      "RWA liquidity",
      "private company secondary liquidity",
      "company token conversion",
      "capital windows"
    ],
    "takeaways": [
      "The design treats a Uniswap v4 pool as the final conversion step for approved capital activity, not as an open public exchange.",
      "The hook uses `beforeSwapReturnDelta` custom accounting to replace generic AMM execution with a windowed step conversion curve.",
      "Primary conversion and secondary liquidity are both supported, but only through scheduled windows with signed authorization, investor caps, oracle freshness, and exact-input routing."
    ],
    "linkTargets": [
      {
        "label": "Open Private Equities",
        "href": "/private-equities",
        "description": "Ultramar Private Equities for gated private-market access."
      },
      {
        "label": "View company-token asset",
        "href": "/private-equities/assets/lcx",
        "description": "A company-token asset profile with context and capital terms."
      },
      {
        "label": "Review capital windows",
        "href": "/private-equities/deals",
        "description": "Issuer rounds and controlled capital-call style review."
      },
      {
        "label": "Open secondary context",
        "href": "/private-equities/market",
        "description": "Controlled transfer and secondary-liquidity context."
      },
      {
        "label": "Check eligibility gate",
        "href": "/private-equities/legal",
        "description": "Counsel review, eligibility, and access controls."
      },
      {
        "label": "Request access",
        "href": "/auth/sign-up",
        "description": "Request an account before gated investor review."
      }
    ]
  },
  {
    "slug": "why-capital-markets-need-onchain-instruments-now",
    "eyebrow": "Market structure position",
    "title": "Why capital markets need onchain instruments now",
    "description": "The case for onchain instruments is not speculation. It is a market-structure response to private-market opacity, slow settlement, high secondary fees, and unequal access.",
    "cluster": "Onchain instruments",
    "publishedAt": "2026-05-22",
    "updatedAt": "2026-05-22",
    "image": "/data-infrastructure.png",
    "keywords": [
      "onchain instruments",
      "onchain capital markets",
      "tokenized equity",
      "tokenized private equity",
      "real world assets",
      "RWA tokenization",
      "private market infrastructure"
    ],
    "takeaways": [
      "The strongest argument for onchain instruments is operational, not ideological: markets need a shared source of truth for ownership, eligibility, settlement, and transfer history.",
      "Private-market access cannot scale while liquidity, pricing confidence, and disclosure remain trapped in manual processes.",
      "AI-native compliance and onchain transfer controls can make private assets more legible without pretending every company is ready for a traditional public listing."
    ],
    "linkTargets": [
      {
        "label": "Private Equities",
        "href": "/private-equities",
        "description": "Ultramar Private Equities for tokenized private-market access."
      },
      {
        "label": "Issuer Oracle",
        "href": "/private-equities/oracle",
        "description": "The operating-data layer for issuer monitoring and solvency context."
      },
      {
        "label": "Legal Gate",
        "href": "/private-equities/legal",
        "description": "The eligibility and transfer-control boundary for private-market access."
      }
    ]
  },
  {
    "slug": "private-secondaries-need-transparent-rails",
    "eyebrow": "Secondary market analysis",
    "title": "Private secondaries need transparent rails, not more toll booths",
    "description": "Secondary markets for private shares remain expensive, manual, and low-confidence. Tokenized rails can compress the distance between seller intent, buyer eligibility, price discovery, and settlement.",
    "cluster": "Private-market access",
    "publishedAt": "2026-05-22",
    "updatedAt": "2026-05-22",
    "image": "/abstract-financial-growth-chart-geometric-shapes.jpg",
    "keywords": [
      "private secondary market",
      "secondary market fees",
      "tokenized private shares",
      "private company liquidity",
      "private market price discovery"
    ],
    "takeaways": [
      "High secondary fees are easier to charge when ownership records, transfer approvals, pricing, and settlement remain fragmented.",
      "Tokenized private shares can lower friction only when the token is connected to real legal rights and issuer-approved transfer rules.",
      "Transparent rails should increase price confidence before they increase trading speed."
    ],
    "linkTargets": [
      {
        "label": "Private Market",
        "href": "/private-equities/market",
        "description": "Private-market pricing and transfer context."
      },
      {
        "label": "Assets",
        "href": "/private-equities/assets",
        "description": "Asset discovery for private-market opportunities."
      },
      {
        "label": "Compliance",
        "href": "/compliance",
        "description": "Eligibility, diligence, and transfer boundaries."
      }
    ]
  },
  {
    "slug": "ai-compliance-is-the-disclosure-layer-for-tokenized-equity",
    "eyebrow": "AI compliance thesis",
    "title": "AI compliance is the disclosure layer tokenized equity is missing",
    "description": "Tokenized equity needs more than settlement rails. It needs continuous machine-readable disclosure that can detect anomalies, score issuer health, and explain risk to investors.",
    "cluster": "AI compliance",
    "publishedAt": "2026-05-22",
    "updatedAt": "2026-05-22",
    "image": "/tarot-oracle.png",
    "keywords": [
      "AI compliance",
      "AI disclosure",
      "tokenized equity compliance",
      "issuer oracle",
      "continuous compliance monitoring",
      "financial data oracle"
    ],
    "takeaways": [
      "AI compliance is most useful when it evaluates source data, flags anomalies, and explains score changes instead of producing unsupported opinions.",
      "The right comparison is not AI versus perfect oversight. It is AI-supported continuous review versus expensive periodic review that can miss problems for months.",
      "Model risk is real, so high-stakes compliance should benchmark multiple models, retain audit logs, and escalate edge cases to human review."
    ],
    "linkTargets": [
      {
        "label": "Oracle",
        "href": "/private-equities/oracle",
        "description": "Issuer accounting oracle and solvency proof."
      },
      {
        "label": "Issuer Oracle Research",
        "href": "/research/issuer-oracle-operating-data",
        "description": "A research memo on why operating data matters for private-market trust."
      },
      {
        "label": "Compliance",
        "href": "/compliance",
        "description": "Compliance operating boundaries for Ultramar.capital."
      }
    ]
  },
  {
    "slug": "retail-access-to-private-companies-should-not-wait-for-ipo",
    "eyebrow": "Access thesis",
    "title": "Retail access to private companies should not wait for the IPO",
    "description": "The public-private market boundary increasingly withholds growth from ordinary investors while allowing riskier forms of speculation elsewhere. Onchain instruments offer a more controlled access path.",
    "cluster": "Private-market access",
    "publishedAt": "2026-05-22",
    "updatedAt": "2026-05-22",
    "image": "/shipping-logistics.png",
    "keywords": [
      "retail private market access",
      "private company investing",
      "tokenized private companies",
      "private equity access",
      "Reg A tokenized equity",
      "onchain investor protection"
    ],
    "takeaways": [
      "Many companies now stay private long enough that public investors receive access after a large share of growth has already occurred.",
      "Retail access should be expanded through controlled structures: eligibility, limits, disclosures, lockups, and transfer rules.",
      "Onchain instruments make those controls easier to enforce consistently across investors, issuers, and secondary transfers."
    ],
    "linkTargets": [
      {
        "label": "Tokenized Private Equity Primer",
        "href": "/research/tokenized-private-equity-primer",
        "description": "A primer on the operating layer required for tokenized private equity."
      },
      {
        "label": "Deals",
        "href": "/private-equities/deals",
        "description": "Capital raises and issuer deal terms."
      },
      {
        "label": "Legal",
        "href": "/private-equities/legal",
        "description": "Eligibility, compliance, and legal boundaries."
      }
    ]
  }
];

export function findPressArticle(slug: string) {
  return pressArticles.find((article) => article.slug === slug);
}
