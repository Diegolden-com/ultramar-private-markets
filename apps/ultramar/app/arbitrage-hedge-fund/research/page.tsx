import { SectionHeader } from "@/components/section-header";
import { createSeoMetadata, seoImages } from "@/lib/seo";
import { BookOpenText, FlaskConical, Lock, Radar } from "lucide-react";

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Research",
  description: "Research backlog for future arbitrage strategies at Ultramar.capital.",
  path: "/arbitrage-hedge-fund/research",
  image: seoImages.arbitrage,
  keywords: ["arbitrage research", "Polymarket research", "derivative arbitrage research"],
});

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow="Arbitrage Hedge Fund"
        title="Research, not product"
        description="This route preserves strategy context without presenting lending markets or derivative arbitrage as active commercial products."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          {
            icon: Radar,
            title: "Polymarket arbitrage",
            body: "Active v1 scope. Signal research supports live probability dislocation monitoring.",
            status: "Active product",
          },
          {
            icon: FlaskConical,
            title: "Lending markets",
            body: "Research-only in this release. Useful as a future yield and capital efficiency module.",
            status: "Research only",
          },
          {
            icon: BookOpenText,
            title: "Derivative arbitrage",
            body: "Research-only in this release. Derivatives inform probability models and hedging assumptions.",
            status: "Research only",
          },
          {
            icon: Lock,
            title: "Graduation rule",
            body: "A strategy only becomes product surface after data quality, risk limits, and allocator language are complete.",
            status: "Governance",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <item.icon className="h-5 w-5 text-accent" />
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                {item.status}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
