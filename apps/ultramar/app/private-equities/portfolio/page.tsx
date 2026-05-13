import { MetricCard } from "@/components/metric-card";
import { SectionHeader } from "@/components/section-header";
import { Activity, Download, PieChart, TrendingUp, Wallet } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Equities Portfolio",
  description: "Investor portfolio view for Ultramar Private Equities.",
  alternates: {
    canonical: "/private-equities/portfolio",
  },
};

const holdings = [
  { ticker: "lcx", name: "CX Laundry", units: 12500, price: 1.08, value: 13500, change: 4.6 },
  { ticker: "VRX.RE", name: "Vertex Realty Core", units: 8200, price: 1.02, value: 8364, change: 1.3 },
  { ticker: "AGR.YLD", name: "AgroFuture Yield", units: 5400, price: 0.97, value: 5238, change: -2.1 },
];

export default function PortfolioPage() {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow="Private Equities"
        title="Portfolio"
        description="A consolidated investor view for private-market exposure, daily changes, and holding-level performance."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
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

      <section className="mt-10 rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Holdings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Representative holdings for the consolidated mega app.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Asset</th>
                <th className="px-5 py-4 font-semibold">Units</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Value</th>
                <th className="px-5 py-4 font-semibold">24h</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.ticker} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold uppercase">{holding.ticker}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{holding.name}</p>
                  </td>
                  <td className="px-5 py-4 font-mono">{holding.units.toLocaleString("en-US")}</td>
                  <td className="px-5 py-4 font-mono">${holding.price.toFixed(2)}</td>
                  <td className="px-5 py-4 font-mono">
                    ${holding.value.toLocaleString("en-US")}
                  </td>
                  <td
                    className={`px-5 py-4 font-mono ${
                      holding.change >= 0 ? "text-emerald-600" : "text-rose-600"
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

      <div className="mt-8 rounded-lg border border-border bg-muted/35 p-5">
        <Activity className="h-5 w-5 text-accent" />
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This page is the investor-facing portfolio destination inside the unified
          Ultramar.capital app. It replaces the standalone private-equities
          subdomain portfolio route.
        </p>
      </div>
    </main>
  );
}
