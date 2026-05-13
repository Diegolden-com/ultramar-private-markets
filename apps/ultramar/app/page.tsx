import { JsonLd } from "@/components/json-ld";
import { MetricCard } from "@/components/metric-card";
import { SectionHeader } from "@/components/section-header";
import { deals } from "@/lib/deals";
import { researchArticles } from "@/lib/research";
import {
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { products } from "@ultramar/product-model";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const homeDescription =
  "Ultramar.capital is the canonical platform for Private Equities and a Polymarket-first Arbitrage Hedge Fund.";

export const metadata = createSeoMetadata({
  title: "Ultramar.capital | Private Equities and Arbitrage Hedge Fund",
  description: homeDescription,
  path: "/",
  image: seoImages.platform,
  keywords: ["investment platform", "private market access", "prediction market arbitrage"],
});

const productImages = {
  "private-equities": "/solarpunk-laundromat.png",
  "arbitrage-hedge-fund": "/tarot-market.png",
} as const;

const productIcons = {
  "private-equities": Building2,
  "arbitrage-hedge-fund": BarChart3,
} as const;

const homeFaqs = [
  {
    question: "What is Ultramar.capital?",
    answer:
      "Ultramar.capital is the canonical platform brand for two capital products: Ultramar Private Equities and the Ultramar Arbitrage Hedge Fund.",
  },
  {
    question: "What does Ultramar Private Equities do?",
    answer:
      "Ultramar Private Equities organizes tokenized private-market workflows for issuer onboarding, asset discovery, compliance-aware investor flows, oracle-backed operating data, markets, and portfolio visibility.",
  },
  {
    question: "What is the Ultramar Arbitrage Hedge Fund?",
    answer:
      "The Ultramar Arbitrage Hedge Fund is a Polymarket-first arbitrage product that compares prediction-market prices with derivatives-implied probabilities and turns durable spreads into monitored signals.",
  },
];

export default function HomePage() {
  return (
    <main>
      <JsonLd
        id="home-webpage-json-ld"
        data={[
          webPageJsonLd({
            path: "/",
            name: "Ultramar.capital",
            description: homeDescription,
          }),
          itemListJsonLd({
            path: "/",
            name: "Ultramar.capital products",
            description: "The canonical product surfaces available on Ultramar.capital.",
            items: products.map((product) => ({
              name: product.name,
              url: product.href,
              description: product.description,
            })),
          }),
          faqJsonLd(homeFaqs),
        ]}
      />
      <section className="relative isolate min-h-[76vh] overflow-hidden">
        <Image
          src="/tarot-market.png"
          alt="Mysterious market cycle tarot card"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/78" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 overflow-hidden opacity-35">
          <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/45 to-transparent" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/60 to-transparent" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/45 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-center px-4 py-20 text-center sm:px-6">
          <div className="mx-auto max-w-5xl text-[oklch(0.98_0.015_85)]">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.38em] text-accent">
              Ultramar.capital / Investment platform
            </p>
            <h1 className="mt-7 font-serif text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">
              Ultramar.capital
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/80 sm:text-xl">
              Two capital products, one institutional surface: tokenized
              private-market access and Polymarket-first arbitrage fund
              infrastructure under a single canonical brand.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/private-equities"
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[oklch(0.98_0.015_85)] px-8 font-mono text-sm font-bold uppercase tracking-widest text-[oklch(0.12_0.03_75)] transition hover:bg-[oklch(0.94_0.015_85)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Private Equities
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/arbitrage-hedge-fund"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/30 bg-white/[0.04] px-8 font-mono text-sm font-bold uppercase tracking-widest text-[oklch(0.98_0.015_85)] backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
              >
                Arbitrage Hedge Fund
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
          <MetricCard
            label="Public taxonomy"
            value="2 products"
            detail="Capital is the platform layer, not a third product."
            icon={Target}
          />
          <MetricCard
            label="Fund focus"
            value="Polymarket"
            detail="Arbitrage Hedge Fund v1 is prediction-market arbitrage."
            icon={BarChart3}
          />
          <MetricCard
            label="Private market"
            value="RWA rail"
            detail="Issuer, asset, oracle, market, and portfolio workflows."
            icon={ShieldCheck}
          />
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20 sm:px-6">
        <div className="asset-noise absolute inset-0 text-foreground opacity-[0.025]" />
        <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Products"
          title="Two operating surfaces for capital"
          description="The interface presents Private Equities and Arbitrage Hedge Fund as the only product choices. Shared navigation keeps context visible across both."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {products.map((product, index) => (
            <Link
              key={product.slug}
              href={product.href}
              className="group grid overflow-hidden rounded border border-border/70 bg-card/75 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-xl md:grid-cols-[0.92fr_1.08fr]"
            >
              <div className="relative min-h-72 border-b border-border/70 md:border-b-0 md:border-r">
                <Image
                  src={productImages[product.slug]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-transparent" />
                <span className="absolute left-4 top-4 bg-foreground px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
                    {product.eyebrow}
                  </p>
                  {(() => {
                    const Icon = productIcons[product.slug];
                    return <Icon className="h-5 w-5 text-accent" />;
                  })()}
                </div>
                <h2 className="mt-3 font-serif text-4xl font-bold">{product.name}</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-6 grid gap-4 border-t border-border pt-5">
                  <ProductFact label="For" value={product.audience} />
                  <ProductFact label="Problem" value={product.problem} />
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {product.primaryCta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
                Private-market visual system
              </p>
              <h2 className="mt-4 font-serif text-5xl font-bold leading-none sm:text-7xl">
                Operating assets
              </h2>
            </div>
            <Link
              href="/private-equities/assets"
              className="group inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
            >
              View assets
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {deals.slice(0, 3).map((deal, index) => (
              <Link
                key={deal.id}
                href={`/private-equities/assets/${deal.ticker}`}
                className={`group relative block overflow-hidden rounded border border-border/60 shadow-xl transition hover:border-accent/50 ${
                  index === 0 ? "min-h-[520px] md:col-span-2 md:row-span-2" : "min-h-[250px]"
                }`}
              >
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                  <span className="bg-background/95 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    {deal.ticker}
                  </span>
                  <span className="border border-white/35 bg-black/45 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
                    {deal.type}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-7">
                  <div className="border border-white/15 bg-black/35 p-5 text-white backdrop-blur-md transition group-hover:bg-black/50">
                    <h3 className="font-serif text-2xl font-bold md:text-3xl">{deal.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/72">{deal.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Research"
              title="Memos built for citations and backlinks"
              description="Each research page has a clear audience, a linkable thesis, and internal links back into the product routes that matter for ranking."
            />
            <Link
              href="/research"
              className="group inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
            >
              Open library
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {researchArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/research/${article.slug}`}
                className="group flex min-h-72 flex-col rounded border border-border/70 bg-background p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  {article.cluster}
                </p>
                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">
                  {article.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                  {article.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.38em] text-accent">
          Operating philosophy
        </p>
        <p className="mt-10 font-serif text-4xl font-bold leading-[1.12] text-foreground sm:text-6xl">
          Capital used to live behind gateways.
          <br />
          <span className="italic text-muted-foreground/50">Ultramar turns it into a governed interface.</span>
        </p>
        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "Borderless",
              body: "Products are framed around access, transfer, and allocator context instead of isolated domains.",
            },
            {
              title: "Governed",
              body: "Each surface makes eligibility, risk, and operating boundaries visible before action.",
            },
            {
              title: "Observable",
              body: "Signals, proofs, positions, and portfolio state sit close to the product narrative.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded border border-border/60 p-6 text-left transition hover:border-accent/40 hover:bg-accent/5"
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHeader
            eyebrow="Search context"
            title="Questions investors ask before entering Ultramar"
            description="Clear answers help allocators, issuers, and search engines understand the relationship between the platform brand and the two product lines."
          />
          <div className="grid gap-4">
            {homeFaqs.map((item) => (
              <details
                key={item.question}
                className="group rounded border border-border/70 bg-card/70 p-5"
              >
                <summary className="cursor-pointer list-none font-serif text-2xl font-bold marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Operating model"
            title="One brand system, shared routes, product-specific workflows"
            description="Every product page answers what it is, who it serves, what workflow it owns, and where the other product fits."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Shared header and footer across every public route",
              "Canonical SEO on ultramar.capital only",
              "Legacy subdomains redirected into the mega app",
              "Product copy avoids presenting Capital as a third offer",
            ].map((item) => (
              <div key={item} className="rounded border border-border/70 bg-background p-5">
                <BriefcaseBusiness className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6">{value}</p>
    </div>
  );
}
