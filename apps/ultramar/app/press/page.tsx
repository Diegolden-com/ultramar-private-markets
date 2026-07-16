import { JsonLd } from "@/components/json-ld";
import { PageHeader, SurfaceGrid } from "@/components/page-layout";
import { pressArticles } from "@/lib/press";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

const pressPath = "/press";
const description =
  "Authoritative Ultramar.capital articles on Uniswap v4 custom accounting, onchain instruments, tokenized private equity, AI compliance, and continuous disclosure.";

const featuredArticle = pressArticles[0];
const secondaryArticles = pressArticles.slice(1);

export const metadata = createSeoMetadata({
  title: "Press",
  description,
  path: pressPath,
  image: seoImages.platform,
  keywords: [
    "onchain instruments",
    "Uniswap v4 custom accounting",
    "Uniswap v4 hooks",
    "onchain capital markets",
    "tokenized private equity",
    "AI compliance",
    "private market liquidity",
    "real world assets",
  ],
});

export default function PressPage() {
  return (
    <>
      <JsonLd
        id="press-json-ld"
        data={[
          webPageJsonLd({ path: pressPath, name: "Ultramar.capital Press", description }),
          itemListJsonLd({
            path: pressPath,
            name: "Ultramar.capital press articles",
            description,
            items: pressArticles.map((article) => ({
              name: article.title,
              url: `/press/${article.slug}`,
              description: article.description,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Press", path: pressPath },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Press desk"
        title="Market structure"
        description="Onchain ownership, disclosure, and controlled access."
      />

      <section className="border border-border-muted bg-border-muted">
        <Link
          href={`/press/${featuredArticle.slug}`}
          className="group grid min-h-full bg-surface transition hover:bg-surface-container lg:grid-rows-[auto_1fr]"
        >
          <div className="relative aspect-[16/8] overflow-hidden border-b border-border-muted">
            <Image
              src={featuredArticle.image}
              alt={featuredArticle.title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="image-blackwork object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-surface-ink/35" />
            <div className="badge badge-outline absolute left-4 top-4 bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
              Featured
            </div>
          </div>
          <div className="p-6 md:p-8">
            <h2 className="max-w-4xl font-serif text-4xl font-semibold leading-tight text-on-surface md:text-5xl">
              {featuredArticle.title}
            </h2>
          </div>
        </Link>

      </section>

      <SurfaceGrid columns="md:grid-cols-2 xl:grid-cols-3">
        {secondaryArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/press/${article.slug}`}
            className="card card-border group overflow-hidden bg-surface transition hover:border-status-signal"
          >
            <div className="relative aspect-[16/9] border-b border-border-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="image-blackwork object-cover transition duration-500 group-hover:scale-105"
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
