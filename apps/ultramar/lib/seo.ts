import { canonicalDomain, platform, type ProductDefinition } from "@ultramar/product-model";
import type { Metadata } from "next";

export type SeoImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export const seoImages = {
  platform: {
    url: "/abstract-financial-growth-chart-geometric-shapes.jpg",
    width: 1200,
    height: 630,
    alt: "Ultramar.capital institutional platform",
  },
  privateEquities: {
    url: "/solarpunk-laundromat.png",
    width: 1200,
    height: 630,
    alt: "Ultramar Private Equities operating asset",
  },
  arbitrage: {
    url: "/abstract-financial-growth-chart-geometric-shapes.jpg",
    width: 1200,
    height: 630,
    alt: "Ultramar Arbitrage Hedge Fund signal infrastructure",
  },
} satisfies Record<string, SeoImage>;

export const defaultKeywords = [
  "Ultramar.capital",
  "private equities",
  "tokenized real world assets",
  "RWA investing",
  "Polymarket arbitrage",
  "arbitrage hedge fund",
  "private market platform",
];

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${canonicalDomain}${normalizedPath}`;
}

export function createSeoMetadata({
  title,
  description,
  path,
  keywords = [],
  image = seoImages.platform,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: SeoImage;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const brandedTitle = title.includes("Ultramar.capital")
    ? title
    : `${title} | Ultramar.capital`;

  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: brandedTitle,
      description,
      url,
      siteName: platform.name,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [image.url],
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${canonicalDomain}/#organization`,
    name: platform.name,
    url: canonicalDomain,
    logo: absoluteUrl("/icon-512.jpg"),
    description: platform.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalDomain}/#website`,
    name: platform.name,
    url: canonicalDomain,
    publisher: {
      "@id": `${canonicalDomain}/#organization`,
    },
    inLanguage: "en",
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: {
      "@id": `${canonicalDomain}/#website`,
    },
    about: {
      "@id": `${canonicalDomain}/#organization`,
    },
    inLanguage: "en",
  };
}

export function serviceJsonLd({
  product,
  serviceType,
}: {
  product: ProductDefinition;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(product.href)}#service`,
    name: `Ultramar ${product.name}`,
    serviceType,
    url: absoluteUrl(product.href),
    description: product.description,
    provider: {
      "@id": `${canonicalDomain}/#organization`,
    },
    audience: {
      "@type": "Audience",
      audienceType: product.audience,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
