import { JsonLd } from "@/components/json-ld";
import { FeatureCard, PageHeader, StatTile, SurfaceGrid } from "@/components/page-layout";
import { pressArticles } from "@/lib/press";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowRight, BadgeCheck, Blocks, FileText, Radar, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const pressPath = "/press";
const description =
  "Authoritative Ultramar.capital articles on Uniswap v4 custom accounting, onchain instruments, tokenized private equity, AI compliance, and continuous disclosure.";

const featuredArticle = pressArticles[0];
const secondaryArticles = pressArticles.slice(1);

const editorialPrinciples = [
  {
    icon: Blocks,
    title: "Windowed infrastructure",
    body: "Capital Windows treat onchain instruments as settlement infrastructure for approved conversion windows, not as generic public liquidity.",
  },
  {
    icon: Radar,
    title: "Continuous disclosure",
    body: "Private-market trust improves when issuer operating data can be monitored continuously instead of waiting for stale packets of reporting.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled access",
    body: "Investor access should expand through eligibility, investment limits, legal wrappers, and programmable restrictions, not through unmanaged promotion.",
  },
] as const;

const pressStats = [
  {
    label: "Editorial Focus",
    value: "Capital Windows",
    detail: "Gated conversion, disclosure, settlement, and transfer controls.",
  },
  {
    label: "Core Thesis",
    value: "Access + Trust",
    detail: "Private markets need better participation and better proof.",
  },
  {
    label: "Disclosure Model",
    value: "AI Native",
    detail: "Source-bound telemetry, anomaly detection, and explainable scores.",
  },
  {
    label: "Market Window",
    value: "24/7",
    detail: "Global price discovery requires rails that do not close after office hours.",
  },
] as const;

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
        title="Authoritative arguments for onchain capital instruments"
        description="Public arguments for tokenized ownership, continuous disclosure, lower-friction secondary rails, and AI-supported compliance."
        asidePadded={false}
        asideClassName="grid grid-cols-1 gap-1 bg-border-muted sm:grid-cols-2"
      >
        {pressStats.map((stat) => (
          <StatTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            detail={stat.detail}
            tone="signal"
          />
        ))}
      </PageHeader>

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[1.1fr_0.9fr]">
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
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              {featuredArticle.eyebrow}
            </p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-on-surface md:text-5xl">
              {featuredArticle.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-on-surface-variant">
              {featuredArticle.description}
            </p>
            <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Read position
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <aside className="grid gap-1 bg-border-muted">
          {editorialPrinciples.map((principle) => (
            <FeatureCard
              key={principle.title}
              icon={principle.icon}
              title={principle.title}
              body={principle.body}
              className="rounded-none border-0"
            />
          ))}
        </aside>
      </section>

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-surface p-6 md:p-8">
          <BadgeCheck className="h-5 w-5 text-status-signal" />
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-on-surface">
            Explore Capital Windows in Ultramar
          </h2>
        </div>
        <div className="grid gap-1 bg-border-muted sm:grid-cols-2 xl:grid-cols-3">
          {featuredArticle.linkTargets.map((target) => (
            <Link
              key={target.href}
              href={target.href}
              className="group bg-surface p-5 transition hover:bg-surface-container"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {target.label}
                </h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-status-signal transition group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                {target.description}
              </p>
            </Link>
          ))}
        </div>
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
                Open article
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </SurfaceGrid>

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-surface p-6 md:p-8">
          <BadgeCheck className="h-5 w-5 text-status-signal" />
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-on-surface">
            Press language with product boundaries
          </h2>
        </div>
        <div className="bg-surface p-6 md:p-8">
          <FileText className="h-5 w-5 text-on-surface-variant" />
          <p className="mt-4 max-w-4xl text-sm leading-6 text-on-surface-variant">
            These articles explain Ultramar&apos;s market-structure position. They do not offer
            securities, provide legal advice, accept funds, or represent that any private-market
            product is available without eligibility checks, issuer-specific documents, and counsel
            review.
          </p>
        </div>
      </section>
    </>
  );
}
