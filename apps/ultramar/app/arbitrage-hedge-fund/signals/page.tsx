import { SignalDashboard } from "@/components/signal-dashboard";
import { SectionHeader } from "@/components/section-header";
import { createSeoMetadata, seoImages } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Signals",
  description: "Polymarket-first arbitrage signal board for Ultramar.capital.",
  path: "/arbitrage-hedge-fund/signals",
  image: seoImages.arbitrage,
  keywords: ["Polymarket signals", "prediction market arbitrage", "event market signal board"],
});

export default function SignalsPage() {
  return (
    <main>
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Arbitrage Hedge Fund"
            title="Polymarket signal board"
            description="The v1 fund product focuses on Polymarket mispricings and keeps lending or derivative-only strategies out of the active product surface."
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SignalDashboard />
      </section>
    </main>
  );
}
