import { JsonLd } from "@/components/json-ld";
import { PageHeader, PageShell, SurfaceGrid } from "@/components/page-layout";
import { indexableRouteGroups } from "@/lib/discoverability";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowUpRight, Map } from "lucide-react";
import Link from "next/link";

const sitemapPath = "/sitemap";
const description =
  "Human-readable sitemap for Ultramar.capital product, disclosure, research, private equities, and arbitrage hedge fund routes.";

const allLinks = indexableRouteGroups.flatMap((group) =>
  group.links.map((link) => ({
    name: `${group.title}: ${link.label}`,
    url: link.href,
    description: `Ultramar.capital route for ${link.label}.`,
  })),
);

export const metadata = createSeoMetadata({
  title: "Sitemap",
  description,
  path: sitemapPath,
  image: seoImages.platform,
  keywords: ["Ultramar sitemap", "Ultramar routes", "capital platform sitemap"],
});

export default function SitemapPage() {
  return (
    <PageShell>
      <JsonLd
        id="sitemap-json-ld"
        data={[
          webPageJsonLd({ path: sitemapPath, name: "Ultramar.capital Sitemap", description }),
          itemListJsonLd({
            path: sitemapPath,
            name: "Ultramar.capital public routes",
            description,
            items: allLinks,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Sitemap", path: sitemapPath },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Route index"
        title="Human-readable sitemap"
        description="A compact index of public product surfaces, disclosure routes, research assets, and machine-readable feeds."
      >
        <Map className="h-5 w-5 text-status-signal" />
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">
          Search crawlers should use the XML feed. Operators and reviewers can use this page to inspect
          the visible route map without opening raw metadata.
        </p>
        <Link
          href="/sitemap.xml"
          className="btn btn-outline btn-success mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
        >
          Open sitemap.xml
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <SurfaceGrid columns="lg:grid-cols-2" className="min-w-0">
        {indexableRouteGroups.map((group) => (
          <article key={group.title} className="card card-border min-w-0 bg-surface p-5">
            <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
              {group.title}
            </h2>
            <div className="mt-5 grid min-w-0 gap-1 border border-border-muted bg-border-muted">
              {group.links.map((link) => (
                <Link
                  key={`${group.title}-${link.href}`}
                  href={link.href}
                  className="btn btn-ghost flex h-auto min-w-0 flex-col items-start gap-1 bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-container sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="min-w-0 text-sm leading-5 text-on-surface">{link.label}</span>
                  <span className="min-w-0 break-all font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant sm:text-right">
                    {link.href}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </SurfaceGrid>
    </PageShell>
  );
}
