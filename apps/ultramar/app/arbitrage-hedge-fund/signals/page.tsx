import { JsonLd } from "@/components/json-ld";
import { ProductTabs } from "@/components/product-tabs";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import {
  averageAbsoluteSpread,
  samplePositions,
  sampleSignals,
  totalExposure,
  type Position,
  type Signal,
} from "@/lib/arbitrage";
import { Bolt, CircleSlash, Timer } from "lucide-react";

const signalsPath = "/arbitrage-hedge-fund/signals";
const description =
  "Monitor Polymarket arbitrage signals with implied probabilities, model probabilities, spread confidence, and product-scope boundaries.";

const signalBoardItems = [
  {
    title: "Market observation",
    body: "The board keeps active and monitored Polymarket events in one place, with venue, update timing, and signal status visible beside each market.",
    href: `${signalsPath}#market-observation`,
  },
  {
    title: "Probability comparison",
    body: "Implied prices are compared with model probabilities so the fund can separate raw event interest from durable dislocation candidates.",
    href: `${signalsPath}#probability-comparison`,
  },
  {
    title: "Confidence language",
    body: "Signals graduate from monitoring to sizing only when spread persistence, liquidity, and comparison quality support allocator-facing confidence.",
    href: `${signalsPath}#confidence-language`,
  },
  {
    title: "Product boundary",
    body: "Lending markets and derivative-only strategies stay out of the active surface until they have risk limits and allocator language.",
    href: `${signalsPath}#product-boundary`,
  },
];

const signalFaqs = [
  {
    question: "What does the Ultramar signal board measure?",
    answer:
      "It measures Polymarket event prices against model probabilities, then exposes spread, confidence, status, and update timing so dislocations can be reviewed before sizing.",
  },
  {
    question: "Is every spread an active trade?",
    answer:
      "No. A spread can remain in monitoring until persistence, liquidity, hedge context, and event-resolution language are strong enough to support a fund signal.",
  },
  {
    question: "Why does the page mention derivatives if the product is Polymarket-first?",
    answer:
      "Derivatives can inform probability models and hedge assumptions, but derivative-only strategies are research context rather than active commercial product scope in v1.",
  },
];

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Signals",
  description,
  path: signalsPath,
  image: seoImages.arbitrage,
  keywords: [
    "Polymarket signals",
    "prediction market arbitrage",
    "event market signal board",
    "event-market mispricing",
    "derivatives-implied probability",
  ],
});

export default async function SignalsPage() {
  const [signals, positions] = await Promise.all([
    fetchBackend<Signal[]>("/signals", sampleSignals),
    fetchBackend<Position[]>("/positions", samplePositions),
  ]);
  const avgSpread = averageAbsoluteSpread(signals);
  const exposure = totalExposure(positions);
  const exposureMetrics = [
    ["Signals", signals.length.toString(), "plain"],
    ["Avg Spread", avgSpread.toFixed(3), "signal"],
    [
      "Exposure",
      `$${exposure.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      "plain",
    ],
    ["Active Positions", positions.length.toString(), "signal"],
  ] as const;

  return (
    <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="arbitrage-signals-json-ld"
        data={[
          webPageJsonLd({
            path: signalsPath,
            name: "Ultramar Arbitrage Hedge Fund Signals",
            description,
          }),
          itemListJsonLd({
            path: signalsPath,
            name: "Polymarket signal board components",
            description:
              "The signal disciplines used to inspect prediction-market dislocations before position sizing.",
            items: signalBoardItems.map((item) => ({
              name: item.title,
              url: item.href,
              description: item.body,
            })),
          }),
          faqJsonLd(signalFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: "/arbitrage-hedge-fund" },
            { name: "Signals", path: signalsPath },
          ]),
        ]}
      />

      <header className="mt-4 flex flex-col justify-between gap-6 border-b border-border-muted pb-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-3xl font-semibold leading-tight text-on-surface">
            Arbitrage Operations
          </h1>
          <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Live Risk & Signal Feed // System V4.2
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-start md:items-end">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Market Status
            </span>
            <span className="badge badge-outline badge-success gap-1 font-mono text-sm font-medium">
              <span className="status status-success" />
              Open
            </span>
          </div>
          <div className="border-l border-border-muted pl-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Last Update
            </span>
            <span className="block font-mono text-sm font-medium text-on-surface">14:02:44 UTC</span>
          </div>
        </div>
      </header>

      <ProductTabs product="arbitrage-hedge-fund" active="signals" />

      <section className="stats stats-vertical grid grid-cols-1 gap-1 border border-border-muted bg-border-muted md:stats-horizontal md:grid-cols-4">
        {exposureMetrics.map(([label, value, tone]) => (
          <div
            key={label}
            className={`stat min-h-[100px] bg-surface p-4 ${tone === "signal" ? "border-t border-status-signal" : ""}`}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                {label}
              </span>
            </div>
            <div
              className={`mt-4 font-mono text-xl font-semibold ${
                tone === "signal" ? "text-status-signal" : "text-on-surface"
              }`}
            >
              {value}
            </div>
          </div>
        ))}
      </section>

      <section className="card card-border overflow-x-auto bg-border-muted">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1fr_1fr] gap-1 bg-surface-container">
            {["Asset / Event", "Type", "Impl Prob", "Model Prob", "Spread vs Impl", "Confidence", "Status"].map(
              (label) => (
                <div
                  key={label}
                  className="bg-surface p-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant"
                >
                  {label}
                </div>
              ),
            )}
          </div>

          {signals.map((signal) => {
            const row = toSignalRow(signal);
            const Icon = row.icon;
            return (
              <div
                key={row.event}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1fr_1fr] gap-1 bg-surface-container transition-colors hover:bg-surface-variant ${
                  row.state === "inactive" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-2 bg-surface p-3 font-mono text-sm font-medium text-on-surface">
                  <Icon
                    className={`h-4 w-4 ${
                      row.state === "live" ? "text-status-signal" : "text-on-surface-variant"
                    }`}
                  />
                  {row.event}
                </div>
                <div className="flex items-center bg-surface p-3 font-mono text-sm font-medium text-on-surface-variant">
                  {row.type}
                </div>
                <div className="flex items-center justify-end bg-surface p-3 font-mono text-sm font-medium text-on-surface">
                  {row.implied}
                </div>
                <div
                  className={`flex items-center justify-end bg-surface p-3 font-mono text-sm font-bold ${
                    row.state === "live" ? "text-status-signal" : "text-on-surface"
                  }`}
                >
                  {row.model}
                </div>
                <div className="flex flex-col justify-center gap-1 bg-surface p-3 font-mono text-sm font-medium">
                  <span className={row.spread.startsWith("-") ? "text-destructive" : "text-status-signal"}>
                    {row.spread}
                  </span>
                  <progress
                    className={`progress h-[2px] w-full bg-surface-variant ${
                      row.spread.startsWith("-") ? "progress-error opacity-50" : "progress-success"
                    }`}
                    value={Number.parseFloat(row.width)}
                    max={100}
                  />
                </div>
                <div className="flex items-center bg-surface p-3 font-mono text-sm font-medium text-on-surface">
                  {row.confidence}
                </div>
                <div className="flex items-center gap-2 bg-surface p-3">
                  <span
                    className={`h-2 w-2 ${
                      row.state === "live"
                        ? "bg-status-signal"
                        : row.state === "pending"
                          ? "hatch-pattern border border-on-surface-variant"
                          : "border border-on-surface bg-transparent"
                    }`}
                  />
                  <span className="badge badge-outline badge-sm font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    {row.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

async function fetchBackend<T>(path: string, fallback: T): Promise<T> {
  if (!baseUrl) return fallback;

  try {
    const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const data = (await response.json()) as T;
    return Array.isArray(data) && data.length === 0 ? fallback : data;
  } catch {
    return fallback;
  }
}

function toSignalRow(signal: Signal) {
  const state =
    signal.status === "Active" ? "live" : signal.status === "Sizing" ? "pending" : "inactive";
  return {
    event: signal.market,
    type: signal.venue,
    implied: formatProb(signal.impliedProb),
    model: formatProb(signal.theoreticalProb),
    spread: `${signal.spread > 0 ? "+" : ""}${(signal.spread * 100).toFixed(1)}%`,
    confidence: signal.confidence,
    status: signal.status,
    state,
    width: `${Math.min(Math.max(Math.abs(signal.spread) * 1000, 8), 100)}%`,
    icon: state === "live" ? Bolt : state === "pending" ? Timer : CircleSlash,
  };
}

function formatProb(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
