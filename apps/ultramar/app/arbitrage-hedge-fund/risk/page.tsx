import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { researchArticles } from "@/lib/research";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { AlertTriangle, ArrowRight, Gauge, Shield, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

const riskPath = "/arbitrage-hedge-fund/risk";
const description =
  "Understand sizing, exposure, hedge, liquidity, resolution, and model-drift controls for the Polymarket-first Arbitrage Hedge Fund.";

const riskControlItems = [
  {
    icon: SlidersHorizontal,
    title: "Sizing policy",
    body: "Signal sizing is capped by confidence, market liquidity, maximum drawdown tolerance, and venue concentration.",
    href: `${riskPath}#sizing-policy`,
  },
  {
    icon: Gauge,
    title: "Exposure monitoring",
    body: "The dashboard tracks notional exposure, spread persistence, active positions, and stale signal risk.",
    href: `${riskPath}#exposure-monitoring`,
  },
  {
    icon: Shield,
    title: "Hedge discipline",
    body: "Derivatives data informs probabilities and hedges but is not marketed as a separate active product in v1.",
    href: `${riskPath}#hedge-discipline`,
  },
  {
    icon: AlertTriangle,
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

const relatedResearch = researchArticles.filter((article) =>
  ["event-market-risk-controls", "polymarket-arbitrage-explainer"].includes(article.slug),
);

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
    <main>
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
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Arbitrage Hedge Fund"
            title="Risk controls"
            description={description}
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {riskControlItems.map((item) => (
            <div
              key={item.title}
              id={item.href.split("#")[1]}
              className="rounded-lg border border-border bg-card p-5"
            >
              <item.icon className="h-5 w-5 text-accent" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader
            eyebrow="Allocator review"
            title="Risk policy explains when a spread is investable"
            description="This route makes the control system indexable beside the signals and dashboard routes, so search traffic for event-market arbitrage risk lands on the policy layer."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/arbitrage-hedge-fund/signals"
              className="rounded-lg border border-border bg-background p-5 transition hover:border-accent"
            >
              <h2 className="text-lg font-semibold">Signal source</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Review the live board where monitored Polymarket dislocations are compared
                with model probabilities before sizing.
              </p>
            </Link>
            <Link
              href="/arbitrage-hedge-fund/dashboard"
              className="rounded-lg border border-border bg-background p-5 transition hover:border-accent"
            >
              <h2 className="text-lg font-semibold">Exposure view</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Inspect how active signals connect to notional exposure, position summaries,
                and guardrail status.
              </p>
            </Link>
          </div>
        </div>
      </section>
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Research context"
            title="The risk page is the commercial boundary"
            description="Research explains the opportunity; the risk route explains the constraints that make it reviewable."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {relatedResearch.map((article) => (
              <Link
                key={article.slug}
                href={`/research/${article.slug}`}
                className="group rounded-lg border border-border bg-background p-5 transition hover:border-accent"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {article.eyebrow}
                </p>
                <h2 className="mt-3 text-lg font-semibold leading-tight">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {article.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-accent">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {riskFaqs.map((item) => (
            <div key={item.question} className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold leading-6">{item.question}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <ProductCrosslink current="arbitrage-hedge-fund" />
    </main>
  );
}
