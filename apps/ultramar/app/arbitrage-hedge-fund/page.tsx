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
import { ArrowRight, BarChart3, Gauge, Radar, Shield, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["arbitrage-hedge-fund"];
const description =
  "Polymarket-first arbitrage hedge fund infrastructure with signal monitoring, position exposure, and risk controls.";

const arbitrageFaqs = [
  {
    question: "What makes the Ultramar Arbitrage Hedge Fund Polymarket-first?",
    answer:
      "The v1 product focuses on Polymarket event-market dislocations, comparing market prices with derivatives-implied probabilities before turning persistent spreads into monitored signals.",
  },
  {
    question: "Does the fund product include risk controls?",
    answer:
      "Yes. The product surface exposes signal confidence, sizing, concentration, exposure, hedge policy, and failure modes so allocators can evaluate the control system next to the opportunity.",
  },
  {
    question: "Are lending markets and derivative arbitrage active products?",
    answer:
      "No. They remain research context until data quality, risk limits, and allocator language are complete enough to graduate into product surfaces.",
  },
];

const workflowItems = [
  {
    icon: BarChart3,
    title: "Signals",
    body: "Live spread board for Polymarket markets, theoretical values, and signal confidence.",
    href: "/arbitrage-hedge-fund/signals",
  },
  {
    icon: Gauge,
    title: "Dashboard",
    body: "Allocator-facing overview of active signals, positions, exposure, and guardrails.",
    href: "/arbitrage-hedge-fund/dashboard",
  },
  {
    icon: Shield,
    title: "Risk",
    body: "Sizing controls, concentration limits, hedge policy, and failure modes.",
    href: "/arbitrage-hedge-fund/risk",
  },
  {
    icon: Radar,
    title: "Research",
    body: "Non-commercial notes for future strategies and model extensions.",
    href: "/arbitrage-hedge-fund/research",
  },
];

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund",
  description,
  path: product.href,
  image: seoImages.arbitrage,
  keywords: ["Polymarket arbitrage", "prediction market hedge fund", "event market signals"],
});

export default function ArbitrageHedgeFundPage() {
  return (
    <main>
      <JsonLd
        id="arbitrage-hedge-fund-json-ld"
        data={[
          webPageJsonLd({ path: product.href, name: "Ultramar Arbitrage Hedge Fund", description }),
          serviceJsonLd({ product, serviceType: "Polymarket-first arbitrage fund" }),
          faqJsonLd(arbitrageFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: product.href },
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
                Arbitrage Hedge Fund, governed by signal discipline.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-background/75">
                A Polymarket-first fund surface that normalizes event-market
                prices against model probabilities, then exposes sizing,
                hedging, and failure modes before allocation.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/arbitrage-hedge-fund/signals"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-background bg-background px-5 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-transparent hover:text-background"
              >
                Open Signals
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/arbitrage-hedge-fund/risk"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-background/30 px-5 font-mono text-xs font-bold uppercase tracking-widest text-background transition hover:border-background hover:bg-background hover:text-foreground"
              >
                Review Risk
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <aside className="grid border-x border-b border-background/15 lg:border-l-0 lg:border-y">
            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[420px]">
              <Image
                src="/tarot-market.png"
                alt="Wheel of fortune market signal card"
                fill
                priority
                sizes="(min-width: 1024px) 47vw, 100vw"
                className="image-blackwork object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-foreground/50" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  Polymarket
                </span>
                <span className="border border-background/50 bg-foreground/55 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                  V1 scope
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-background/20 bg-foreground/80 backdrop-blur-sm">
                {[
                  ["Signal", "Spread"],
                  ["Sizing", "Governed"],
                  ["Risk", "Visible"],
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
            label="V1 scope"
            value="Polymarket"
            detail="No active lending or derivative arbitrage product in this release."
            icon={Target}
          />
          <MetricCard
            label="Signal model"
            value="Prob spread"
            detail="Prediction price versus derivatives-implied probability."
            icon={Radar}
          />
          <MetricCard
            label="Execution"
            value="Governed"
            detail="Sizing, exposure, and hedge controls before allocation."
            icon={Shield}
          />
        </div>
      </section>

      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-px bg-background/20 px-4 py-16 sm:px-6 lg:grid-cols-3">
          {[
            ["01", "Observe", "Compare event-market price against model context and derivatives-implied probability."],
            ["02", "Normalize", "Filter durable spreads from noise before signal confidence enters the board."],
            ["03", "Govern", "Expose sizing, concentration, hedge policy, and failure modes next to the opportunity."],
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
            eyebrow="Fund system"
            title="A single product with explicit research boundaries"
            description="The commercial product is the Polymarket-first Arbitrage Hedge Fund. Other arbitrage ideas can live in research until they graduate."
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
            title="Polymarket arbitrage memos for allocators"
            description="These pages support outreach around prediction-market arbitrage, signal construction, and event-market risk controls while linking back into the active fund workflow."
          />
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {researchArticles
              .filter((article) => article.cluster === "Polymarket arbitrage")
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
            eyebrow="Allocator SEO"
            title="How the Polymarket arbitrage product is framed"
            description="The page targets prediction-market arbitrage and hedge-fund risk language while keeping research-only strategies out of the commercial product."
          />
          <div className="grid gap-4">
            {arbitrageFaqs.map((item) => (
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

      <ProductCrosslink current="arbitrage-hedge-fund" />
    </main>
  );
}
