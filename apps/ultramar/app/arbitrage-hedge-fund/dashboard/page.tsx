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
import { ArrowRight, BarChart3, ClipboardCheck, Gauge, WalletCards } from "lucide-react";
import Link from "next/link";

const dashboardPath = "/arbitrage-hedge-fund/dashboard";
const description =
  "Review the allocator dashboard for Polymarket-first arbitrage signals, position exposure, notional sizing, and guardrail status.";

const dashboardModules = [
  {
    icon: BarChart3,
    title: "Signal health",
    body: "Active and monitored dislocations are summarized with count, average spread, confidence, and stale-signal awareness.",
    href: `${dashboardPath}#signal-health`,
  },
  {
    icon: WalletCards,
    title: "Position exposure",
    body: "Position cards translate current market sizing into notional exposure that allocators can compare with hedge assumptions.",
    href: `${dashboardPath}#position-exposure`,
  },
  {
    icon: Gauge,
    title: "Guardrail status",
    body: "The dashboard keeps sizing, concentration, liquidity, and spread-persistence controls visible beside the signal board.",
    href: `${dashboardPath}#guardrail-status`,
  },
  {
    icon: ClipboardCheck,
    title: "Allocator review",
    body: "Dashboard copy explains what is active product scope and what remains research-only before any strategy graduates.",
    href: `${dashboardPath}#allocator-review`,
  },
];

const dashboardFaqs = [
  {
    question: "Who is the arbitrage dashboard for?",
    answer:
      "The dashboard is written for allocators and fund reviewers who need to inspect active signals, position exposure, hedge context, and guardrail status together.",
  },
  {
    question: "How is the dashboard different from the signal board?",
    answer:
      "The signal board focuses on market-level dislocations. The dashboard adds portfolio context by connecting those signals to exposure, sizing, and controls.",
  },
  {
    question: "Does the dashboard imply every research strategy is live?",
    answer:
      "No. The dashboard preserves a Polymarket-first product boundary and keeps lending or derivative-only ideas in research until their controls are complete.",
  },
];

const relatedResearch = researchArticles.filter((article) =>
  ["event-market-risk-controls", "polymarket-arbitrage-explainer"].includes(article.slug),
);

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Dashboard",
  description,
  path: dashboardPath,
  image: seoImages.arbitrage,
  keywords: [
    "arbitrage dashboard",
    "Polymarket fund dashboard",
    "event market exposure",
    "allocator dashboard",
    "prediction market fund controls",
  ],
});

export default function DashboardPage() {
  return (
    <main>
      <JsonLd
        id="arbitrage-dashboard-json-ld"
        data={[
          webPageJsonLd({
            path: dashboardPath,
            name: "Ultramar Arbitrage Hedge Fund Dashboard",
            description,
          }),
          itemListJsonLd({
            path: dashboardPath,
            name: "Allocator dashboard modules",
            description:
              "The dashboard modules used to review signals, exposure, and controls for the Polymarket-first fund.",
            items: dashboardModules.map((item) => ({
              name: item.title,
              url: item.href,
              description: item.body,
            })),
          }),
          faqJsonLd(dashboardFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: "/arbitrage-hedge-fund" },
            { name: "Dashboard", path: dashboardPath },
          ]),
        ]}
      />
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Arbitrage Hedge Fund"
            title="Dashboard"
            description={description}
          />
        </div>
      </section>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardModules.map((item) => (
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
            title="Dashboard metrics need a risk memo behind them"
            description="The route connects fund-dashboard intent to the research that explains spread quality, exposure, and strategy graduation rules."
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
          {dashboardFaqs.map((item) => (
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
