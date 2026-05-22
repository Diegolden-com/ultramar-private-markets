import { FaqSection } from "@/components/faq-section";
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
import { AlertTriangle, Lock, ShieldCheck } from "lucide-react";

const riskPath = "/arbitrage-hedge-fund/risk";
const description =
  "Understand sizing, exposure, hedge, liquidity, resolution, and model-drift controls for the Polymarket-first Arbitrage Hedge Fund.";

const riskControlItems = [
  {
    title: "Sizing policy",
    body: "Signal sizing is capped by confidence, market liquidity, maximum drawdown tolerance, and venue concentration.",
    href: `${riskPath}#sizing-policy`,
  },
  {
    title: "Exposure monitoring",
    body: "The dashboard tracks notional exposure, spread persistence, active positions, and stale signal risk.",
    href: `${riskPath}#exposure-monitoring`,
  },
  {
    title: "Hedge discipline",
    body: "Derivatives data informs probabilities and hedges but is not marketed as a separate active product in v1.",
    href: `${riskPath}#hedge-discipline`,
  },
  {
    title: "Failure modes",
    body: "Controls must account for oracle delay, market resolution ambiguity, venue liquidity, and model drift.",
    href: `${riskPath}#failure-modes`,
  },
];

const riskFaqs = [
  {
    question: "What is the core risk rule for the arbitrage fund?",
    answer:
      "A signal is not sized only because a spread exists. Sizing is constrained by confidence, liquidity, drawdown tolerance, venue concentration, hedge context, and event-resolution risk.",
  },
  {
    question: "How does Ultramar handle model drift?",
    answer:
      "The risk workflow treats model drift as a failure mode that has to be monitored beside stale signals, liquidity changes, and ambiguous event resolution.",
  },
  {
    question: "Why keep research strategies separate from risk-controlled product scope?",
    answer:
      "Research strategies should graduate only after data quality, risk limits, and allocator-facing language are complete enough to withstand review.",
  },
];

const parameterGroups = [
  {
    id: "sizing-policy",
    title: "Sizing Parameters",
    signal: true,
    active: false,
    rows: [
      ["Max Gross Exposure", "350%"],
      ["Max Net Exposure", "+/-15%"],
      ["Single Position Limit", "2.5% NAV"],
    ],
  },
  {
    id: "exposure-monitoring",
    title: "Liquidity Thresholds",
    signal: false,
    active: false,
    rows: [
      ["Days to Liquidate (90%)", "< 3 Days"],
      ["ADV Participation Cap", "15%"],
    ],
  },
  {
    id: "hedge-discipline",
    title: "Hedge Policy",
    signal: false,
    active: true,
    rows: [
      ["Beta Correlation Target", "+/-0.05"],
      ["Factor Neutrality Deviation", "< 2 sigma"],
    ],
  },
] as const;

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Risk",
  description,
  path: riskPath,
  image: seoImages.arbitrage,
  keywords: [
    "hedge fund risk controls",
    "Polymarket risk",
    "arbitrage sizing",
    "event-market arbitrage risk",
    "model drift controls",
  ],
});

export default function RiskPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="arbitrage-risk-json-ld"
        data={[
          webPageJsonLd({
            path: riskPath,
            name: "Ultramar Arbitrage Hedge Fund Risk",
            description,
          }),
          itemListJsonLd({
            path: riskPath,
            name: "Polymarket arbitrage risk controls",
            description:
              "Sizing, exposure, hedge, and failure-mode controls for the Polymarket-first fund surface.",
            items: riskControlItems.map((item) => ({
              name: item.title,
              url: item.href,
              description: item.body,
            })),
          }),
          faqJsonLd(riskFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: "/arbitrage-hedge-fund" },
            { name: "Risk", path: riskPath },
          ]),
        ]}
      />

      <header className="mb-1 border-b border-border-muted pb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Module // Risk_Ctrl_01
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] text-on-surface md:text-5xl">
              Arbitrage Risk Controls
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="badge badge-outline badge-success flex items-center gap-2 bg-surface px-3 py-1">
              <span className="status status-success" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                System Active
              </span>
            </div>
            <div className="badge badge-outline flex items-center gap-2 bg-surface px-3 py-1">
              <Lock className="h-4 w-4 text-on-surface-variant" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                Secure Env
              </span>
            </div>
          </div>
        </div>
      </header>

      <ProductTabs product="arbitrage-hedge-fund" active="risk" />

      <div className="mt-1 grid grid-cols-1 gap-1 border border-border-muted bg-border-muted md:grid-cols-12">
        <aside className="flex flex-col gap-1 md:col-span-4">
          {parameterGroups.map((group) => (
            <section
              key={group.title}
              id={group.id}
              className={`card card-border flex h-full flex-col bg-surface p-6 ${
                group.signal ? "border-t border-status-signal" : ""
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {group.title}
                </h2>
                {group.signal ? (
                  <AlertTriangle className="h-5 w-5 text-status-signal" />
                ) : group.active ? (
                  <span className="h-2 w-2 bg-status-signal" />
                ) : (
                  <span className="h-2 w-2 border border-surface-paper" />
                )}
              </div>
              <div className="space-y-4">
                {group.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-border-muted pb-2">
                    <span className="text-sm leading-normal text-on-surface-variant">{label}</span>
                    <span className="font-mono text-sm font-medium text-on-surface">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <section className="flex flex-col gap-1 md:col-span-8">
          <article
            id="failure-modes"
            className="card card-border flex h-full flex-col justify-center border-l border-border-muted bg-surface p-8 md:p-12"
          >
            <h2 className="mb-6 font-serif text-3xl font-semibold leading-tight text-on-surface">
              Resolution Risk & Failure Modes
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant">
              <p>
                In arbitrage strategies, primary risk stems not from directional market movement,
                but from resolution delays and structural failure modes. The assumption of
                convergence relies on specific catalytic events and functional clearing mechanisms.
              </p>
              <p>
                We classify resolution risk into three distinct vectors: Regulatory Intervention,
                Counterparty Default, and Model Drift. A failure in any vector can transform a
                perceived risk-free arbitrage into a directional exposure with asymmetric downside.
              </p>
            </div>
            <div className="mt-8 border-t border-border-muted pt-6">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center border border-border-muted bg-surface-dim">
                  <ShieldCheck className="h-5 w-5 text-on-surface" />
                </div>
                <div>
                  <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                    Mandatory Audit Trail
                  </h3>
                  <p className="text-sm leading-normal text-on-surface-variant">
                    All risk parameter adjustments logged with cryptographic hashes.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid min-h-64 grid-cols-1 gap-1 md:grid-cols-2">
            <section className="card card-border relative overflow-hidden bg-surface p-4">
              <div className="relative z-10 flex justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  Model Drift Deviation
                </span>
                <span className="font-mono text-sm font-medium text-status-signal">+1.2 sigma</span>
              </div>
              <div className="absolute inset-0 top-10 flex items-end p-4">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <path d="M0,40 Q10,35 20,45 T40,25 T60,30 T80,10 T100,20" fill="none" stroke="#1F2937" strokeWidth="1" />
                  <path d="M0,42 Q10,38 20,42 T40,28 T60,32 T80,15 T100,25" fill="none" stroke="var(--status-signal)" strokeWidth="2" />
                  <line stroke="#434656" strokeDasharray="2,2" strokeWidth="1" x1="0" x2="100" y1="25" y2="25" />
                </svg>
              </div>
            </section>

            <section className="card card-border bg-surface p-4">
              <div className="flex justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  Data Latency / Staleness
                </span>
                <span className="font-mono text-sm font-medium text-on-surface-variant">14ms Avg</span>
              </div>
              <div className="mt-8 space-y-3">
                {[
                  ["FIX 1", "15%"],
                  ["FIX 2", "25%"],
                  ["WSS 1", "5%"],
                ].map(([label, width]) => (
                  <div key={label} className="flex h-4 w-full items-center">
                    <span className="w-12 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                      {label}
                    </span>
                    <progress className="progress progress-success ml-2 h-2 flex-1 bg-surface-dim" value={Number.parseFloat(width)} max={100} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>

      <FaqSection
        eyebrow="Risk FAQ"
        title="How risk controls constrain product scope"
        description="These visible answers match the FAQPage structured data for this route."
        items={riskFaqs}
      />
    </main>
  );
}
