import { JsonLd } from "@/components/json-ld";
import { PageHeader, SurfaceGrid } from "@/components/page-layout";
import { researchArticles } from "@/lib/research";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
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
    <>
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

      <PageHeader
        eyebrow="Research library"
        title="Product research"
        description="Private markets and event-market risk."
      />

      <SurfaceGrid columns="md:grid-cols-2">
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
                className="image-blackwork object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-surface-ink/35" />
              <div className="badge badge-outline absolute left-4 top-4 bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                {article.cluster}
              </div>
            </div>
            <div className="p-6">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-on-surface">
                {article.title}
              </h2>
            </div>
          </Link>
        ))}
      </SurfaceGrid>
    </>
  );
}
