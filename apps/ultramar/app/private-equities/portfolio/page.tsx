import { BrandText } from "@/components/brand-name";
import { MetricCard } from "@/components/metric-card";
import { ProductRouteHeader, SurfacePanel } from "@/components/page-layout";
import { createSeoMetadata, seoImages } from "@/lib/seo";
import { Activity, Download, PieChart, TrendingUp, Wallet } from "lucide-react";

export const metadata = createSeoMetadata({
  title: "Private Equities Portfolio",
  description: "Investor portfolio view for Ultramar Private Equities.",
  path: "/private-equities/portfolio",
  image: seoImages.privateEquities,
  keywords: ["private equity portfolio", "tokenized holdings", "investor portfolio"],
  noIndex: true,
});

const holdings = [
  { ticker: "lcx", name: "Lavanderias CX", units: 12500, price: 1.08, value: 13500, change: 4.6 },
  { ticker: "VRX.RE", name: "Vertex Realty Core", units: 8200, price: 1.02, value: 8364, change: 1.3 },
  { ticker: "AGR.YLD", name: "AgroFuture Yield", units: 5400, price: 0.97, value: 5238, change: -2.1 },
];

export default function PortfolioPage() {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <>
      <ProductRouteHeader
        product="private-equities"
        active="portfolio"
        eyebrow="Private Equities / Portfolio State"
        title="Portfolio"
        description="A consolidated investor view for private-market exposure, daily changes, and holding-level performance."
      />

      <div className="grid gap-1 md:grid-cols-3">
        <MetricCard
          label="Total value"
          value={`$${totalValue.toLocaleString("en-US")}`}
          detail="Private-market tokenized holdings"
          icon={Wallet}
        />
        <MetricCard
          label="YTD return"
          value="+12.4%"
          detail="Blended realized and unrealized performance"
          icon={TrendingUp}
        />
        <MetricCard
          label="Assets"
          value={holdings.length.toString()}
          detail="Across primary and secondary markets"
          icon={PieChart}
        />
      </div>

      <section className="card card-border bg-surface">
        <div className="flex flex-col gap-4 border-b border-border-muted p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
              Holdings
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Representative holdings for an approved investor account.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-success btn-sm w-fit font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-sm w-full min-w-[680px] text-left font-mono text-sm">
            <thead className="border-b border-border-muted bg-surface-container-low text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
              <tr>
                <th className="px-5 py-4 font-medium">Asset</th>
                <th className="px-5 py-4 font-medium">Units</th>
                <th className="px-5 py-4 font-medium">Price</th>
                <th className="px-5 py-4 font-medium">Value</th>
                <th className="px-5 py-4 font-medium">24h</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.ticker} className="border-b border-border-muted last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold uppercase text-on-surface">{holding.ticker}</p>
                    <p className="mt-1 text-[11px] text-on-surface-variant">{holding.name}</p>
                  </td>
                  <td className="px-5 py-4 text-on-surface">{holding.units.toLocaleString("en-US")}</td>
                  <td className="px-5 py-4 text-on-surface">${holding.price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-on-surface">
                    ${holding.value.toLocaleString("en-US")}
                  </td>
                  <td
                    className={`px-5 py-4 ${
                      holding.change >= 0 ? "text-status-signal" : "text-destructive"
                    }`}
                  >
                    {holding.change > 0 ? "+" : ""}
                    {holding.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SurfacePanel padded={false} className="border-t-status-signal p-5">
        <Activity className="h-5 w-5 text-status-signal" />
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          <BrandText>
            {
              "Portfolio access is intended for approved investors reviewing private-market exposure, valuation changes, and holding-level performance."
            }
          </BrandText>
        </p>
      </SurfacePanel>
    </>
  );
}
