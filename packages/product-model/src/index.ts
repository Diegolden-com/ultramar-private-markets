export type ProductSlug = "private-equities" | "arbitrage-hedge-fund";

export type ProductDefinition = {
  slug: ProductSlug;
  name: string;
  eyebrow: string;
  href: string;
  shortDescription: string;
  description: string;
  audience: string;
  problem: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

export const canonicalDomain = "https://ultramar.capital";

export const platform = {
  name: "Ultramar.capital",
  description:
    "A single capital platform for private-market access and Polymarket-first arbitrage fund infrastructure.",
};

export const products: ProductDefinition[] = [
  {
    slug: "private-equities",
    name: "Private Equities",
    eyebrow: "Private markets",
    href: "/private-equities",
    shortDescription: "Tokenized access to vetted private-market assets.",
    description:
      "Issuer onboarding, private-market deal discovery, compliance-aware investor flows, and portfolio visibility for tokenized real-world assets.",
    audience:
      "Investors and issuers who need a controlled private-market rail instead of a generic token marketplace.",
    problem:
      "Private investments are hard to diligence, track, transfer, and explain without a shared operating layer.",
    primaryCta: "Explore Assets",
    primaryHref: "/private-equities/assets",
    secondaryCta: "View Oracle",
    secondaryHref: "/private-equities/oracle",
  },
  {
    slug: "arbitrage-hedge-fund",
    name: "Arbitrage Hedge Fund",
    eyebrow: "Polymarket-first fund",
    href: "/arbitrage-hedge-fund",
    shortDescription: "Quantitative arbitrage focused on Polymarket dislocations.",
    description:
      "A fund product that compares prediction-market prices with derivatives-implied probabilities, then converts persistent spreads into monitored signals.",
    audience:
      "Allocators who want systematic event-market exposure with explicit signal, sizing, and risk controls.",
    problem:
      "Prediction-market mispricings are visible but hard to normalize, size, monitor, and govern as a fund workflow.",
    primaryCta: "Open Signals",
    primaryHref: "/arbitrage-hedge-fund/signals",
    secondaryCta: "Review Risk",
    secondaryHref: "/arbitrage-hedge-fund/risk",
  },
];

export const primaryNav = [
  { label: "Private Equities", href: "/private-equities" },
  { label: "Arbitrage Hedge Fund", href: "/arbitrage-hedge-fund" },
  { label: "Signals", href: "/arbitrage-hedge-fund/signals" },
  { label: "Assets", href: "/private-equities/assets" },
];

export const productBySlug = Object.fromEntries(
  products.map((product) => [product.slug, product]),
) as Record<ProductSlug, ProductDefinition>;
