import { BrandName } from "@/components/brand-name";
import { ContactLink } from "@/components/contact-link";
import { JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/listing-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopographicField } from "@/components/topographic-field";
import { contact, hasContactChannel } from "@/lib/contact";
import {
  getApprovedMedia,
  getIndexableListings,
  getPublicListings,
  totalInventoryCount,
  type PublishedPropertyListing,
} from "@/lib/listings";
import { createPageMetadata, homeJsonLd } from "@/lib/seo";
import { siteDescription } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const allPublicListings = getPublicListings();
const publicListings = hasContactChannel ? allPublicListings : [];
const indexableListings = getIndexableListings();
const hasTeasers = publicListings.some((listing) => listing.state === "teaser");
const canIndex = indexableListings.length > 0 && hasContactChannel && !hasTeasers;
const activeInventoryCount = allPublicListings.length;
const featuredListing = publicListings.find(
  (listing): listing is PublishedPropertyListing =>
    listing.id === "property-one" && listing.state === "published",
);
const featuredImage = featuredListing ? getApprovedMedia(featuredListing)[0] : undefined;
const lowestPublishedPrice = publicListings.reduce<PublishedPropertyListing["price"] | undefined>(
  (lowestPrice, listing) => {
    if (listing.state !== "published" || !listing.price) return lowestPrice;

    return !lowestPrice || listing.price.amount < lowestPrice.amount ? listing.price : lowestPrice;
  },
  undefined,
);

export const metadata = createPageMetadata({
  title: "Casas y terrenos en venta en Morelos e Hidalgo",
  description: siteDescription,
  noIndex: !canIndex,
});

export default function RealEstateHomePage() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="brand-mark">
            <BrandName />
          </Link>
          <nav className="site-nav" aria-label="Navegación principal">
            <a href="#propiedades">Propiedades</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            {hasContactChannel ? (
              <ContactLink className="header-contact" intent="availability">
                Pedir ficha
              </ContactLink>
            ) : (
              <a className="header-contact" href="#propiedades">
                Ver inventario
              </a>
            )}
          </div>
        </div>
      </header>

      <main id="contenido">
        {canIndex ? <JsonLd id="real-estate-json-ld" data={homeJsonLd()} /> : null}

        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-section__grid page-grid">
            <div className="hero-copy">
              <p className="eyebrow">Morelos e Hidalgo · venta directa</p>
              <h1 id="hero-title">Propiedades en venta. Datos claros, trato directo.</h1>
              <p className="hero-copy__lede">
                Casas y terrenos con precio publicado, características principales y atención directa
                por WhatsApp para resolver tus dudas.
              </p>
              <div className="hero-copy__actions">
                <a className="button button--primary" href="#propiedades">
                  Explorar propiedades
                  <span aria-hidden="true">↓</span>
                </a>
                {hasContactChannel ? (
                  <ContactLink className="button button--quiet" intent="availability">
                    Pedir ficha y disponibilidad
                  </ContactLink>
                ) : (
                  <a className="button button--quiet" href="#contacto">
                    Pedir información <span aria-hidden="true">↓</span>
                  </a>
                )}
              </div>
              <dl className="hero-index" aria-label="Resumen de la colección">
                <div>
                  <dt>Disponibles</dt>
                  <dd>{String(activeInventoryCount).padStart(2, "0")} propiedades</dd>
                </div>
                <div>
                  <dt>Precio publicado</dt>
                  <dd>{lowestPublishedPrice ? `Desde ${lowestPublishedPrice.display}` : "Por confirmar"}</dd>
                </div>
                <div>
                  <dt>Contacto</dt>
                  <dd>WhatsApp directo</dd>
                </div>
              </dl>
            </div>

            <figure className="hero-art hero-art--property">
              {featuredImage && featuredListing ? (
                <>
                  <Image
                    src={featuredImage.src}
                    alt={featuredImage.alt}
                    fill
                    priority
                    sizes="(min-width: 961px) 42vw, 100vw"
                    className="hero-art__image object-cover"
                  />
                  <figcaption className="hero-art__annotation">
                    <p>{featuredListing.name}</p>
                    <span>
                      {featuredListing.price?.display} · fotos del avalúo, 2024 · pide fotos y
                      video actuales
                    </span>
                  </figcaption>
                </>
              ) : (
                <TopographicField variant={0} showGrain />
              )}
            </figure>
          </div>
        </section>

        <section id="propiedades" className="collection-section page-grid" aria-labelledby="collection-title">
          <div className="section-intro">
            <p className="eyebrow">Propiedades disponibles</p>
            <h2 id="collection-title">Conoce precio y características principales.</h2>
            <p>
              Revisa lo principal y pide la ficha, fotos actuales o una visita cuando una propiedad
              te interese.
            </p>
          </div>

          {publicListings.length > 0 ? (
            <div className={`listings-grid listings-grid--${publicListings.length}`}>
              {publicListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <InventoryPending />
          )}
        </section>

        <section className="visit-section" aria-labelledby="visit-title">
          <div className="visit-section__inner page-grid">
            <div>
              <p className="eyebrow">Antes de una visita</p>
              <h2 id="visit-title">Pide la ficha y mira la propiedad como está hoy.</h2>
            </div>
            <div className="visit-section__action">
              <p>
                Te compartimos disponibilidad, información de la ficha y, cuando aplique, fotos o
                video actualizados antes de coordinar una visita.
              </p>
              {hasContactChannel ? (
                <ContactLink className="button button--primary" intent="availability">
                  Pedir ficha y disponibilidad
                </ContactLink>
              ) : null}
            </div>
          </div>
        </section>

        <section id="contacto" className="contact-section page-grid" aria-labelledby="contact-title">
          <div className="contact-section__card">
            <p className="eyebrow">Contacto</p>
            <h2 id="contact-title">Pide ficha, fotos actuales o una visita.</h2>
            <p>
              {hasContactChannel
                ? "Escríbenos por WhatsApp. Te respondemos con la información disponible de la propiedad que te interesa."
                : "El canal de contacto se activará junto con las fichas comerciales aprobadas."}
            </p>
            {hasContactChannel ? (
              <div className="contact-section__actions">
                <ContactLink className="button button--primary" intent="availability">
                  Escribir por WhatsApp
                </ContactLink>
                {contact.email ? <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a> : null}
              </div>
            ) : (
              <p className="contact-section__notice" role="status">
                Las fichas no muestran datos de contacto provisionales.
              </p>
            )}
          </div>
          <div className="contact-section__aside" aria-hidden="true">
            <TopographicField variant={2} />
            <span>Ultramar / Real Estate</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-grid site-footer__inner">
          <BrandName className="site-footer__brand" />
          <p>Disponibilidad y características sujetas a confirmación antes de una visita.</p>
          <a href="https://ultramar.capital">Ultramar.capital ↗</a>
        </div>
      </footer>
    </div>
  );
}

function InventoryPending() {
  return (
    <div className="inventory-pending" role="status">
      <div className="inventory-pending__copy">
        <p className="eyebrow">Inventario en preparación</p>
        <h3>Los tres expedientes se liberarán con información verificada.</h3>
        <p>
          No usamos fotografías de stock, ubicaciones aproximadas ni atributos sin confirmar para
          representar una propiedad real.
        </p>
      </div>
      <ul aria-label="Tres fichas de propiedad en preparación">
        {Array.from({ length: totalInventoryCount }, (_, index) => (
          <li key={index}>
            <TopographicField variant={index} />
            <span>Ficha en preparación</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
