import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/section-header";
import { deals } from "@/lib/deals";
import { footerLinks } from "@/lib/footer-routes";
import { researchArticles } from "@/lib/research";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { products } from "@ultramar/product-model";
import { ArrowUpRight, Map } from "lucide-react";
import Link from "next/link";

const sitemapPath = "/sitemap";
const description =
  "Human-readable sitemap for Ultramar.capital product, disclosure, research, private equities, and arbitrage hedge fund routes.";

const routeGroups = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Research", href: "/research" },
      ...footerLinks,
    ],
  },
  {
    title: "Products",
    links: products.map((product) => ({
      label: product.name,
      href: product.href,
    })),
  },
  {
    title: "Private Equities",
    links: [
      { label: "Overview", href: "/private-equities" },
      { label: "Assets", href: "/private-equities/assets" },
      { label: "Deals", href: "/private-equities/deals" },
      { label: "Oracle", href: "/private-equities/oracle" },
      { label: "Market", href: "/private-equities/market" },
      { label: "Portfolio", href: "/private-equities/portfolio" },
      { label: "Legal Gate", href: "/private-equities/legal" },
      ...deals.map((deal) => ({
        label: `${deal.name} (${deal.ticker})`,
        href: `/private-equities/assets/${deal.ticker}`,
      })),
    ],
  },
  {
    title: "Arbitrage Hedge Fund",
    links: [
      { label: "Overview", href: "/arbitrage-hedge-fund" },
      { label: "Dashboard", href: "/arbitrage-hedge-fund/dashboard" },
      { label: "Signals", href: "/arbitrage-hedge-fund/signals" },
      { label: "Risk", href: "/arbitrage-hedge-fund/risk" },
      { label: "Research", href: "/arbitrage-hedge-fund/research" },
    ],
  },
  {
    title: "Research Memos",
    links: researchArticles.map((article) => ({
      label: article.title,
      href: `/research/${article.slug}`,
    })),
  },
] as const;

const allLinks = routeGroups.flatMap((group) =>
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
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
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

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-surface p-6 md:p-8">
          <SectionHeader
            eyebrow="Route index"
            title="Human-readable sitemap"
            description="A compact index of public product surfaces, disclosure routes, research assets, and machine-readable feeds."
          />
        </div>
        <div className="border border-border-muted bg-surface p-6 md:p-8">
          <Map className="h-5 w-5 text-status-signal" />
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            Search crawlers should use the XML feed. Operators and reviewers can use this page to inspect
            the visible route map without opening raw metadata.
          </p>
          <Link
            href="/sitemap.xml"
            className="mt-6 inline-flex items-center gap-2 border border-border-muted bg-surface-ink px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface transition-colors hover:border-status-signal hover:bg-status-signal hover:text-surface-ink"
          >
            Open sitemap.xml
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid min-w-0 gap-1 bg-border-muted lg:grid-cols-2">
        {routeGroups.map((group) => (
          <article key={group.title} className="min-w-0 border border-border-muted bg-surface p-5">
            <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
              {group.title}
            </h2>
            <div className="mt-5 grid min-w-0 gap-1 border border-border-muted bg-border-muted">
              {group.links.map((link) => (
                <Link
                  key={`${group.title}-${link.href}`}
                  href={link.href}
                  className="flex min-w-0 flex-col gap-1 bg-surface px-4 py-3 transition-colors hover:bg-surface-container sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
      </section>
    </main>
  );
}
