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
import { ArrowRight, LineChart, Repeat2 } from "lucide-react";
import Link from "next/link";

const marketPath = "/private-equities/market";
const description = "Secondary market view for eligible private-equity tokens.";
const secondaryDeals = deals.filter((deal) => deal.type === "secondary");

export const metadata = createSeoMetadata({
  title: "Private Equities Market",
  description,
  path: marketPath,
  image: seoImages.privateEquities,
  keywords: ["private equity secondary market", "eligible transfers", "tokenized equity market"],
});

export default function MarketPage() {
  return (
    <>
      <JsonLd
        id="private-equities-market-json-ld"
        data={[
          webPageJsonLd({ path: marketPath, name: "Ultramar Private Equities Market", description }),
          itemListJsonLd({
            path: marketPath,
            name: "Eligible secondary private-equity transfer views",
            description,
            items: secondaryDeals.map((deal) => ({
              name: `${deal.name} (${deal.ticker})`,
              url: `/private-equities/assets/${deal.ticker}`,
              description: deal.description,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Market", path: marketPath },
          ]),
        ]}
      />

      <ProductRouteHeader
        product="private-equities"
        active="market"
        eyebrow="Private Equities / Secondary Rail"
        title="Secondary market"
        description="Eligible transfer activity stays separate from primary issuer rounds and remains subject to issuer restrictions."
      />
      <SurfaceGrid columns="md:grid-cols-2">
        {secondaryDeals.map((deal) => (
          <Link
            key={deal.id}
            href={`/private-equities/assets/${deal.ticker}`}
            className="card card-border bg-surface p-5 transition hover:border-status-signal"
          >
            <Repeat2 className="h-5 w-5 text-status-signal" />
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-on-surface">
              {deal.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{deal.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border-muted pt-4">
              <MarketStat label="Ticker" value={deal.ticker} />
              <MarketStat label="Valuation" value={formatCurrency(deal.valuation)} />
              <MarketStat label="Yield" value={`${deal.apy}%`} />
            </div>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              View asset
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </SurfaceGrid>
      <SurfacePanel padded={false} className="border-t-status-warning p-5">
        <LineChart className="h-5 w-5 text-status-warning" />
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          Secondary transfer availability depends on eligibility, lockups, issuer
          restrictions, and jurisdiction-specific compliance controls.
        </p>
      </SurfacePanel>
    </>
  );
}

function MarketStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}
