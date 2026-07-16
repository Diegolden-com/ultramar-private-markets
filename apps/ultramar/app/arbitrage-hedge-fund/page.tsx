import { JsonLd } from "@/components/json-ld";
import { ProductTabs } from "@/components/product-tabs";
import {
  averageAbsoluteSpread,
  samplePositions,
  sampleSignals,
  totalExposure,
} from "@/lib/arbitrage";
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
  Gauge,
  LineChart,
  Radar,
  Shield,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["arbitrage-hedge-fund"];
const description =
  "A Polymarket-first arbitrage fund overview that explains signal discovery, probability comparison, position exposure, sizing controls, and research boundaries.";

const arbitrageFaqs = [
  {
    question: "What does the Arbitrage Hedge Fund evaluate?",
    answer:
      "The fund evaluates Polymarket event prices against repeatable probability models, then reviews exposure, sizing, liquidity, and resolution risk before allocation.",
  },
  {
    question: "What makes the product Polymarket-first?",
    answer:
      "The active v1 product focuses on Polymarket event-market dislocations, comparing market prices with model or derivatives-informed probabilities before turning persistent spreads into monitored signals.",
  },
  {
    question: "Are lending markets and derivative arbitrage active products?",
    answer:
      "No. They remain research context until data quality, risk limits, and allocator language are complete enough for investment review.",
  },
];

const workflowItems = [
  {
    icon: Radar,
    title: "Observe Polymarket events",
    href: "/arbitrage-hedge-fund/signals",
    cta: "Open signals",
  },
  {
    icon: LineChart,
    title: "Compare probabilities",
    href: "/arbitrage-hedge-fund/signals",
    cta: "Review comparison",
  },
  {
    icon: WalletCards,
    title: "Connect signals to exposure",
    href: "/arbitrage-hedge-fund/dashboard",
    cta: "Open dashboard",
  },
  {
    icon: Shield,
    title: "Constrain with risk controls",
    href: "/arbitrage-hedge-fund/risk",
    cta: "Review risk",
  },
] as const;

const avgSpread = averageAbsoluteSpread(sampleSignals);
const exposure = totalExposure(samplePositions);
const overviewStats = [
  ["Reference Signals", sampleSignals.length.toString()],
  ["Avg Spread", `${(avgSpread * 100).toFixed(1)}%`],
  [
    "Modeled Exposure",
    `$${exposure.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
  ],
  ["Product Boundary", "V1"],
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
            name: "Ultramar Arbitrage Hedge Fund areas",
            description: "The core fund areas allocators can review.",
            items: workflowItems.map((item) => ({
              name: item.title,
              url: item.href,
              description: item.cta,
            })),
          }),
          faqJsonLd(arbitrageFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: product.href },
          ]),
        ]}
      />

      <section className="card card-border relative overflow-hidden bg-surface">
        <div className="hatch-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:p-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="badge badge-outline badge-info h-auto min-h-6 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]">
                {product.eyebrow} / Fund discipline
              </p>
              <h1 className="mt-6 max-w-[18ch] break-words text-balance font-serif text-4xl font-bold leading-[1.02] text-on-surface [overflow-wrap:anywhere] sm:text-5xl lg:text-[3.5rem]">
                A Polymarket-first fund discipline for signals, exposure, and controls.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                Compare event prices, review exposure, and enforce sizing controls.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-px border border-border-muted bg-border-muted xl:grid-cols-4">
              {overviewStats.map(([label, value]) => (
                <OverviewStat key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <aside className="card card-border relative min-h-[280px] overflow-hidden bg-surface-ink sm:min-h-[360px] lg:min-h-[420px]">
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
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary">
                Active commercial scope
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-on-surface">
                Polymarket dislocation monitoring
              </h2>
            </div>
          </aside>
        </div>
      </section>

      <ProductTabs product="arbitrage-hedge-fund" active="overview" />

      <section className="grid gap-3 md:gap-4 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="card card-border bg-surface p-6 sm:p-7 lg:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary">
            Product role
          </p>
          <h2 className="mt-4 max-w-[12ch] font-serif text-3xl font-semibold leading-[1.08] text-on-surface sm:text-4xl">
            Choose a workflow.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
          {workflowItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card card-border group min-h-[210px] bg-surface p-6 transition-colors hover:border-primary hover:bg-surface-container-low"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center border border-border-muted bg-surface-container-low">
                  <item.icon className="h-5 w-5 text-primary" />
                </span>
                <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:text-primary" />
              </div>
              <h3 className="mt-6 max-w-[16ch] font-serif text-2xl font-semibold leading-[1.12] text-on-surface">
                {item.title}
              </h3>
              <span className="mt-auto inline-flex pt-6 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-primary sm:text-[11px]">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="alert alert-warning card card-border block bg-surface p-6 text-on-surface-variant sm:p-7 lg:p-8">
          <Gauge className="h-5 w-5 text-status-warning" />
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-on-surface">
            Signals do not size themselves.
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            Liquidity, persistence, concentration, resolution, and model drift constrain exposure.
          </p>
      </section>
    </>
  );
}

function OverviewStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat min-w-0 bg-surface p-4 sm:p-5">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="stat-value mt-2 break-words font-mono text-lg font-semibold leading-tight text-on-surface sm:text-xl">{value}</p>
    </div>
  );
}
