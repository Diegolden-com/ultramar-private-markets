import { hasContactChannel } from "@/lib/contact";
import { getIndexableListings, getPublicListings } from "@/lib/listings";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const listings = getIndexableListings();
  const allPublicListings = getPublicListings();

  if (!hasContactChannel || listings.length === 0) return [];

  const homeIsIndexable = listings.length === allPublicListings.length;

  return [
    ...(homeIsIndexable
      ? [
          {
            url: absoluteUrl(),
            changeFrequency: "weekly" as const,
            priority: 1,
          },
        ]
      : []),
    ...listings.map((listing) => ({
      url: absoluteUrl(`/propiedades/${listing.slug}`),
      lastModified: listing.updatedAt ? new Date(listing.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
