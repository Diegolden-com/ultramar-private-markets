import { footerRouteItems } from "@/lib/footer-routes";
import { products, type ProductSlug } from "@ultramar/product-model";
import type { MetadataRoute } from "next";

export type SitemapFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

export type SiteNavLink = {
  key: string;
  label: string;
  href: string;
  description?: string;
  changeFrequency: SitemapFrequency;
  priority: number;
};

export type SiteRouteGroup = {
  title: string;
  links: SiteNavLink[];
};

type ProductRouteGroup = {
  title: string;
  href: string;
  description: string;
  links: SiteNavLink[];
};

export const platformRouteGroup = {
  title: "Platform",
  links: [
    {
      key: "home",
      label: "Home",
      href: "/",
      description: "Overview of Ultramar's private-market and event-market products.",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      key: "research",
      label: "Research",
      href: "/research",
      description: "Research memos on private markets, issuer data, and event-market arbitrage.",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      key: "press",
      label: "Press",
      href: "/press",
      description: "Articles on onchain instruments, tokenized private markets, and AI compliance.",
      changeFrequency: "weekly",
      priority: 0.82,
    },
    ...footerRouteItems.map((route) => ({
      ...route,
      description: `${route.label} information for Ultramar investors, issuers, and reviewers.`,
    })),
  ],
} satisfies SiteRouteGroup;

export const productRouteGroups = {
  "private-equities": {
    title: "Private Equities",
    href: "/private-equities",
    description: "Controlled private-market access across assets, issuer rounds, operating data, transfers, and portfolios.",
    links: [
      {
        key: "overview",
        label: "Overview",
        href: "/private-equities",
        description: "How Ultramar Private Equities organizes issuer access and investor review.",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        key: "assets",
        label: "Assets",
        href: "/private-equities/assets",
        description: "Browse private-market assets with valuation, eligibility, and diligence context.",
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        key: "deals",
        label: "Deals",
        href: "/private-equities/deals",
        description: "Review issuer rounds, target raises, instruments, and closing readiness.",
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        key: "oracle",
        label: "Oracle",
        href: "/private-equities/oracle",
        description: "Connect issuer operating data to solvency, liquidity, and recency signals.",
        changeFrequency: "monthly",
        priority: 0.75,
      },
      {
        key: "market",
        label: "Market",
        href: "/private-equities/market",
        description: "Inspect eligible secondary-transfer context without treating access as open exchange trading.",
        changeFrequency: "weekly",
        priority: 0.75,
      },
      {
        key: "portfolio",
        label: "Portfolio",
        href: "/private-equities/portfolio",
        description: "Track private-market holdings, value, and performance snapshots.",
        changeFrequency: "monthly",
        priority: 0.35,
      },
      {
        key: "legal",
        label: "Legal Gate",
        href: "/private-equities/legal",
        description: "Eligibility, counsel review, and transfer-control requirements.",
        changeFrequency: "yearly",
        priority: 0.45,
      },
    ],
  },
  "arbitrage-hedge-fund": {
    title: "Arbitrage Hedge Fund",
    href: "/arbitrage-hedge-fund",
    description: "Polymarket-first arbitrage with monitored signals, exposure, risk controls, and research discipline.",
    links: [
      {
        key: "overview",
        label: "Overview",
        href: "/arbitrage-hedge-fund",
        description: "How the fund evaluates event-market dislocations before sizing.",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/arbitrage-hedge-fund/dashboard",
        description: "Review signal health, notional exposure, and guardrail status together.",
        changeFrequency: "daily",
        priority: 0.75,
      },
      {
        key: "signals",
        label: "Signals",
        href: "/arbitrage-hedge-fund/signals",
        description: "Monitor Polymarket probability dislocations with confidence and timing context.",
        changeFrequency: "daily",
        priority: 0.85,
      },
      {
        key: "risk",
        label: "Risk",
        href: "/arbitrage-hedge-fund/risk",
        description: "Sizing, exposure, hedge, and model-drift controls.",
        changeFrequency: "monthly",
        priority: 0.75,
      },
      {
        key: "research",
        label: "Research",
        href: "/arbitrage-hedge-fund/research",
        description: "Strategy ideas that remain under review until controls are complete.",
        changeFrequency: "monthly",
        priority: 0.55,
      },
    ],
  },
} satisfies Record<ProductSlug, ProductRouteGroup>;

export const productOverviewRouteGroup = {
  title: "Products",
  links: products.map((product) => ({
    key: product.slug,
    label: product.name,
    href: product.href,
    description: product.shortDescription,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
} satisfies SiteRouteGroup;

export const headerNavItems = [
  {
    key: "private-equities",
    label: "Private Equities",
    href: productRouteGroups["private-equities"].href,
    description: productRouteGroups["private-equities"].description,
    links: productRouteGroups["private-equities"].links,
  },
  {
    key: "arbitrage-hedge-fund",
    label: "Arbitrage Hedge Fund",
    href: productRouteGroups["arbitrage-hedge-fund"].href,
    description: productRouteGroups["arbitrage-hedge-fund"].description,
    links: productRouteGroups["arbitrage-hedge-fund"].links,
  },
  {
    key: "research",
    label: "Research",
    href: "/research",
    description: "Research memos on private markets, issuer data, and event-market arbitrage.",
    links: [],
  },
  {
    key: "press",
    label: "Press",
    href: "/press",
    description: "Articles on onchain instruments and private-market access.",
    links: [],
  },
] as const;

export const headerUtilityLinks = [
  {
    key: "terminal",
    label: "Assets",
    href: "/private-equities/assets",
    description: "Browse controlled private-market assets.",
  },
  {
    key: "sign-in",
    label: "Sign in",
    href: "/auth/login",
    description: "Access an approved Ultramar account.",
  },
] as const;

export type ProductRouteGroups = typeof productRouteGroups;
export type ProductTabKey<TProduct extends keyof ProductRouteGroups> =
  ProductRouteGroups[TProduct]["links"][number]["key"];
