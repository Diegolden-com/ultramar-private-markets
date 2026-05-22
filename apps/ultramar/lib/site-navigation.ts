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
      description: "Ultramar.capital platform overview.",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      key: "research",
      label: "Research",
      href: "/research",
      description: "Research library for private-market and arbitrage memos.",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...footerRouteItems.map((route) => ({
      ...route,
      description: `Ultramar.capital ${route.label.toLowerCase()} route.`,
    })),
  ],
} satisfies SiteRouteGroup;

export const productRouteGroups = {
  "private-equities": {
    title: "Private Equities",
    href: "/private-equities",
    description: "Tokenized private-market workflows, assets, deals, oracle, market, and portfolio routes.",
    links: [
      {
        key: "overview",
        label: "Overview",
        href: "/private-equities",
        description: "Private Equities product overview.",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        key: "assets",
        label: "Assets",
        href: "/private-equities/assets",
        description: "Private-market asset discovery and data-room entry point.",
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        key: "deals",
        label: "Deals",
        href: "/private-equities/deals",
        description: "Capital raise and deal pipeline surface.",
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        key: "oracle",
        label: "Oracle",
        href: "/private-equities/oracle",
        description: "Issuer operating-data oracle and solvency proof workflow.",
        changeFrequency: "monthly",
        priority: 0.75,
      },
      {
        key: "market",
        label: "Market",
        href: "/private-equities/market",
        description: "Private-market pricing and transfer context.",
        changeFrequency: "weekly",
        priority: 0.75,
      },
      {
        key: "legal",
        label: "Legal Gate",
        href: "/private-equities/legal",
        description: "Eligibility, compliance, and legal boundary route.",
        changeFrequency: "yearly",
        priority: 0.45,
      },
    ],
  },
  "arbitrage-hedge-fund": {
    title: "Arbitrage Hedge Fund",
    href: "/arbitrage-hedge-fund",
    description: "Polymarket-first arbitrage fund overview, dashboard, signals, risk, and research routes.",
    links: [
      {
        key: "overview",
        label: "Overview",
        href: "/arbitrage-hedge-fund",
        description: "Arbitrage Hedge Fund product overview.",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/arbitrage-hedge-fund/dashboard",
        description: "Allocator-facing signal and exposure dashboard.",
        changeFrequency: "daily",
        priority: 0.75,
      },
      {
        key: "signals",
        label: "Signals",
        href: "/arbitrage-hedge-fund/signals",
        description: "Live signal board for event-market probability dislocations.",
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
        description: "Research-only arbitrage strategy backlog.",
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
    description: "Research library for private-market and arbitrage memos.",
    links: [],
  },
] as const;

export const headerUtilityLinks = [
  {
    key: "terminal",
    label: "Terminal",
    href: "/private-equities/assets",
    description: "Open the private-market assets terminal.",
  },
  {
    key: "sign-in",
    label: "Sign in",
    href: "/auth/login",
    description: "Open the authentication flow.",
  },
] as const;

export type ProductRouteGroups = typeof productRouteGroups;
export type ProductTabKey<TProduct extends keyof ProductRouteGroups> =
  ProductRouteGroups[TProduct]["links"][number]["key"];
