import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SignalDashboard } from "@/components/signal-dashboard";
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
import { ArrowRight, BarChart3, Gauge, Radar, Shield } from "lucide-react";
import Link from "next/link";

const signalsPath = "/arbitrage-hedge-fund/signals";
const description =
  "Monitor Polymarket arbitrage signals with implied probabilities, model probabilities, spread confidence, and product-scope boundaries.";

const signalBoardItems = [
  {
    icon: Radar,
    title: "Market observation",
    body: "The board keeps active and monitored Polymarket events in one place, with venue, update timing, and signal status visible beside each market.",
    href: `${signalsPath}#market-observation`,
  },
  {
    icon: BarChart3,
    title: "Probability comparison",
    body: "Implied prices are compared with model probabilities so the fund can separate raw event interest from durable dislocation candidates.",
    href: `${signalsPath}#probability-comparison`,
  },
  {
    icon: Gauge,
    title: "Confidence language",
    body: "Signals graduate from monitoring to sizing only when spread persistence, liquidity, and comparison quality support allocator-facing confidence.",
    href: `${signalsPath}#confidence-language`,
  },
  {
    icon: Shield,
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

const relatedResearch = researchArticles.filter((article) =>
  ["polymarket-arbitrage-explainer", "event-market-risk-controls"].includes(article.slug),
);

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

export default function SignalsPage() {
  return (
    <main>
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
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Arbitrage Hedge Fund"
            title="Polymarket signal board"
            description={description}
          />
        </div>
      </section>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {signalBoardItems.map((item) => (
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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SignalDashboard />
      </section>
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Research context"
            title="Signals tied back to the arbitrage thesis"
            description="The route links search intent for Polymarket arbitrage to the research memos that explain why the spread exists and when it is usable."
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
          {signalFaqs.map((item) => (
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
