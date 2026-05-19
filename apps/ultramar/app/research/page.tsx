import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/section-header";
import { researchArticles } from "@/lib/research";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowRight, BookOpenText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const description =
  "Research memos and explainers for Ultramar.capital private markets, tokenized RWA infrastructure, Polymarket arbitrage, and allocator risk controls.";

export const metadata = createSeoMetadata({
  title: "Research",
  description,
  path: "/research",
  image: seoImages.platform,
  keywords: [
    "Ultramar research",
    "tokenized private equity research",
    "Polymarket arbitrage research",
    "RWA investing memo",
  ],
});

export default function ResearchPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="research-json-ld"
        data={[
          webPageJsonLd({ path: "/research", name: "Ultramar.capital Research", description }),
          itemListJsonLd({
            path: "/research",
            name: "Ultramar.capital research library",
            description,
            items: researchArticles.map((article) => ({
              name: article.title,
              url: `/research/${article.slug}`,
              description: article.description,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research" },
          ]),
        ]}
      />

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-surface p-6 md:p-8">
          <SectionHeader
            eyebrow="Research library"
            title="Linkable assets for private markets and Polymarket arbitrage"
            description="These memos are built for investors, issuers, analysts, and editors who need a concrete page to cite instead of a generic homepage."
          />
        </div>
        <div className="card card-border bg-surface p-6 md:p-8">
            <BookOpenText className="h-5 w-5 text-status-signal" />
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              The library implements the SEO growth plan with editorial assets
              that point back into the product surfaces: assets, oracle, legal,
              signals, dashboard, and risk.
            </p>
        </div>
      </section>

      <section className="grid gap-1 bg-border-muted md:grid-cols-2">
          {researchArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/research/${article.slug}`}
              className="card card-border group overflow-hidden bg-surface transition hover:border-status-signal"
            >
              <div className="relative aspect-[16/9] border-b border-border-muted">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="image-blackwork object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-surface-ink/35" />
                <div className="badge badge-outline absolute left-4 top-4 bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {article.cluster}
                </div>
              </div>
              <div className="p-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  {article.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                  {article.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="badge badge-outline badge-sm px-2 py-1 font-mono text-[11px] text-on-surface-variant">
                    {article.readingTime}
                  </span>
                  <span className="badge badge-outline badge-sm px-2 py-1 font-mono text-[11px] text-on-surface-variant">
                    {article.audience}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
      </section>
    </main>
  );
}
