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
  "Human-readable sitemap for Ultramar.capital products, disclosures, research, Private Equities, and the Arbitrage Hedge Fund.";

const allLinks = indexableRouteGroups.flatMap((group) =>
  group.links.map((link) => ({
    name: `${group.title}: ${link.label}`,
    url: link.href,
    description: `${link.label} on Ultramar.capital.`,
  })),
);

export const metadata = createSeoMetadata({
  title: "Sitemap",
  description,
  path: sitemapPath,
  image: seoImages.platform,
  keywords: ["Ultramar sitemap", "Ultramar site index", "capital platform sitemap"],
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
            name: "Ultramar.capital public destinations",
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
        eyebrow="Site index"
        title="Human-readable sitemap"
        description="A compact index of product areas, disclosures, research, press articles, and read-only data feeds."
      >
        <Map className="h-5 w-5 text-status-signal" />
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">
          Reviewers can use this index to move through Ultramar&apos;s public materials. The XML sitemap
          remains available for search engines and automated tools.
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
