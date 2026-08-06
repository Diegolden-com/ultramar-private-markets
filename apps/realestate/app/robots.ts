import { hasContactChannel } from "@/lib/contact";
import { getIndexableListings } from "@/lib/listings";
import { siteDomain } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const canCrawlPublishedPages = hasContactChannel && getIndexableListings().length > 0;

  if (!canCrawlPublishedPages) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: "realestate.ultramar.capital",
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteDomain}/sitemap.xml`,
    host: "realestate.ultramar.capital",
  };
}
