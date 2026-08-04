"use client";

import { deals, getDealListingMetrics } from "@/lib/deals";
import { ArrowUpRight, Filter, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const marketOptions = [
  { value: "all", label: "All" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
] as const;

export function AssetExplorer() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [market, setMarket] = useState<"all" | "primary" | "secondary">("all");

  const sectors = useMemo(
    () => ["All", ...Array.from(new Set(deals.map((deal) => deal.sector)))],
    [],
  );

  const filteredDeals = deals.filter((deal) => {
    const text = `${deal.name} ${deal.ticker} ${deal.sector}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesSector = sector === "All" || deal.sector === sector;
    const matchesMarket = market === "all" || deal.type === market;
    return matchesQuery && matchesSector && matchesMarket;
  });

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="card card-border min-w-0 bg-surface-container-lowest p-5">
        <div className="grid gap-5 lg:sticky lg:top-24">
          <div>
            <div className="flex items-center gap-2 text-status-signal">
              <SlidersHorizontal className="h-4 w-4" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Asset filter
              </p>
            </div>
            <p className="mt-4 font-mono text-3xl font-semibold leading-none text-on-surface">
              {filteredDeals.length} of {deals.length}
            </p>
          </div>

          <label className="relative block">
            <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Search
            </span>
            <Search className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-on-surface-variant" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ticker, asset, sector"
              className="input input-success h-12 w-full bg-surface-ink pl-10 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/60"
            />
          </label>

          <label className="relative block">
            <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Sector
            </span>
            <Filter className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-on-surface-variant" />
            <select
              value={sector}
              onChange={(event) => setSector(event.target.value)}
              className="select select-success h-12 w-full bg-surface-ink pl-10 pr-8 text-sm text-on-surface"
            >
              {sectors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Market type
            </p>
            <div className="join grid h-12 grid-cols-3 bg-surface-ink text-[10px] font-medium uppercase tracking-[0.08em]">
              {marketOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMarket(item.value)}
                  className={`btn join-item h-12 min-h-0 border-border-muted px-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
                    market === item.value
                      ? "btn-success text-surface-ink"
                      : "btn-ghost text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSector("All");
              setMarket("all");
            }}
            className="btn btn-outline btn-success h-11 min-h-0 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
          >
            Clear filters
          </button>
        </div>
      </aside>

      <div className="grid min-w-0 gap-4">
        {filteredDeals.map((deal, index) => {
          const metrics = getDealListingMetrics(deal);

          return (
          <Link
            key={deal.id}
            href={`/private-equities/assets/${deal.ticker}`}
            className={`card card-border group grid min-w-0 overflow-hidden bg-surface transition hover:border-status-signal hover:bg-surface-container-low ${
              index === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : "md:grid-cols-[260px_1fr]"
            }`}
          >
            <div
              className={`relative overflow-hidden border-b border-border-muted md:border-b-0 md:border-r ${
                index === 0 ? "min-h-[360px]" : "min-h-[220px]"
              }`}
            >
              <Image
                src={deal.image}
                alt={deal.name}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="image-blackwork object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-surface-ink/35 transition group-hover:bg-surface-ink/50" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="badge badge-outline bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {deal.ticker}
                </span>
                <span className={`badge badge-outline bg-surface px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${deal.secondarySale ? "border-destructive text-destructive" : "badge-success"}`}>
                  {deal.secondarySale ? "Secondary review · not live" : deal.type}
                </span>
              </div>
            </div>

            <div className="flex min-h-[250px] min-w-0 flex-col p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                    {deal.sector}
                  </p>
                  <h3 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight text-on-surface">
                    {deal.name}
                  </h3>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-on-surface-variant transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-status-signal" />
              </div>
              <div className="stats stats-vertical mt-auto grid grid-cols-2 border-y border-border-muted bg-transparent sm:stats-horizontal sm:grid-cols-4">
                {metrics.map((metric) => <AssetStat key={metric.label} {...metric} />)}
              </div>

              <div className="mt-5 flex flex-col gap-3 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
                <span>{deal.location}</span>
                <span className={`inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${deal.secondarySale ? "text-destructive" : "text-status-signal"}`}>
                  <ShieldCheck className="h-4 w-4" />
                  {deal.secondarySale?.status ?? deal.capitalRaise?.roundStatus ?? "Reviewed"}
                </span>
              </div>
            </div>
          </Link>
          );
        })}

        {filteredDeals.length === 0 ? (
          <div className="card card-border bg-surface p-8">
            <p className="font-serif text-3xl font-semibold text-on-surface">No assets match this view.</p>
            <p className="mt-3 text-sm text-on-surface-variant">Clear filters to continue.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AssetStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat border-b border-r border-border-muted px-3 py-4 even:border-r-0 last:border-r-0 sm:border-b-0 sm:even:border-r sm:last:border-r-0">
      <p className="stat-title font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="stat-value mt-2 truncate font-mono text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}
