import { BrandName } from "@/components/brand-name";
import { ContactLink } from "@/components/contact-link";
import { JsonLd } from "@/components/json-ld";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopographicField } from "@/components/topographic-field";
import { hasContactChannel } from "@/lib/contact";
import {
  getApprovedDocuments,
  getApprovedMedia,
  getMediaDisclosure,
  getMediaKindLabel,
  getApprovedPublicMap,
  getPublicListingBySlug,
  getPublicListings,
  getSearchEligibleMedia,
  isIndexableListing,
} from "@/lib/listings";
import { createPageMetadata, listingJsonLd } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  if (!hasContactChannel) return [];

  return getPublicListings().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = hasContactChannel ? getPublicListingBySlug(slug) : undefined;

  if (!listing) {
    return createPageMetadata({
      title: "Propiedad no disponible",
      description: "La ficha solicitada no está disponible.",
      path: `/propiedades/${slug}`,
      noIndex: true,
    });
  }

  const publishedListing = listing.state === "published" ? listing : undefined;
  const primarySearchImage = publishedListing ? getSearchEligibleMedia(publishedListing)[0] : undefined;
  const description = publishedListing
    ? `${listing.name} en venta en ${listing.location}. ${listing.headline}${
        publishedListing.price ? ` Precio: ${publishedListing.price.display}.` : ""
      }`
    : listing.headline;

  return createPageMetadata({
    title: publishedListing ? `${listing.name} en venta · ${listing.location}` : listing.name,
    description,
    path: `/propiedades/${listing.slug}`,
    image: primarySearchImage
      ? {
          url: primarySearchImage.src,
          alt: primarySearchImage.alt,
          width: primarySearchImage.width,
          height: primarySearchImage.height,
        }
      : {
          url: `/propiedades/${listing.slug}/opengraph-image`,
          alt: `${listing.name} · ${listing.location}`,
        },
    noIndex: !isIndexableListing(listing) || !hasContactChannel,
  });
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = hasContactChannel ? getPublicListingBySlug(slug) : undefined;

  if (!listing) notFound();

  const publishedListing = listing.state === "published" ? listing : undefined;
  const indexableListing = isIndexableListing(listing) ? listing : undefined;
  const media = publishedListing ? getApprovedMedia(publishedListing) : [];
  const publicMap = publishedListing ? getApprovedPublicMap(publishedListing) : undefined;
  const documents = publishedListing ? getApprovedDocuments(publishedListing) : [];
  const primaryImage = media[0];
  const facts = publishedListing
    ? [
        publishedListing.area ? { label: "Superficie", value: publishedListing.area } : undefined,
        publishedListing.price ? { label: "Precio", value: publishedListing.price.display } : undefined,
        ...publishedListing.facts,
      ].filter((fact): fact is { label: string; value: string } => Boolean(fact))
    : [];

  return (
    <div className="site-shell listing-page">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="brand-mark">
            <BrandName />
          </Link>
          <Link className="back-link" href="/#propiedades">
            <span aria-hidden="true">←</span> Todas las propiedades
          </Link>
          <div className="header-actions">
            <ThemeToggle />
            {hasContactChannel ? (
              <ContactLink className="header-contact" listingName={listing.name}>
                Solicitar información
              </ContactLink>
            ) : (
              <Link className="header-contact" href="/">
                Ver colección
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="contenido">
        {indexableListing ? (
          <JsonLd id={`listing-${listing.slug}-json-ld`} data={listingJsonLd(indexableListing)} />
        ) : null}
        <section className="listing-hero page-grid" aria-labelledby="listing-title">
          <div className="listing-hero__copy">
            <p className="eyebrow">
              {listing.kind} · {listing.location}
            </p>
            <h1 id="listing-title">{listing.name}</h1>
            <p className="listing-hero__headline">{listing.headline}</p>
            {publishedListing ? (
              <p className="listing-hero__description">{publishedListing.description}</p>
            ) : null}
            <div className="listing-hero__actions">
              {hasContactChannel ? (
                <ContactLink className="button button--primary" listingName={listing.name}>
                  Solicitar información
                </ContactLink>
              ) : (
                <Link className="button button--primary" href="/">
                  Ver colección <span aria-hidden="true">→</span>
                </Link>
              )}
              {publicMap ? (
                <a className="button button--quiet" href={publicMap.href} target="_blank" rel="noreferrer">
                  {publicMap.label} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (abre en una nueva pestaña)</span>
                </a>
              ) : null}
            </div>
            {publishedListing ? <p className="listing-availability">{publishedListing.availability}</p> : null}
          </div>
          <div className="listing-hero__visual">
            {primaryImage ? (
              <>
                <Image
                  src={primaryImage.src}
                  alt={primaryImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="listing-hero__media-meta">
                  <span className="media-kind-label">{getMediaKindLabel(primaryImage.kind)}</span>
                  {getMediaDisclosure(primaryImage) ? (
                    <span>{getMediaDisclosure(primaryImage)}</span>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <TopographicField variant={1} />
                <span className="listing-hero__image-state">
                  {publishedListing ? "Imagen en preparación" : "Ficha inicial · imagen pendiente"}
                </span>
              </>
            )}
          </div>
        </section>

        {facts.length > 0 ? (
          <section className="listing-facts page-grid" aria-labelledby="facts-title">
            <div>
              <p className="eyebrow">Datos de la ficha</p>
              <h2 id="facts-title">Lo que se puede compartir hoy.</h2>
            </div>
            <dl>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {media.length > 1 ? (
          <section className="listing-gallery page-grid" aria-label={`Galería de ${listing.name}`}>
            {media.slice(1).map((asset) => (
              <figure key={asset.src}>
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  width={1200}
                  height={800}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                {asset.caption || getMediaDisclosure(asset) ? (
                  <figcaption>
                    <span className="media-kind-label">{getMediaKindLabel(asset.kind)}</span>
                    {asset.caption ? <span>{asset.caption}</span> : null}
                    {getMediaDisclosure(asset) ? <span>{getMediaDisclosure(asset)}</span> : null}
                  </figcaption>
                ) : (
                  <figcaption>
                    <span className="media-kind-label">{getMediaKindLabel(asset.kind)}</span>
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        ) : null}

        {documents.length > 0 ? (
          <section className="listing-documents page-grid" aria-labelledby="documents-title">
            <div>
              <p className="eyebrow">Material disponible</p>
              <h2 id="documents-title">Documentos aprobados para compartir.</h2>
            </div>
            <ul>
              {documents.map((document) => (
                <li key={document.href}>
                  <a href={document.href} target="_blank" rel="noreferrer">
                    {document.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (abre en una nueva pestaña)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <footer className="site-footer">
        <div className="page-grid site-footer__inner">
          <BrandName className="site-footer__brand" />
          <p>Información comercial sujeta a revisión y actualización.</p>
          <Link href="/">Volver a la colección</Link>
        </div>
      </footer>
    </div>
  );
}
