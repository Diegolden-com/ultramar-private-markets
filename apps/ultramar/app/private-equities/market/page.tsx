import { SectionHeader } from "@/components/section-header";
import { deals, formatCurrency } from "@/lib/deals";
import { ArrowRight, LineChart, Repeat2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Private Equities Market",
  description: "Secondary market view for eligible private-equity tokens.",
  alternates: {
    canonical: "/private-equities/market",
  },
};

export default function MarketPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow="Private Equities"
        title="Secondary market"
        description="The market route separates eligible transfer activity from primary issuer rounds."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {deals
          .filter((deal) => deal.type === "secondary")
          .map((deal) => (
            <Link
              key={deal.id}
              href={`/private-equities/assets/${deal.ticker}`}
              className="rounded-lg border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
            >
              <Repeat2 className="h-5 w-5 text-accent" />
              <h2 className="mt-4 text-2xl font-semibold">{deal.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {deal.description}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
                <MarketStat label="Ticker" value={deal.ticker} />
                <MarketStat label="Valuation" value={formatCurrency(deal.valuation)} />
                <MarketStat label="Yield" value={`${deal.apy}%`} />
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                View asset
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
      </div>
      <div className="mt-8 rounded-lg border border-border bg-muted/35 p-5">
        <LineChart className="h-5 w-5 text-accent" />
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Secondary transfer availability depends on eligibility, lockups, issuer
          restrictions, and jurisdiction-specific compliance controls.
        </p>
      </div>
    </main>
  );
}

function MarketStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
