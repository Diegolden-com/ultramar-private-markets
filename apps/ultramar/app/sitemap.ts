import { canonicalDomain } from "@ultramar/product-model";
import { deals } from "@/lib/deals";
import { researchArticles } from "@/lib/research";
import { staticSitemapRoutes, toSitemapRoute } from "@/lib/site-navigation";
import type { MetadataRoute } from "next";

const lastSignificantUpdate = new Date("2026-05-13T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const assetRoutes = deals.map((deal) => ({
    path: `/private-equities/assets/${deal.ticker}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const researchRoutes = researchArticles.map((article) => ({
    path: `/research/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  }));
  const routes = [...staticSitemapRoutes.map(toSitemapRoute), ...assetRoutes, ...researchRoutes];

  return routes.map((route) => ({
    url: `${canonicalDomain}${route.path}`,
    lastModified: lastSignificantUpdate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
