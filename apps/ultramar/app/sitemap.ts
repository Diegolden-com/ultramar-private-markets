import { canonicalDomain, products } from "@ultramar/product-model";
import { deals } from "@/lib/deals";
import type { MetadataRoute } from "next";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/private-equities/assets", changeFrequency: "weekly", priority: 0.85 },
  { path: "/private-equities/deals", changeFrequency: "weekly", priority: 0.8 },
  { path: "/private-equities/portfolio", changeFrequency: "monthly", priority: 0.55 },
  { path: "/private-equities/oracle", changeFrequency: "monthly", priority: 0.75 },
  { path: "/private-equities/market", changeFrequency: "weekly", priority: 0.75 },
  { path: "/private-equities/legal", changeFrequency: "yearly", priority: 0.45 },
  { path: "/arbitrage-hedge-fund/signals", changeFrequency: "daily", priority: 0.85 },
  { path: "/arbitrage-hedge-fund/dashboard", changeFrequency: "daily", priority: 0.75 },
  { path: "/arbitrage-hedge-fund/risk", changeFrequency: "monthly", priority: 0.75 },
  { path: "/arbitrage-hedge-fund/research", changeFrequency: "monthly", priority: 0.55 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const productRoutes = products.map((product) => ({
    path: product.href,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  const assetRoutes = deals.map((deal) => ({
    path: `/private-equities/assets/${deal.ticker}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const routes = [...staticRoutes, ...productRoutes, ...assetRoutes];

  return routes.map((route) => ({
    url: `${canonicalDomain}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
