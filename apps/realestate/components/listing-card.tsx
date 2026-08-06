import { TopographicField } from "@/components/topographic-field";
import {
  getApprovedMedia,
  getMediaKindLabel,
  type ListingFact,
  type PublicPropertyListing,
} from "@/lib/listings";
import Image from "next/image";
import Link from "next/link";

const visualVariant: Record<PublicPropertyListing["id"], number> = {
  "property-one": 0,
  "property-two": 1,
  "property-three": 2,
};

export function ListingCard({ listing }: { listing: PublicPropertyListing }) {
  const publishedListing = listing.state === "published" ? listing : undefined;
  const primaryImage = publishedListing ? getApprovedMedia(publishedListing)[0] : undefined;
  const facts = publishedListing ? getCardFacts(publishedListing) : [];

  return (
    <article className={`listing-card${primaryImage ? " listing-card--with-media" : ""}`}>
      <div className="listing-card__visual">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.src}
              alt={primaryImage.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="media-kind-label listing-card__media-kind">
              {primaryImage.kind === "reference"
                ? "Fotos del avalúo, 2024 · pide fotos y video actuales"
                : getMediaKindLabel(primaryImage.kind)}
            </span>
          </>
        ) : (
          <>
            <TopographicField variant={visualVariant[listing.id]} />
            <p className="listing-card__image-state">
              {publishedListing ? "Imagen en preparación" : "Ficha inicial · imagen pendiente"}
            </p>
          </>
        )}
        <span className="listing-card__state">
          {publishedListing ? publishedListing.availability : "Ficha inicial"}
        </span>
        {publishedListing?.price ? (
          <span className="listing-card__price">{publishedListing.price.display}</span>
        ) : null}
      </div>
      <div className="listing-card__body">
        <p className="eyebrow">
          {listing.kind} · {listing.location}
        </p>
        <h3>{listing.name}</h3>
        <p className="listing-card__headline">{listing.headline}</p>
        {facts.length > 0 ? (
          <dl className="listing-card__facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <Link className="text-link" href={`/propiedades/${listing.slug}`}>
          {listing.state === "published" ? "Ver ficha y disponibilidad" : "Ver información inicial"}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

function getCardFacts(listing: Exclude<PublicPropertyListing, { state: "teaser" }>) {
  const labels = listing.id === "property-one" ? ["Construcción", "Distribución"] : ["Entorno", "Superficie"];

  return labels
    .map((label) => listing.facts.find((fact) => fact.label === label))
    .filter((fact): fact is ListingFact => Boolean(fact))
    .map((fact) => [fact.label, fact.value] as [string, string]);
}
