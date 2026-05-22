import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { ProductTabs } from "@/components/product-tabs";
import {
  averageAbsoluteSpread,
  samplePositions,
  sampleSignals,
  totalExposure,
} from "@/lib/arbitrage";
import { productRouteGroups } from "@/lib/site-navigation";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { productBySlug } from "@ultramar/product-model";
import {
  ArrowRight,
  BarChart3,
  CircleSlash,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  LineChart,
  Radar,
  Shield,
  Timer,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["arbitrage-hedge-fund"];
const description =
  "A Polymarket-first arbitrage fund overview that explains signal discovery, probability comparison, position exposure, sizing controls, and research boundaries.";

const arbitrageFaqs = [
  {
    question: "What is the Arbitrage Hedge Fund overview for?",
    answer:
      "The overview explains the product workflow and routes allocators to the dashboard, signal board, risk controls, and research backlog before they evaluate deeper pages.",
  },
  {
    question: "What makes the product Polymarket-first?",
    answer:
      "The active v1 product focuses on Polymarket event-market dislocations, comparing market prices with model or derivatives-informed probabilities before turning persistent spreads into monitored signals.",
  },
  {
    question: "Are lending markets and derivative arbitrage active products?",
    answer:
      "No. They remain research context until data quality, risk limits, and allocator language are complete enough to graduate into product surfaces.",
  },
];

const routeCards = productRouteGroups["arbitrage-hedge-fund"].links.filter(
  (route) => route.key !== "overview",
);

const workflowItems = [
  {
    icon: Radar,
    title: "Observe Polymarket events",
    body: "The signal board keeps market, venue, update timing, status, and spread visibility together so event-market dislocations can be reviewed.",
    href: "/arbitrage-hedge-fund/signals",
    cta: "Open signals",
  },
  {
    icon: LineChart,
    title: "Compare probabilities",
    body: "Event prices are compared with repeatable probability models so the product can separate durable dislocations from raw market interest.",
    href: "/arbitrage-hedge-fund/signals",
    cta: "Review comparison",
  },
  {
    icon: WalletCards,
    title: "Connect signals to exposure",
    body: "The dashboard connects observed opportunities to position sizing, notional exposure, stale-signal awareness, and allocator-facing review.",
    href: "/arbitrage-hedge-fund/dashboard",
    cta: "Open dashboard",
  },
  {
    icon: Shield,
    title: "Constrain with risk controls",
    body: "Sizing, liquidity, hedge discipline, venue concentration, resolution ambiguity, and model drift determine whether a signal can graduate.",
    href: "/arbitrage-hedge-fund/risk",
    cta: "Review risk",
  },
] as const;

const scopeItems = [
  {
    icon: Radar,
    title: "Polymarket arbitrage",
    status: "Active product",
    body: "Current product surface for event-market probability dislocations, monitored signals, exposure, and controls.",
  },
  {
    icon: FlaskConical,
    title: "Lending markets",
    status: "Research only",
    body: "Potential future yield and capital-efficiency module, not marketed as an active fund product in this release.",
  },
  {
    icon: BarChart3,
    title: "Derivative arbitrage",
    status: "Research only",
    body: "Derivatives can inform probability models and hedging assumptions, but derivative-only strategies stay outside v1 product scope.",
  },
  {
    icon: ClipboardCheck,
    title: "Graduation rule",
    status: "Governance",
    body: "A strategy only becomes product surface after data quality, risk limits, and allocator language are complete enough for review.",
  },
] as const;

const avgSpread = averageAbsoluteSpread(sampleSignals);
const exposure = totalExposure(samplePositions);
const overviewStats = [
  ["Sample Signals", sampleSignals.length.toString(), "Fallback signal board observations"],
  ["Avg Spread", `${(avgSpread * 100).toFixed(1)}%`, "Average absolute observed spread"],
  [
    "Sample Exposure",
    `$${exposure.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    "Fallback position exposure shown in product demos",
  ],
  ["Product Boundary", "V1", "Polymarket-first, research-gated expansion"],
] as const;

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Overview",
  description,
  path: product.href,
  image: seoImages.arbitrage,
  keywords: ["Polymarket arbitrage", "prediction market hedge fund", "event market signals"],
});

export default function ArbitrageHedgeFundPage() {
  return (
    <>
      <JsonLd
        id="arbitrage-hedge-fund-json-ld"
        data={[
          webPageJsonLd({ path: product.href, name: "Ultramar Arbitrage Hedge Fund", description }),
          serviceJsonLd({ product, serviceType: "Polymarket-first arbitrage fund" }),
          itemListJsonLd({
            path: product.href,
            name: "Ultramar Arbitrage Hedge Fund route map",
            description: "The public routes that explain the fund workflow.",
            items: routeCards.map((route) => ({
              name: route.label,
              url: route.href,
              description: route.description ?? "",
            })),
          }),
          faqJsonLd(arbitrageFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: product.href },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border border-border-muted bg-surface">
        <div className="hatch-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                {product.eyebrow} / Overview
              </p>
              <h1 className="mt-4 max-w-4xl break-words font-serif text-4xl font-bold leading-[1.1] text-on-surface [overflow-wrap:anywhere] md:text-5xl">
                A Polymarket-first fund workflow for signals, exposure, and controls.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
                The product compares event-market prices with probability models, watches durable
                spreads, connects them to position exposure, and keeps sizing constrained by risk.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-4">
              {overviewStats.map(([label, value, body]) => (
                <OverviewStat key={label} label={label} value={value} body={body} />
              ))}
            </div>
          </div>

          <aside className="relative min-h-[360px] overflow-hidden border border-border-muted bg-surface-ink">
            <Image
              src="/tarot-market.png"
              alt="Event-market signal visualization"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="image-blackwork object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-surface-ink/35" />
            <div className="absolute inset-x-0 bottom-0 border-t border-border-muted bg-surface-ink/90 p-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Active commercial scope
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-on-surface">
                Polymarket dislocation monitoring
              </h2>
              <p className="mt-3 text-sm leading-5 text-on-surface-variant">
                Research can inform the model, but the v1 product surface stays centered on
                Polymarket signals and allocator-visible controls.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <ProductTabs product="arbitrage-hedge-fund" active="overview" />

      <section className="grid gap-1 bg-border-muted lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-surface p-6 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Product job
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
            Turn market dislocations into reviewable fund signals.
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            The overview is the allocator orientation layer. It explains what the fund observes, how
            probability comparisons become signals, where exposure is reviewed, and why risk
            controls sit beside the opportunity.
          </p>
        </div>

        <div className="grid gap-1 bg-border-muted md:grid-cols-2">
          {workflowItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-surface p-5 transition-colors hover:bg-surface-container"
            >
              <div className="flex items-start justify-between gap-4">
                <item.icon className="h-5 w-5 text-status-signal" />
                <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-1 group-hover:text-status-signal" />
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.body}</p>
              <span className="mt-5 inline-flex font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-1 bg-border-muted lg:grid-cols-[1fr_1fr]">
        <div className="bg-surface">
          <div className="border-b border-border-muted p-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Route map
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
              What each fund page is for.
            </h2>
          </div>
          <div className="grid">
            {routeCards.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group grid gap-3 border-b border-border-muted p-4 transition-colors last:border-b-0 hover:bg-surface-container md:grid-cols-[120px_1fr_auto]"
              >
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {route.label}
                </span>
                <span className="text-sm leading-5 text-on-surface-variant">
                  {route.description}
                </span>
                <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-1 group-hover:text-status-signal" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-surface">
          <div className="border-b border-border-muted p-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Scope boundary
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
              Research context is not the same as product scope.
            </h2>
          </div>
          <div className="grid">
            {scopeItems.map((item) => (
              <div
                key={item.title}
                className="grid gap-4 border-b border-border-muted p-4 last:border-b-0 md:grid-cols-[auto_1fr_auto]"
              >
                <item.icon className="h-5 w-5 text-status-signal" />
                <div>
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.body}</p>
                </div>
                <span className="h-fit border border-border-muted bg-surface-ink px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-surface p-6 md:p-8">
          <Gauge className="h-5 w-5 text-status-warning" />
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-on-surface">
            Sizing is a governance decision, not a button.
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            A visible spread can remain in monitoring until liquidity, persistence, hedge context,
            concentration, and event-resolution language are strong enough for review.
          </p>
        </div>
        <div className="grid gap-1 bg-border-muted md:grid-cols-3">
          {[
            ["Signal confidence", "Spread quality and model confidence determine whether a market stays monitored or progresses to sizing."],
            ["Exposure controls", "Notional exposure, venue concentration, and stale-signal risk stay visible beside the opportunity."],
            ["Failure modes", "Oracle delay, ambiguous resolution, liquidity gaps, and model drift are treated as product risks."],
          ].map(([title, body]) => (
            <div key={title} className="bg-surface p-5">
              {title === "Failure modes" ? (
                <CircleSlash className="h-5 w-5 text-status-warning" />
              ) : title === "Exposure controls" ? (
                <WalletCards className="h-5 w-5 text-status-warning" />
              ) : (
                <Timer className="h-5 w-5 text-status-warning" />
              )}
              <h3 className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection
        eyebrow="Arbitrage FAQ"
        title="How to read the fund overview"
        description="The answers below match the FAQPage structured data and keep research-only strategies separate from active product scope."
        items={arbitrageFaqs}
      />

      <ProductCrosslink current="arbitrage-hedge-fund" />
    </>
  );
}

function OverviewStat({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="bg-surface p-4">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-on-surface">{value}</p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{body}</p>
    </div>
  );
}
