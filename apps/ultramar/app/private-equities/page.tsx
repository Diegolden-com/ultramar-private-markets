import { JsonLd } from "@/components/json-ld";
import { MetricCard } from "@/components/metric-card";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { researchArticles } from "@/lib/research";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  seoImages,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { productBySlug } from "@ultramar/product-model";
import { ArrowRight, Building2, DatabaseZap, FileCheck2, LineChart, WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["private-equities"];
const description =
  "Private-market and tokenized real-world asset workflows for issuers, eligible investors, oracle proofs, markets, and portfolios.";

const privateEquitiesFaqs = [
  {
    question: "How does Ultramar Private Equities support tokenized private-market assets?",
    answer:
      "It connects issuer onboarding, asset discovery, compliance-aware investor flows, oracle-backed operating data, market views, and portfolio tracking into one private-market workflow.",
  },
  {
    question: "Is Ultramar Private Equities a public exchange?",
    answer:
      "No. The public site describes the product workflow. Production participation requires investor eligibility checks, legal review, issuer documents, and jurisdiction-specific transfer controls.",
  },
  {
    question: "Why does the private-equities product include an issuer oracle?",
    answer:
      "The issuer oracle turns operating data into investor-facing solvency and liquidity context so private-market assets can be evaluated with more consistent information.",
  },
];

export const metadata = createSeoMetadata({
  title: "Private Equities",
  description,
  path: product.href,
  image: seoImages.privateEquities,
  keywords: ["tokenized private equity", "private market assets", "issuer oracle", "RWA platform"],
});

export default function PrivateEquitiesPage() {
  return (
    <main>
      <JsonLd
        id="private-equities-json-ld"
        data={[
          webPageJsonLd({ path: product.href, name: "Ultramar Private Equities", description }),
          serviceJsonLd({ product, serviceType: "Private-market investing platform" }),
          faqJsonLd(privateEquitiesFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: product.href },
          ]),
        ]}
      />
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          src="/solarpunk-laundromat.png"
          alt="Private-market operating asset"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/68" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl text-[oklch(0.98_0.015_85)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              {product.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Private Equities for tokenized real-world assets.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Ultramar Private Equities gives issuers and investors a controlled
              workflow for private assets: deal discovery, compliance signals,
              oracle-backed operating data, market access, and portfolio tracking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities/assets"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Explore Assets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/private-equities/oracle"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-[oklch(0.98_0.015_85)] hover:bg-[oklch(0.98_0.015_85)] hover:text-[oklch(0.12_0.03_75)]"
              >
                View Oracle
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Deal rail"
            value="Primary"
            detail="Issuer-led rounds with structured investor context."
            icon={Building2}
          />
          <MetricCard
            label="Market rail"
            value="Secondary"
            detail="Transfer workflow for eligible tokenized positions."
            icon={LineChart}
          />
          <MetricCard
            label="Oracle"
            value="Solvency"
            detail="Accounting data condensed into signed operating proofs."
            icon={DatabaseZap}
          />
        </div>
      </section>

      <section className="border-t border-border bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Workflow"
            title="The product owns the full private-market path"
            description="This is not a generic landing page. It is the route into assets, deals, oracle data, market views, and portfolio state."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Building2,
                title: "Assets",
                body: "Browse primary and secondary private-market opportunities with standardized metrics.",
                href: "/private-equities/assets",
              },
              {
                icon: FileCheck2,
                title: "Deals",
                body: "Understand issuer rounds, minimum tickets, offering mechanics, and required diligence.",
                href: "/private-equities/deals",
              },
              {
                icon: DatabaseZap,
                title: "Oracle",
                body: "Connect operating data to solvency and liquidity signals used by the asset rail.",
                href: "/private-equities/oracle",
              },
              {
                icon: WalletCards,
                title: "Portfolio",
                body: "Track holdings, exposure, performance, and realized gains inside Ultramar.capital.",
                href: "/private-equities/portfolio",
              },
            ].map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className="rounded-lg border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
              >
                <item.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Research"
            title="Private-market memos built for citation"
            description="These pages support outreach around tokenized private equity, issuer data, and RWA operating infrastructure while linking back into the product workflow."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {researchArticles
              .filter((article) => article.cluster === "Private markets")
              .map((article) => (
                <Link
                  key={article.slug}
                  href={`/research/${article.slug}`}
                  className="group rounded border border-border/70 bg-background p-5 transition hover:border-accent hover:shadow-md"
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
                    {article.eyebrow}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {article.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
                    Read memo
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Private-market SEO"
            title="What the product means in practice"
            description="These answers keep the page aligned with tokenized private equity, RWA investing, issuer data, and compliance-aware market access without keyword stuffing."
          />
          <div className="grid gap-4">
            {privateEquitiesFaqs.map((item) => (
              <details
                key={item.question}
                className="rounded border border-border/70 bg-card/70 p-5"
              >
                <summary className="cursor-pointer list-none font-serif text-2xl font-bold">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ProductCrosslink current="private-equities" />
    </main>
  );
}
