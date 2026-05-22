import { JsonLd } from "@/components/json-ld";
import { ProductRouteHeader, SurfaceGrid, SurfacePanel } from "@/components/page-layout";
import { deals, formatCurrency } from "@/lib/deals";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowRight, BadgeDollarSign, Clock, FileCheck2 } from "lucide-react";
import Link from "next/link";

const dealsPath = "/private-equities/deals";
const description = "Issuer rounds and private-market deal flow on Ultramar.capital.";
const primaryDeals = deals.filter((deal) => deal.type === "primary");

export const metadata = createSeoMetadata({
  title: "Private Equities Deals",
  description,
  path: dealsPath,
  image: seoImages.privateEquities,
  keywords: ["issuer rounds", "private market deals", "private equity deal flow"],
});

export default function DealsPage() {
  return (
    <>
      <JsonLd
        id="private-equities-deals-json-ld"
        data={[
          webPageJsonLd({ path: dealsPath, name: "Ultramar Private Equities Deals", description }),
          itemListJsonLd({
            path: dealsPath,
            name: "Ultramar Private Equities issuer rounds",
            description,
            items: primaryDeals.map((deal) => ({
              name: `${deal.name} (${deal.ticker})`,
              url: `/private-equities/assets/${deal.ticker}`,
              description: deal.description,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Deals", path: dealsPath },
          ]),
        ]}
      />

      <ProductRouteHeader
        product="private-equities"
        active="deals"
        eyebrow="Private Equities / Deal Rail"
        title="Issuer rounds and deal mechanics"
        description="Deals make the issuer round understandable before an investor reaches the transaction workflow."
      />
      <SurfaceGrid>
        {primaryDeals.map((deal) => (
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
      </SurfaceGrid>
      <SurfacePanel padded={false} className="border-t-status-warning p-5">
        <FileCheck2 className="h-5 w-5 text-status-warning" />
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Production participation requires legal review, KYC/KYB, accreditation or
          suitability checks where applicable, custody setup, and issuer-specific
          offering documents. The public deal page should not accept funds or binding
          commitments until the selected offering path is approved.
        </p>
      </SurfacePanel>
    </>
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
