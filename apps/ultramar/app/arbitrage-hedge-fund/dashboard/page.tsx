import { SignalDashboard } from "@/components/signal-dashboard";
import { SectionHeader } from "@/components/section-header";
import { createSeoMetadata, seoImages } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Dashboard",
  description: "Allocator dashboard for Polymarket-first arbitrage fund activity.",
  path: "/arbitrage-hedge-fund/dashboard",
  image: seoImages.arbitrage,
  keywords: ["arbitrage dashboard", "Polymarket fund dashboard", "event market exposure"],
});

export default function DashboardPage() {
  return (
    <main>
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Arbitrage Hedge Fund"
            title="Dashboard"
            description="A consolidated view of signals, position exposure, and risk guardrails for the Polymarket-first fund."
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SignalDashboard />
      </section>
    </main>
  );
}
