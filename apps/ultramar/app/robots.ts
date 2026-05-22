import { canonicalDomain } from "@ultramar/product-model";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const canonicalHost = canonicalDomain.replace("https://", "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${canonicalDomain}/sitemap.xml`,
    host: canonicalHost,
  };
}
