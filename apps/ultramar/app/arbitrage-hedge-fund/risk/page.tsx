import { SectionHeader } from "@/components/section-header";
import { AlertTriangle, Gauge, Shield, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arbitrage Hedge Fund Risk",
  description: "Risk controls for the Polymarket-first Arbitrage Hedge Fund.",
  alternates: {
    canonical: "/arbitrage-hedge-fund/risk",
  },
};

export default function RiskPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow="Arbitrage Hedge Fund"
        title="Risk controls"
        description="The fund product is only understandable if the control system is visible next to the signals."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          {
            icon: SlidersHorizontal,
            title: "Sizing policy",
            body: "Signal sizing is capped by confidence, market liquidity, maximum drawdown tolerance, and venue concentration.",
          },
          {
            icon: Gauge,
            title: "Exposure monitoring",
            body: "The dashboard tracks notional exposure, spread persistence, active positions, and stale signal risk.",
          },
          {
            icon: Shield,
            title: "Hedge discipline",
            body: "Derivatives data informs probabilities and hedges but is not marketed as a separate active product in v1.",
          },
          {
            icon: AlertTriangle,
            title: "Failure modes",
            body: "Controls must account for oracle delay, market resolution ambiguity, venue liquidity, and model drift.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <item.icon className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
