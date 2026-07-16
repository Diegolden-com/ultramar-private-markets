import { JsonLd } from "@/components/json-ld";
import { SignalDashboard } from "@/components/signal-dashboard";
import { ProductRouteHeader } from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { BarChart3, ClipboardCheck, Gauge, WalletCards } from "lucide-react";

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
    body: "Allocator review distinguishes Polymarket monitoring from research-only ideas before any strategy graduates.",
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
    <>
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
      <ProductRouteHeader
        product="arbitrage-hedge-fund"
        active="dashboard"
        eyebrow="Arbitrage Hedge Fund / Allocator Review"
        title="Dashboard"
        description="Signals, positions, and guardrails."
      />
      <section className="card card-border bg-surface p-4 md:p-6">
        <SignalDashboard />
      </section>
    </>
  );
}
