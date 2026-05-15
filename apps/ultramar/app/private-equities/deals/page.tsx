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
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow="Private Equities"
        title="Issuer rounds and deal mechanics"
        description="Deals make the issuer round understandable before an investor reaches the transaction workflow."
      />
      <div className="mt-10 grid gap-5">
        {deals
          .filter((deal) => deal.type === "primary")
          .map((deal) => (
            <Link
              key={deal.id}
              href={`/private-equities/assets/${deal.ticker}`}
              className="grid gap-5 rounded-lg border border-border bg-card p-5 transition hover:border-accent hover:shadow-md md:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-foreground px-2 py-1 font-mono text-xs font-semibold text-background">
                    {deal.ticker}
                  </span>
                  {deal.status === "closing_soon" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                      <Clock className="h-3 w-3" />
                      Closing soon
                    </span>
                  ) : null}
                  {deal.capitalRaise ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
                      <BadgeDollarSign className="h-3 w-3" />
                      {deal.capitalRaise.roundStatus}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{deal.name}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {deal.description}
                </p>
                {deal.capitalRaise ? (
                  <p className="mt-4 max-w-3xl text-xs leading-5 text-muted-foreground">
                    {deal.capitalRaise.instrument}. {deal.capitalRaise.closingWindow}.
                  </p>
                ) : null}
              </div>
              <div className="grid min-w-64 gap-3 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <DealStat label="Valuation" value={formatCurrency(deal.valuation)} />
                {deal.capitalRaise ? (
                  <DealStat
                    label="Target raise"
                    value={formatCurrency(deal.capitalRaise.targetRaise)}
                  />
                ) : null}
                <DealStat label="Minimum" value={formatCurrency(deal.minInvestment)} />
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  View round
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
      </div>
      <div className="mt-10 rounded-lg border border-border bg-muted/35 p-5">
        <FileCheck2 className="h-5 w-5 text-accent" />
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
