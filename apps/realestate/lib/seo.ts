import { absoluteUrl, siteDescription, siteName } from "@/lib/site";
import type { PublishedPropertyListing } from "@/lib/listings";
import type { Metadata } from "next";

export function createPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const brandedTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: brandedTitle,
      description,
      url,
      siteName,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Ultramar Real Estate — Atlas de propiedades",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: ["/opengraph-image"],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${absoluteUrl()}#organization`,
      name: siteName,
      url: absoluteUrl(),
      parentOrganization: {
        "@type": "Organization",
        name: "Ultramar.capital",
        url: "https://ultramar.capital",
      },
      description: siteDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${absoluteUrl()}#website`,
      name: siteName,
      url: absoluteUrl(),
      description: siteDescription,
      inLanguage: "es-MX",
      publisher: {
        "@id": `${absoluteUrl()}#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl()}#webpage`,
      url: absoluteUrl(),
      name: siteName,
      description: siteDescription,
      inLanguage: "es-MX",
      isPartOf: {
        "@id": `${absoluteUrl()}#website`,
      },
    },
  ];
}

export function listingJsonLd(listing: PublishedPropertyListing) {
  const path = `/propiedades/${listing.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: listing.name,
    description: listing.headline,
    inLanguage: "es-MX",
    isPartOf: {
      "@id": `${absoluteUrl()}#website`,
    },
  };
}
