import { canonicalDomain, products } from "@ultramar/product-model";
import type { MetadataRoute } from "next";

const staticRoutes = [
  "",
  "/private-equities/assets",
  "/private-equities/deals",
  "/private-equities/portfolio",
  "/private-equities/oracle",
  "/private-equities/market",
  "/private-equities/legal",
  "/arbitrage-hedge-fund/signals",
  "/arbitrage-hedge-fund/dashboard",
  "/arbitrage-hedge-fund/risk",
  "/arbitrage-hedge-fund/research",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [...products.map((product) => product.href), ...staticRoutes];

  return routes.map((route) => ({
    url: `${canonicalDomain}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
