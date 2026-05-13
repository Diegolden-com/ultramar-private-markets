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
    <main>
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

      <section className="financial-grid border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Research library"
            title="Linkable assets for private markets and Polymarket arbitrage"
            description="These memos are built for investors, issuers, analysts, and editors who need a concrete page to cite instead of a generic homepage."
          />
          <div className="rounded border border-border/70 bg-card/80 p-6">
            <BookOpenText className="h-5 w-5 text-accent" />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              The library implements the SEO growth plan with editorial assets
              that point back into the product surfaces: assets, oracle, legal,
              signals, dashboard, and risk.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {researchArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/research/${article.slug}`}
              className="group overflow-hidden rounded border border-border/70 bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] border-b border-border/70">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 bg-background/95 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  {article.cluster}
                </div>
              </div>
              <div className="p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
                  {article.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {article.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                    {article.readingTime}
                  </span>
                  <span className="rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                    {article.audience}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
