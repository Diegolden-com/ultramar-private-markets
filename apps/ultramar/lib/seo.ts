import { canonicalDomain, platform, type ProductDefinition } from "@ultramar/product-model";
import type { Metadata } from "next";

export type SeoImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ItemListEntry = {
  name: string;
  url: string;
  description?: string;
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
  "tokenized private equity",
  "RWA investing",
  "private market investing",
  "issuer oracle",
  "Polymarket arbitrage",
  "prediction market arbitrage",
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
    alternateName: [
      "Ultramar",
      "Ultramar Capital",
      "Ultramar Private Equities",
      "Ultramar Arbitrage Hedge Fund",
    ],
    url: canonicalDomain,
    logo: absoluteUrl("/icon-512.jpg"),
    description: platform.description,
    knowsAbout: [
      "Private market investing",
      "Tokenized real-world assets",
      "Issuer operating data",
      "Polymarket arbitrage",
      "Prediction market signals",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalDomain}/#website`,
    name: platform.name,
    url: canonicalDomain,
    description: platform.description,
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

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function itemListJsonLd({
  path,
  name,
  description,
  items,
}: {
  path: string;
  name: string;
  description?: string;
  items: ItemListEntry[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#item-list`,
    name,
    description,
    url: absoluteUrl(path),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: item.name,
        url: absoluteUrl(item.url),
        ...(item.description ? { description: item.description } : {}),
      },
    })),
  };
}

export function articleJsonLd({
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  keywords = [],
}: {
  path: string;
  headline: string;
  description: string;
  image: SeoImage;
  datePublished: string;
  dateModified: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline,
    description,
    image: [absoluteUrl(image.url)],
    datePublished,
    dateModified,
    author: {
      "@id": `${canonicalDomain}/#organization`,
    },
    publisher: {
      "@id": `${canonicalDomain}/#organization`,
    },
    mainEntityOfPage: {
      "@id": `${absoluteUrl(path)}#webpage`,
    },
    keywords,
    inLanguage: "en",
  };
}
