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
  "Ultramar.capital is the institutional surface for Private Equities and a Polymarket-first Arbitrage Hedge Fund.";

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

const manifestoItems = [
  {
    label: "01",
    title: "Private Equities, uncompromised.",
    body: "Issuer data, eligibility, asset context, and portfolio state sit inside one controlled rail.",
  },
  {
    label: "02",
    title: "Arbitrage without theater.",
    body: "The fund surface exposes signals, confidence, exposure, and risk language before allocation.",
  },
  {
    label: "03",
    title: "One canonical institution.",
    body: "Capital is the platform layer. The products stay legible, separate, and internally linked.",
  },
];

const operatingModel = [
  "Shared header and footer across every public route",
  "Canonical SEO on ultramar.capital only",
  "Legacy subdomains redirected into the mega app",
  "Product copy avoids presenting Capital as a third offer",
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

      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="blackwork-hatch absolute inset-0 opacity-[0.08]" />
        <div className="financial-grid absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl gap-0 px-4 py-10 sm:px-6 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="flex flex-col justify-between border-x border-background/15 px-5 py-8 sm:px-8 lg:py-12 lg:pr-12">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-background/60">
                Ultramar.capital / Institutional capital interface
              </p>
              <h1 className="mt-8 max-w-4xl break-words font-serif text-4xl font-bold leading-[0.9] [overflow-wrap:anywhere] sm:text-7xl lg:text-8xl">
                Ultramar.capital
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-background/75 sm:text-xl">
                Private-market rails and Polymarket-first fund infrastructure,
                governed through one spare, auditable, institutional surface.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div className="border-l border-background/25 pl-5">
                <p className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">
                  Private Equities, uncompromised.
                </p>
                <p className="mt-4 max-w-xl text-sm leading-6 text-background/60">
                  The phrase that worked stays as the organizing principle:
                  clean private access, visible controls, no marketplace noise.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/private-equities"
                  className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-background bg-background px-5 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-transparent hover:text-background"
                >
                  Private Equities
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/arbitrage-hedge-fund"
                  className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-background/30 px-5 font-mono text-xs font-bold uppercase tracking-widest text-background transition hover:border-background hover:bg-background hover:text-foreground"
                >
                  Arbitrage Fund
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <aside className="grid border-x border-b border-background/15 lg:border-l-0 lg:border-y">
            <div className="relative min-h-[240px] overflow-hidden border-b border-background/15 sm:min-h-[320px]">
              <Image
                src="/abstract-financial-growth-chart-geometric-shapes.jpg"
                alt="Institutional market geometry"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="image-blackwork object-cover opacity-[0.78]"
              />
              <div className="absolute inset-0 bg-foreground/50" />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-background/20 bg-foreground/75 text-background backdrop-blur-sm">
                {["Issuer", "Oracle", "Portfolio"].map((label) => (
                  <div key={label} className="border-r border-background/20 p-4 last:border-r-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-background/50">
                      Rail
                    </p>
                    <p className="mt-2 text-sm font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden bg-background text-foreground sm:grid sm:grid-cols-2">
              {products.map((product, index) => {
                const Icon = productIcons[product.slug];
                return (
                  <Link
                    key={product.slug}
                    href={product.href}
                    className="group min-h-56 border-b border-foreground/15 p-5 transition hover:bg-foreground hover:text-background sm:border-b-0 sm:border-r sm:last:border-r-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground group-hover:text-background/60">
                        0{index + 1} / {product.eyebrow}
                      </p>
                      <Icon className="h-5 w-5 text-accent group-hover:text-background" />
                    </div>
                    <h2 className="mt-12 font-serif text-3xl font-bold leading-none">
                      {product.name}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground group-hover:text-background/65">
                      {product.shortDescription}
                    </p>
                  </Link>
                );
              })}
            </div>
          </aside>
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
        <div className="financial-grid absolute inset-0 opacity-[0.35]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Products"
            title="Two operating surfaces for capital"
            description="Private Equities and Arbitrage Hedge Fund remain the only product choices. Shared navigation keeps context visible across both."
          />
          <div className="mt-12 grid gap-px bg-border lg:grid-cols-2">
            {products.map((product, index) => (
              <Link
                key={product.slug}
                href={product.href}
                className="group grid bg-background transition hover:bg-card md:grid-cols-[0.88fr_1.12fr]"
              >
                <div className="relative min-h-72 overflow-hidden border-b border-border md:border-b-0 md:border-r">
                  <Image
                    src={productImages[product.slug]}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    className="image-blackwork object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-foreground/20" />
                  <span className="absolute left-4 top-4 bg-foreground px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex min-h-[360px] flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
                      {product.eyebrow}
                    </p>
                    {(() => {
                      const Icon = productIcons[product.slug];
                      return <Icon className="h-5 w-5 text-accent" />;
                    })()}
                  </div>
                  <h2 className="mt-5 font-serif text-4xl font-bold leading-none sm:text-5xl">
                    {product.name}
                  </h2>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-auto grid gap-4 border-t border-border pt-6">
                    <ProductFact label="For" value={product.audience} />
                    <ProductFact label="Problem" value={product.problem} />
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
                    {product.primaryCta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-background/50">
                Private-market visual system
              </p>
              <h2 className="mt-4 font-serif text-5xl font-bold leading-none sm:text-7xl">
                Operating assets
              </h2>
            </div>
            <Link
              href="/private-equities/assets"
              className="group inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-background/60 transition hover:text-background"
            >
              View assets
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px bg-background/20 md:grid-cols-3">
            {deals.slice(0, 3).map((deal, index) => (
              <Link
                key={deal.id}
                href={`/private-equities/assets/${deal.ticker}`}
                className={`group relative block overflow-hidden bg-foreground transition ${
                  index === 0 ? "min-h-[520px] md:col-span-2 md:row-span-2" : "min-h-[260px]"
                }`}
              >
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 768px) 66vw, 100vw"
                      : "(min-width: 768px) 33vw, 100vw"
                  }
                  className="image-blackwork object-cover opacity-80 transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-foreground/30" />
                <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    {deal.ticker}
                  </span>
                  <span className="border border-background/50 bg-foreground/50 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                    {deal.type}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-7">
                  <p className="font-serif text-2xl font-bold leading-tight text-background md:text-3xl">
                    {deal.name}
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-background/70">
                    {deal.description}
                  </p>
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
          <div className="mt-10 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
            {researchArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/research/${article.slug}`}
                className="group flex min-h-72 flex-col bg-background p-5 transition hover:bg-foreground hover:text-background"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent group-hover:text-background">
                  {article.cluster}
                </p>
                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">
                  {article.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground group-hover:text-background/65">
                  {article.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent group-hover:text-background">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.38em] text-accent">
              Operating philosophy
            </p>
            <h2 className="mt-8 font-serif text-5xl font-bold leading-none sm:text-7xl">
              Governed, spare, visible.
            </h2>
          </div>
          <div className="grid gap-px bg-border">
            {manifestoItems.map((item) => (
              <div key={item.label} className="grid gap-5 bg-background p-6 sm:grid-cols-[96px_1fr]">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  {item.label}
                </p>
                <div>
                  <h3 className="font-serif text-3xl font-bold leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
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
              <details key={item.question} className="group rounded border border-border/70 bg-card/70 p-5">
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
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {operatingModel.map((item) => (
              <div key={item} className="bg-background p-5">
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
