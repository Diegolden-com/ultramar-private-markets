import { ProductTabs } from "@/components/product-tabs";
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
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <section className="border border-border-muted bg-surface p-6 md:p-8">
        <SectionHeader
          eyebrow="Arbitrage Hedge Fund / Research Gate"
          title="Research, not product"
          description="This route preserves strategy context without presenting lending markets or derivative arbitrage as active commercial products."
        />
      </section>
      <ProductTabs product="arbitrage-hedge-fund" active="research" />
      <div className="grid gap-1 bg-border-muted md:grid-cols-2">
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
          <div key={item.title} className="card card-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <item.icon className="h-5 w-5 text-status-signal" />
              <span className="badge badge-outline bg-surface-ink px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                {item.status}
              </span>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
