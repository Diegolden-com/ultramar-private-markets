import { JsonLd } from "@/components/json-ld";
import { ProductTabs } from "@/components/product-tabs";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  seoImages,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { productBySlug } from "@ultramar/product-model";
import { ArrowRight, FlaskConical, Gauge, LineChart, Shield } from "lucide-react";
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

const metrics = [
  ["Total AUM (USD)", "142,500,000.00"],
  ["Avg Spread Yield", "+4.2%", true],
  ["Signal Confidence (mu)", "0.892"],
  ["Active Markets", "124"],
] as const;

const signals = [
  ["2024 US Election Winner", "BIN/POLY", "62%", "1.4%", "Execute Long", "62"],
  ["Fed Rate Cut Nov", "RATES", "88%", "0.2%", "Monitor", "88"],
] as const;

const researchCards = [
  {
    status: "Alpha Draft",
    title: "Cross-Chain Yield Arbitrage on Layer 2 Bridges",
    body: "Evaluating systemic latency between optimistic rollups and mainnet state resolution. Preliminary data indicates a 15-second exploitable window during high-congestion epochs.",
    footer: "EST. CAPACITY: $5M",
    secondary: "STATUS: INGESTING",
    active: true,
  },
  {
    status: "Deprecated",
    title: "Fiat-Backed Stablecoin Depeg Vectors",
    body: "Model invalidated post-Q2 regulatory framework updates.",
    footer: "",
    secondary: "",
    active: false,
  },
] as const;

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund",
  description,
  path: product.href,
  image: seoImages.arbitrage,
  keywords: ["Polymarket arbitrage", "prediction market hedge fund", "event market signals"],
});

export default function ArbitrageHedgeFundPage() {
  return (
    <main className="terminal-grid mx-4 flex min-h-[calc(100vh-48px)] flex-col border-x border-border-muted bg-surface-ink text-on-surface md:mx-12">
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

      <section className="relative border-b border-border-muted p-6 md:p-8">
        <div className="hatch-pattern absolute inset-0 -z-0 opacity-20" />
        <div className="relative z-10">
          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-[1.1] text-on-surface md:text-5xl">
            Polymarket-first quantitative fund surface.
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="badge badge-outline bg-surface-container px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              System Status: Active
            </span>
            <span className="status status-success" />
          </div>
        </div>
      </section>

      <section className="stats stats-vertical grid grid-cols-1 border-b border-border-muted md:stats-horizontal md:grid-cols-4">
        {metrics.map(([label, value, signal], index) => (
          <div
            key={label}
            className={`stat flex flex-col gap-2 border-border-muted p-4 ${
              index === metrics.length - 1 ? "" : "md:border-r"
            } ${signal ? "bg-surface-container-low" : ""}`}
          >
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              {label}
            </span>
            <span
              className={`font-mono text-xl font-semibold ${signal ? "text-status-signal" : "text-on-surface"}`}
            >
              {value}
            </span>
          </div>
        ))}
      </section>

      <ProductTabs product="arbitrage-hedge-fund" active="overview" />

      <div className="flex flex-1 flex-col lg:flex-row">
        <section className="flex flex-col border-border-muted lg:w-2/3 lg:border-r">
          <div className="flex items-center justify-between border-b border-border-muted bg-surface p-4">
            <h2 className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
              <LineChart className="h-4 w-4" />
              Live Signals
            </h2>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Real-time
            </span>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-12 border-b border-border-muted bg-surface-container-low px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              <div className="col-span-4 md:col-span-3">Asset/Event</div>
              <div className="hidden md:col-span-2 md:block">Type</div>
              <div className="col-span-3 text-right md:col-span-2">Probability</div>
              <div className="col-span-2 text-right">Spread</div>
              <div className="col-span-3 text-right">Action</div>
            </div>
            {signals.map(([event, type, probability, spread, action, width]) => (
              <div
                key={event}
                className="grid grid-cols-12 items-center border-b border-border-muted px-4 py-3 font-mono text-sm font-medium transition-colors hover:bg-surface-container"
              >
                <div className="col-span-4 truncate pr-4 text-on-surface md:col-span-3">{event}</div>
                <div className="hidden text-on-surface-variant md:col-span-2 md:block">{type}</div>
                <div className="col-span-3 flex items-center justify-end gap-2 text-right md:col-span-2">
                  <div className="relative hidden h-1 w-16 bg-border-muted sm:block">
                    <div className="absolute left-0 top-0 h-full bg-status-signal" style={{ width: `${width}%` }} />
                  </div>
                  {probability}
                </div>
                <div className="col-span-2 text-right text-status-signal">{spread}</div>
                <div className="col-span-3 text-right">
                  <Link
                    href="/arbitrage-hedge-fund/signals"
                    className={`btn btn-xs font-mono text-[10px] uppercase transition-colors ${
                      action === "Monitor"
                        ? "btn-disabled cursor-not-allowed border-border-muted text-on-surface-variant"
                        : "btn-outline btn-success"
                    }`}
                  >
                    {action}
                  </Link>
                </div>
              </div>
            ))}

            <div className="border-b border-t border-t-status-signal border-b-border-muted bg-surface-container-low p-4">
              <div className="grid grid-cols-12 items-center font-mono text-sm font-medium">
                <div className="col-span-4 truncate pr-4 text-on-surface md:col-span-3">
                  ETH ETF Approval Timeline
                </div>
                <div className="hidden text-on-surface-variant md:col-span-2 md:block">CRYPTO/REG</div>
                <div className="col-span-3 flex items-center justify-end gap-2 md:col-span-2">
                  <div className="relative hidden h-1 w-16 bg-border-muted sm:block">
                    <div className="absolute left-0 top-0 h-full w-[45%] bg-status-signal" />
                  </div>
                  45%
                </div>
                <div className="col-span-2 text-right text-status-signal">8.5%</div>
                <div className="col-span-3 text-right">
                  <Link
                    href="/arbitrage-hedge-fund/risk"
                    className="btn btn-outline btn-success btn-xs font-mono text-[10px] uppercase"
                  >
                    Observe Anomaly
                  </Link>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-border-muted bg-surface p-3 font-mono text-[11px] font-medium leading-normal uppercase tracking-[0.08em] text-on-surface-variant">
                  <span className="mb-2 block text-on-surface">Normalization Vector</span>
                  Volatility cluster detected across 3 oracle feeds. Spread diverging from
                  historical mean by 2.4 sigma. Model suggests temporary liquidity vacuum.
                </div>
                <div className="hatch-pattern border border-border-muted bg-surface p-3 font-mono text-[11px] font-medium leading-normal uppercase tracking-[0.08em] text-on-surface-variant">
                  <span className="mb-2 block text-on-surface">Governance Lock</span>
                  Execution suspended pending secondary qualitative review. Allocation size exceeds
                  auto-routing threshold.
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col bg-surface-dim lg:w-1/3">
          <div className="flex items-center justify-between border-b border-border-muted p-4">
            <h2 className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
              <FlaskConical className="h-4 w-4" />
              Research Backlog
            </h2>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {researchCards.map((card) => (
              <Link
                key={card.title}
                href="/arbitrage-hedge-fund/research"
                className={`card card-border bg-surface p-4 transition-colors ${
                  card.active
                    ? "hover:border-status-signal"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                      card.active ? "text-status-signal" : "text-on-surface-variant"
                    }`}
                  >
                    {card.status}
                  </span>
                  <span className={`h-2 w-2 border ${card.active ? "border-white" : "border-border-muted"}`} />
                </div>
                <h3
                  className={`mt-3 font-serif text-2xl font-semibold leading-tight text-on-surface ${
                    card.active ? "" : "line-through"
                  }`}
                >
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-normal text-on-surface-variant">{card.body}</p>
                {card.footer ? (
                  <div className="mt-4 flex justify-between border-t border-border-muted pt-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    <span>{card.footer}</span>
                    <span>{card.secondary}</span>
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
          <div className="mt-auto grid grid-cols-2 border-t border-border-muted">
            <Link
              href="/arbitrage-hedge-fund/signals"
              className="flex items-center gap-2 border-r border-border-muted p-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
            >
              <Gauge className="h-4 w-4" />
              Signals
            </Link>
            <Link
              href="/arbitrage-hedge-fund/risk"
              className="flex items-center gap-2 p-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
            >
              <Shield className="h-4 w-4" />
              Risk
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
