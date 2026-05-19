import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { ProductTabs } from "@/components/product-tabs";
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
    <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
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
      <section className="border border-border-muted bg-surface p-6 md:p-8">
        <SectionHeader
          eyebrow="Arbitrage Hedge Fund / Allocator Surface"
          title="Dashboard"
          description={description}
        />
      </section>
      <ProductTabs product="arbitrage-hedge-fund" active="dashboard" />
      <section className="grid gap-1 bg-border-muted md:grid-cols-2 lg:grid-cols-4">
        {dashboardModules.map((item) => (
          <div
            key={item.title}
            id={item.href.split("#")[1]}
            className="border border-border-muted bg-surface p-5"
          >
            <item.icon className="h-5 w-5 text-status-signal" />
            <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.body}</p>
          </div>
        ))}
      </section>
      <section className="border border-border-muted bg-surface p-4 md:p-6">
        <SignalDashboard />
      </section>
      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-surface p-6 md:p-8">
          <SectionHeader
            eyebrow="Research context"
            title="Dashboard metrics need a risk memo behind them"
            description="The route connects fund-dashboard intent to the research that explains spread quality, exposure, and strategy graduation rules."
          />
        </div>
        <div className="grid gap-1 bg-border-muted md:grid-cols-2">
            {relatedResearch.map((article) => (
              <Link
                key={article.slug}
                href={`/research/${article.slug}`}
                className="group border border-border-muted bg-surface p-5 transition hover:border-status-signal"
              >
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  {article.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-on-surface">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                  {article.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant group-hover:text-status-signal">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
        </div>
      </section>
      <section className="grid gap-1 bg-border-muted md:grid-cols-3">
          {dashboardFaqs.map((item) => (
            <div key={item.question} className="border border-border-muted bg-surface p-5">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.question}
              </h2>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.answer}</p>
            </div>
          ))}
      </section>
      <ProductCrosslink current="arbitrage-hedge-fund" />
    </main>
  );
}
