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

      <section className="relative overflow-hidden border border-border-muted bg-surface">
        <div className="hatch-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                {product.eyebrow} / Fund discipline
              </p>
              <h1 className="mt-4 max-w-4xl break-words font-serif text-4xl font-bold leading-[1.1] text-on-surface [overflow-wrap:anywhere] md:text-5xl">
                A Polymarket-first fund discipline for signals, exposure, and controls.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
                Compare event prices, review exposure, and enforce sizing controls.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-4">
              {overviewStats.map(([label, value]) => (
                <OverviewStat key={label} label={label} value={value} />
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
            </div>
          </aside>
        </div>
      </section>

      <ProductTabs product="arbitrage-hedge-fund" active="overview" />

      <section className="grid gap-1 bg-border-muted lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-surface p-6 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Product role
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
            Choose a workflow.
          </h2>
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
              <span className="mt-5 inline-flex font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-border-muted bg-surface p-6 md:p-8">
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
    <div className="bg-surface p-4">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-on-surface">{value}</p>
    </div>
  );
}
