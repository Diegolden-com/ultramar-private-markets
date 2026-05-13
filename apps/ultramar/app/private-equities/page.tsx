import { JsonLd } from "@/components/json-ld";
import { MetricCard } from "@/components/metric-card";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { deals } from "@/lib/deals";
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
const featuredDeal = deals[0];
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

const workflowItems = [
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
];

export const metadata = createSeoMetadata({
  title: "Private Equities, uncompromised",
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

      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="blackwork-hatch absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto grid min-h-[76vh] max-w-7xl gap-0 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-between border-x border-background/15 px-5 py-8 sm:px-8 lg:py-12 lg:pr-12">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-background/60">
                Ultramar.capital / {product.eyebrow}
              </p>
              <h1 className="mt-8 max-w-4xl break-words font-serif text-4xl font-bold leading-[0.9] [overflow-wrap:anywhere] sm:text-7xl lg:text-8xl">
                Private Equities, uncompromised.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-background/75">
                A controlled private-market rail for issuer onboarding, eligible
                investor access, oracle-backed operating data, markets, and
                portfolio state. No public-exchange cosplay.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities/assets"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-background bg-background px-5 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-transparent hover:text-background"
              >
                Explore Assets
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/private-equities/oracle"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-background/30 px-5 font-mono text-xs font-bold uppercase tracking-widest text-background transition hover:border-background hover:bg-background hover:text-foreground"
              >
                View Oracle
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <aside className="grid border-x border-b border-background/15 lg:border-l-0 lg:border-y">
            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[420px]">
              <Image
                src={featuredDeal.image}
                alt={featuredDeal.name}
                fill
                priority
                sizes="(min-width: 1024px) 47vw, 100vw"
                className="image-blackwork object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-foreground/40" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  {featuredDeal.ticker}
                </span>
                <span className="border border-background/50 bg-foreground/55 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                  {featuredDeal.type}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-background/20 bg-foreground/80 backdrop-blur-sm">
                {[
                  ["Valuation", "$4.5M"],
                  ["Compliance", "98"],
                  ["Min ticket", "$500"],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-background/20 p-4 last:border-r-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">
                      {label}
                    </p>
                    <p className="mt-2 font-mono text-lg font-semibold text-background">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
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

      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-px bg-background/20 px-4 py-16 sm:px-6 lg:grid-cols-3">
          {[
            ["01", "Issuer room", "Documents, terms, economics, and verification enter the same private-market path."],
            ["02", "Oracle proof", "Operating data is converted into solvency and liquidity context investors can read."],
            ["03", "Eligible transfer", "Market and portfolio surfaces stay tied to compliance boundaries and legal review."],
          ].map(([label, title, body]) => (
            <div key={label} className="bg-foreground p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-background/50">
                {label}
              </p>
              <h2 className="mt-8 font-serif text-3xl font-bold leading-tight">{title}</h2>
              <p className="mt-4 text-sm leading-6 text-background/65">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Workflow"
            title="A private-market rail, not a token bazaar"
            description="This page is the route into assets, deals, oracle data, market views, and portfolio state."
          />
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {workflowItems.map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className="group bg-card p-5 transition hover:bg-foreground hover:text-background"
              >
                <item.icon className="h-5 w-5 text-accent group-hover:text-background" />
                <h3 className="mt-10 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground group-hover:text-background/65">
                  {item.body}
                </p>
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
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {researchArticles
              .filter((article) => article.cluster === "Private markets")
              .map((article) => (
                <Link
                  key={article.slug}
                  href={`/research/${article.slug}`}
                  className="group bg-background p-5 transition hover:bg-foreground hover:text-background"
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent group-hover:text-background">
                    {article.eyebrow}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground group-hover:text-background/65">
                    {article.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent group-hover:text-background">
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
              <details key={item.question} className="rounded border border-border/70 bg-card/70 p-5">
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
