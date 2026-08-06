import { BrandName } from "@/components/brand-name";
import { ContactLink } from "@/components/contact-link";
import { JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/listing-card";
import { TopographicField } from "@/components/topographic-field";
import { contact, hasContactChannel } from "@/lib/contact";
import { getIndexableListings, getPublicListings, totalInventoryCount } from "@/lib/listings";
import { createPageMetadata, homeJsonLd } from "@/lib/seo";
import { siteDescription } from "@/lib/site";
import Link from "next/link";

const allPublicListings = getPublicListings();
const publicListings = hasContactChannel ? allPublicListings : [];
const indexableListings = getIndexableListings();
const hasTeasers = publicListings.some((listing) => listing.state === "teaser");
const canIndex = indexableListings.length > 0 && hasContactChannel && !hasTeasers;
const activeInventoryCount = allPublicListings.length;
const pendingInventoryCount = totalInventoryCount - activeInventoryCount;

export const metadata = createPageMetadata({
  title: "Propiedades seleccionadas",
  description: siteDescription,
  noIndex: !canIndex,
});

const processSteps = [
  {
    title: "Consulta",
    copy: "Elige la propiedad que quieres conocer y comparte el contexto de tu búsqueda.",
  },
  {
    title: "Ficha verificada",
    copy: "Recibe únicamente la información que esté aprobada para difusión de la propiedad.",
  },
  {
    title: "Siguiente conversación",
    copy: "Coordinamos el siguiente paso directamente, según la información disponible.",
  },
];

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
            <a href="#proceso">Proceso</a>
            <a href="#contacto">Contacto</a>
          </nav>
          {hasContactChannel ? (
            <ContactLink className="header-contact">Solicitar información</ContactLink>
          ) : (
            <a className="header-contact" href="#propiedades">
              Ver inventario
            </a>
          )}
        </div>
      </header>

      <main id="contenido">
        {canIndex ? <JsonLd id="real-estate-json-ld" data={homeJsonLd()} /> : null}

        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-section__grid page-grid">
            <div className="hero-copy">
              <p className="eyebrow">Propiedades de venta directa</p>
              <h1 id="hero-title">
                Cada propiedad se entiende antes de recorrerla.
              </h1>
              <p className="hero-copy__lede">
                Una selección curada, presentada con contexto, material aprobado y una conversación
                directa.
              </p>
              <div className="hero-copy__actions">
                <a className="button button--primary" href="#propiedades">
                  Explorar propiedades
                  <span aria-hidden="true">↓</span>
                </a>
                {hasContactChannel ? (
                  <ContactLink className="button button--quiet">Solicitar información</ContactLink>
                ) : (
                  <a className="button button--quiet" href="#proceso">
                    Conocer el proceso <span aria-hidden="true">↓</span>
                  </a>
                )}
              </div>
              <dl className="hero-index" aria-label="Resumen de la colección">
                <div>
                  <dt>Disponibles</dt>
                  <dd>{String(activeInventoryCount).padStart(2, "0")} propiedades</dd>
                </div>
                <div>
                  <dt>Atención</dt>
                  <dd>Directa</dd>
                </div>
                <div>
                  <dt>En preparación</dt>
                  <dd>{String(pendingInventoryCount).padStart(2, "0")} ficha</dd>
                </div>
              </dl>
            </div>

            <div className="hero-art" aria-hidden="true">
              <TopographicField variant={0} showGrain />
              <div className="hero-art__annotation">
                <p>Atlas de propiedades</p>
                <span>Gráfica editorial · no es plano técnico</span>
              </div>
              <div className="hero-art__coordinate hero-art__coordinate--one">
                <span>01</span>
                <i />
              </div>
              <div className="hero-art__coordinate hero-art__coordinate--two">
                <span>03</span>
                <i />
              </div>
            </div>
          </div>
        </section>

        <section id="propiedades" className="collection-section page-grid" aria-labelledby="collection-title">
          <div className="section-intro">
            <p className="eyebrow">La colección</p>
            <h2 id="collection-title">Propiedades con una ficha a la altura de la decisión.</h2>
            <p>
              Publicamos cada propiedad sólo cuando su información comercial y su material de
              referencia han sido revisados para compartirlos.
            </p>
          </div>

          {publicListings.length > 0 ? (
            <div className="listings-grid">
              {publicListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <InventoryPending />
          )}
        </section>

        <section id="proceso" className="process-section" aria-labelledby="process-title">
          <div className="page-grid process-section__inner">
            <div className="section-intro process-section__intro">
              <p className="eyebrow">Una conversación clara</p>
              <h2 id="process-title">El contexto viene antes que la visita.</h2>
            </div>
            <ol className="process-list">
              {processSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="process-list__count">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contacto" className="contact-section page-grid" aria-labelledby="contact-title">
          <div className="contact-section__card">
            <p className="eyebrow">Contacto</p>
            <h2 id="contact-title">Hablemos de la propiedad que estás buscando.</h2>
            <p>
              {hasContactChannel
                ? "Comparte la propiedad que te interesa y te responderemos por el canal indicado."
                : "El canal de contacto se activará junto con las fichas comerciales aprobadas."}
            </p>
            {hasContactChannel ? (
              <div className="contact-section__actions">
                <ContactLink className="button button--primary">Abrir conversación</ContactLink>
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
          <p>Propiedades seleccionadas. Información comercial sujeta a revisión y actualización.</p>
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
