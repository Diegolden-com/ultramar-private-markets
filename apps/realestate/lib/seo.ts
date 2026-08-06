import {
  getIndexableListings,
  getSearchEligibleMedia,
  type PublishedPropertyListing,
} from "@/lib/listings";
import { absoluteUrl, siteDescription, siteName } from "@/lib/site";
import type { Metadata } from "next";

type SocialImage = {
  alt: string;
  url: string;
  width?: number;
  height?: number;
};

function toAbsoluteUrl(url: string) {
  return url.startsWith("https://") ? url : absoluteUrl(url);
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: SocialImage;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const brandedTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const socialImage = image ?? {
    url: "/opengraph-image",
    alt: "Ultramar Real Estate — Casas y terrenos en venta en Morelos e Hidalgo",
    width: 1200,
    height: 630,
  };
  const socialImageUrl = toAbsoluteUrl(socialImage.url);

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
      locale: "es_MX",
      type: "website",
      images: [
        {
          url: socialImageUrl,
          alt: socialImage.alt,
          ...(socialImage.width && socialImage.height
            ? {
                width: socialImage.width,
                height: socialImage.height,
              }
            : {}),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [socialImageUrl],
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

function organizationJsonLd() {
  return {
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
  };
}

export function homeJsonLd() {
  const indexableListings = getIndexableListings();

  return [
    {
      "@context": "https://schema.org",
      ...organizationJsonLd(),
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
      name: `${siteName} | Casas y terrenos en venta`,
      description: siteDescription,
      inLanguage: "es-MX",
      isPartOf: {
        "@id": `${absoluteUrl()}#website`,
      },
      mainEntity: {
        "@id": `${absoluteUrl()}#inventory`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${absoluteUrl()}#inventory`,
      name: "Propiedades en venta de Ultramar Real Estate",
      numberOfItems: indexableListings.length,
      itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: indexableListings.map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: listing.name,
        url: absoluteUrl(`/propiedades/${listing.slug}`),
      })),
    },
  ];
}

function toPropertyValues(listing: PublishedPropertyListing) {
  return [
    { label: "Tipo de propiedad", value: listing.kind },
    listing.area ? { label: "Superficie", value: listing.area } : undefined,
    ...listing.facts,
  ]
    .filter((fact): fact is { label: string; value: string } => Boolean(fact))
    .map((fact) => ({
      "@type": "PropertyValue",
      name: fact.label,
      value: fact.value,
    }));
}

function primaryImageJsonLd(listing: PublishedPropertyListing) {
  const primaryImage = getSearchEligibleMedia(listing)[0];

  if (!primaryImage) return undefined;

  const imageUrl = absoluteUrl(primaryImage.src);

  return {
    "@type": "ImageObject",
    "@id": `${imageUrl}#image`,
    contentUrl: imageUrl,
    url: imageUrl,
    caption: primaryImage.caption ?? primaryImage.alt,
    description: primaryImage.alt,
    ...(primaryImage.width && primaryImage.height
      ? {
          width: primaryImage.width,
          height: primaryImage.height,
        }
      : {}),
  };
}

export function listingJsonLd(listing: PublishedPropertyListing) {
  const path = `/propiedades/${listing.slug}`;
  const url = absoluteUrl(path);
  const primaryImage = primaryImageJsonLd(listing);
  const propertyId = `${url}#property`;
  const offer = listing.price
    ? {
        "@type": "Offer",
        url,
        price: listing.price.amount,
        priceCurrency: listing.price.currency,
        availability: "https://schema.org/InStock",
        businessFunction: "https://purl.org/goodrelations/v1#Sell",
        itemOffered: {
          "@id": propertyId,
        },
        seller: {
          "@id": `${absoluteUrl()}#organization`,
        },
      }
    : undefined;

  const property = {
    "@type": "Place",
    "@id": propertyId,
    name: listing.name,
    description: listing.description,
    additionalProperty: toPropertyValues(listing),
    ...(primaryImage ? { image: primaryImage } : {}),
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "@id": `${url}#listing`,
      url,
      name: listing.name,
      headline: listing.headline,
      description: listing.description,
      inLanguage: "es-MX",
      dateModified: listing.updatedAt,
      lastReviewed: listing.updatedAt,
      isPartOf: {
        "@id": `${absoluteUrl()}#website`,
      },
      publisher: {
        "@id": `${absoluteUrl()}#organization`,
      },
      contentLocation: {
        "@type": "Place",
        name: listing.location,
      },
      mainEntity: property,
      ...(primaryImage ? { primaryImageOfPage: primaryImage } : {}),
      ...(offer ? { offers: offer } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Propiedades",
          item: absoluteUrl(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: listing.name,
          item: url,
        },
      ],
    },
  ];
}
