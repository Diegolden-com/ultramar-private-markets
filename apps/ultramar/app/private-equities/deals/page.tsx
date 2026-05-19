import { ProductTabs } from "@/components/product-tabs";
import { SectionHeader } from "@/components/section-header";
import { deals, formatCurrency } from "@/lib/deals";
import { createSeoMetadata, seoImages } from "@/lib/seo";
import { ArrowRight, BadgeDollarSign, Clock, FileCheck2 } from "lucide-react";
import Link from "next/link";

export const metadata = createSeoMetadata({
  title: "Private Equities Deals",
  description: "Issuer rounds and private-market deal flow on Ultramar.capital.",
  path: "/private-equities/deals",
  image: seoImages.privateEquities,
  keywords: ["issuer rounds", "private market deals", "private equity deal flow"],
});

export default function DealsPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <section className="border border-border-muted bg-surface p-6 md:p-8">
        <SectionHeader
          eyebrow="Private Equities / Deal Rail"
          title="Issuer rounds and deal mechanics"
          description="Deals make the issuer round understandable before an investor reaches the transaction workflow."
        />
      </section>
      <ProductTabs product="private-equities" active="deals" />
      <div className="grid gap-1 bg-border-muted">
        {deals
          .filter((deal) => deal.type === "primary")
          .map((deal) => (
            <Link
              key={deal.id}
              href={`/private-equities/assets/${deal.ticker}`}
              className="card card-border grid gap-5 bg-surface p-5 transition hover:border-status-signal md:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-outline bg-surface-ink px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                    {deal.ticker}
                  </span>
                  {deal.status === "closing_soon" ? (
                    <span className="badge badge-outline badge-warning gap-1 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                      <Clock className="h-3 w-3" />
                      Closing soon
                    </span>
                  ) : null}
                  {deal.capitalRaise ? (
                    <span className="badge badge-outline badge-success gap-1 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                      <BadgeDollarSign className="h-3 w-3" />
                      {deal.capitalRaise.roundStatus}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-on-surface">
                  {deal.name}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">
                  {deal.description}
                </p>
                {deal.capitalRaise ? (
                  <p className="mt-4 max-w-3xl font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
                    {deal.capitalRaise.instrument}. {deal.capitalRaise.closingWindow}.
                  </p>
                ) : null}
              </div>
              <div className="grid min-w-64 gap-3 border-t border-border-muted pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <DealStat label="Valuation" value={formatCurrency(deal.valuation)} />
                {deal.capitalRaise ? (
                  <DealStat
                    label="Target raise"
                    value={formatCurrency(deal.capitalRaise.targetRaise)}
                  />
                ) : null}
                <DealStat label="Minimum" value={formatCurrency(deal.minInvestment)} />
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  View round
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
      </div>
      <div className="border border-border-muted border-t-status-warning bg-surface p-5">
        <FileCheck2 className="h-5 w-5 text-status-warning" />
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Production participation requires legal review, KYC/KYB, accreditation or
          suitability checks where applicable, custody setup, and issuer-specific
          offering documents. The public deal page should not accept funds or binding
          commitments until the selected offering path is approved.
        </p>
      </div>
    </main>
  );
}

function DealStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}
