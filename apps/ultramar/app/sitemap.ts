import { canonicalDomain } from "@ultramar/product-model";
import { indexableSitemapRoutes, lastSignificantUpdate } from "@/lib/discoverability";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableSitemapRoutes.map((route) => ({
    url: `${canonicalDomain}${route.path}`,
    lastModified: lastSignificantUpdate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
