export type ListingState = "draft" | "teaser" | "published";

export type ListingFact = {
  label: string;
  value: string;
};

export type ListingPrice = {
  /** Numeric value is kept separately so the public price can be used accurately in structured data. */
  amount: number;
  currency: "MXN";
  display: string;
};

export type ListingMediaKind = "photograph" | "environment" | "concept";

/**
 * Public images must be reviewed derivatives placed under `public/media`.
 * Do not reference originals, cloud-drive links, or map tiles here.
 */
export type ListingMedia = {
  src: `/media/${string}`;
  alt: string;
  /** Makes the status of every visual explicit instead of implying a conceptual rendering is real. */
  kind: ListingMediaKind;
  /** Native dimensions keep Open Graph and structured data aligned with the delivered asset. */
  width?: number;
  height?: number;
  caption?: string;
};

export type PublicMap = {
  href: `https://${string}`;
  label: string;
  /** Explicitly records whether the owner approved an exact or general location. */
  precision: "general" | "exact";
};

export type ListingDocument = {
  label: string;
  /** Use a reviewed public file or a canonical HTTPS URL without a token/query string. */
  href: `/documents/${string}` | `https://${string}`;
};

type ListingId = "property-one" | "property-two" | "property-three";

type ListingIdentity = {
  id: ListingId;
  slug: string;
};

type ListingPublicCopy = ListingIdentity & {
  kind: string;
  name: string;
  location: string;
  headline: string;
};

export type DraftPropertyListing = ListingIdentity & {
  state: "draft";
};

/** A teaser deliberately contains only the four fields approved for public discovery. */
export type TeaserPropertyListing = ListingPublicCopy & {
  state: "teaser";
};

/** A published listing has a reviewed, substantive property record. */
export type PublishedPropertyListing = ListingPublicCopy & {
  state: "published";
  description: string;
  availability: string;
  updatedAt: string;
  facts: readonly [ListingFact, ...ListingFact[]];
  area?: string;
  price?: ListingPrice;
  media?: readonly ListingMedia[];
  publicMap?: PublicMap;
  documents?: readonly ListingDocument[];
};

export type PropertyListing = DraftPropertyListing | TeaserPropertyListing | PublishedPropertyListing;
export type PublicPropertyListing = TeaserPropertyListing | PublishedPropertyListing;

/*
 * Source of truth for the three properties. A draft has no public fields. A teaser
 * can expose only its title, general location, and headline. Use `published` only
 * once the commercial record, review date, and contact channel are ready.
 */
export const listings: readonly [PropertyListing, PropertyListing, PropertyListing] = [
  {
    id: "property-one",
    slug: "casa-condominio-morelos",
    state: "published",
    kind: "Casa en condominio",
    name: "Casa residencial en condominio",
    location: "Yautepec, Morelos",
    headline: "Remodelada recientemente: tres niveles, dos recámaras, terraza y roof garden con jacuzzi cubierto.",
    description:
      "Una casa en condominio horizontal recientemente remodelada para convertir las escapadas en una rutina. Sus 121.45 m² de construcción se distribuyen en tres niveles, con estancia-comedor, cocina, dos recámaras, terraza, roof garden y jacuzzi cubierto. Incluye dos espacios de estacionamiento y acceso a alberca, palapa y áreas verdes de uso común.",
    availability: "En venta",
    updatedAt: "2026-08-06",
    area: "101.08 m² de terreno",
    price: {
      amount: 2_000_000,
      currency: "MXN",
      display: "$2,000,000 MXN",
    },
    facts: [
      { label: "Construcción", value: "121.45 m²" },
      { label: "Distribución", value: "3 niveles · 2 recámaras" },
      { label: "Baños", value: "2 completos + medio baño" },
      { label: "Complementos", value: "Roof garden · terraza · jacuzzi cubierto" },
      { label: "Estacionamiento", value: "2 espacios" },
      { label: "Áreas comunes", value: "Alberca, palapa y áreas verdes" },
    ],
  },
  {
    id: "property-two",
    slug: "terreno-rustico-omitlan",
    state: "published",
    kind: "Terreno rústico",
    name: "Terreno rústico en Omitlán",
    location: "Omitlán de Juárez, Hidalgo",
    headline: "Terreno rústico arbolado para imaginar una escapada en contacto con la naturaleza.",
    description:
      "Terreno rústico arbolado ofrecido en venta directa en Omitlán de Juárez, Hidalgo. Es un punto de partida para explorar una escapada, una experiencia de glamping o una cabaña de descanso en contacto con la naturaleza. La superficie y cualquier viabilidad de acceso, servicios, uso de suelo, permisos, impacto ambiental o construcción requieren revisión documental y técnica antes de definir un proyecto.",
    availability: "En venta",
    updatedAt: "2026-08-06",
    price: {
      amount: 500_000,
      currency: "MXN",
      display: "$500,000 MXN",
    },
    facts: [
      { label: "Tipo de propiedad", value: "Terreno rústico" },
      { label: "Entorno", value: "Zona arbolada" },
      { label: "Superficie", value: "Por confirmar" },
    ],
  },
  {
    id: "property-three",
    slug: "propiedad-tres",
    state: "draft",
  },
];

function hasPublicCopy(listing: PropertyListing): listing is PublicPropertyListing {
  return listing.state !== "draft";
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function hasValidReviewDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function assertInventoryInvariant(inventory: readonly PropertyListing[]) {
  const ids = new Set(inventory.map((listing) => listing.id));
  const slugs = new Set(inventory.map((listing) => listing.slug));

  if (inventory.length !== 3 || ids.size !== 3 || slugs.size !== 3) {
    throw new Error("Ultramar Real Estate must contain exactly three uniquely identified listings.");
  }
}

export function getPublicListings(): PublicPropertyListing[] {
  return listings.filter(hasPublicCopy);
}

export function getPublicListingBySlug(slug: string) {
  return getPublicListings().find((listing) => listing.slug === slug);
}

/**
 * Indexable inventory has a real, dated commercial record. This is separate from
 * `published` at the type level so a blank or invalid record never reaches the
 * sitemap by accident.
 */
export function isIndexableListing(listing: PublicPropertyListing): listing is PublishedPropertyListing {
  return (
    listing.state === "published" &&
    hasText(listing.description) &&
    hasText(listing.availability) &&
    listing.facts.some((fact) => hasText(fact.label) && hasText(fact.value)) &&
    hasValidReviewDate(listing.updatedAt)
  );
}

function assertPublicationInvariant(inventory: readonly PropertyListing[]) {
  for (const listing of inventory) {
    if (
      listing.state === "teaser" &&
      (!hasText(listing.kind) ||
        !hasText(listing.name) ||
        !hasText(listing.location) ||
        !hasText(listing.headline))
    ) {
      throw new Error(`Teaser ${listing.id} requires a kind, name, public location, and headline.`);
    }

    if (listing.state === "published") {
      const listingId = listing.id;
      if (!isIndexableListing(listing)) {
        throw new Error(
          `Published listing ${listingId} requires reviewed copy, availability, a valid updatedAt date, and a verified fact.`,
        );
      }
    }
  }
}

assertInventoryInvariant(listings);
assertPublicationInvariant(listings);

export function getIndexableListings(): PublishedPropertyListing[] {
  return getPublicListings().filter(isIndexableListing);
}

function isSafeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isSafePublicAssetPath(value: string, directory: "/media/" | "/documents/") {
  return value.startsWith(directory) && !value.includes("..") && !/[?#]/.test(value);
}

/** Filters out anything other than explicitly reviewed public image derivatives. */
export function getApprovedMedia(listing: PublishedPropertyListing) {
  return (listing.media ?? []).filter(
    (media) =>
      isSafePublicAssetPath(media.src, "/media/") &&
      hasText(media.alt) &&
      ["photograph", "environment", "concept"].includes(media.kind) &&
      (media.width === undefined || (Number.isFinite(media.width) && media.width > 0)) &&
      (media.height === undefined || (Number.isFinite(media.height) && media.height > 0)),
  );
}

/**
 * Renders may appear in the on-page gallery with their disclosure, but cannot
 * become an unlabeled preview in search, social cards, structured data, or a sitemap.
 */
export function getSearchEligibleMedia(listing: PublishedPropertyListing) {
  return getApprovedMedia(listing).filter((media) => media.kind !== "concept");
}

export function getMediaKindLabel(kind: ListingMediaKind) {
  switch (kind) {
    case "photograph":
      return "Fotografía actual";
    case "environment":
      return "Entorno";
    case "concept":
      return "Visualización conceptual";
  }
}

export function getMediaDisclosure(media: ListingMedia) {
  if (media.kind !== "concept") return undefined;

  return "No representa una construcción existente. Sujeta a factibilidad, permisos, uso de suelo y proyecto.";
}

export function getApprovedPublicMap(listing: PublishedPropertyListing) {
  const map = listing.publicMap;
  return map && hasText(map.label) && isSafeHttpsUrl(map.href) ? map : undefined;
}

/**
 * Documents may be served from this app or a canonical HTTPS host. Query strings
 * are intentionally rejected so signed/temporary links cannot be published by
 * accident.
 */
export function getApprovedDocuments(listing: PublishedPropertyListing) {
  return (listing.documents ?? []).filter((document) => {
    if (!hasText(document.label)) return false;

    if (document.href.startsWith("/")) {
      return isSafePublicAssetPath(document.href, "/documents/");
    }

    if (!isSafeHttpsUrl(document.href)) return false;

    const url = new URL(document.href);
    return !url.search && !url.hash;
  });
}

export const totalInventoryCount = listings.length;
