"use client";

import { deals, formatCurrency } from "@/lib/deals";
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
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="border-y border-border py-5 lg:border-y-0 lg:border-r lg:py-0 lg:pr-6">
        <div className="grid gap-5 lg:sticky lg:top-24">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <SlidersHorizontal className="h-4 w-4" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.28em]">
                Asset filter
              </p>
            </div>
            <p className="mt-4 font-serif text-3xl font-bold leading-none">
              {filteredDeals.length} of {deals.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Search the same private-market data set through issuer, ticker,
              sector, and market rail.
            </p>
          </div>

          <label className="relative block">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Search
            </span>
            <Search className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ticker, asset, sector"
              className="h-12 w-full rounded border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          <label className="relative block">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Sector
            </span>
            <Filter className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-muted-foreground" />
            <select
              value={sector}
              onChange={(event) => setSector(event.target.value)}
              className="h-12 w-full appearance-none rounded border border-border bg-background pl-10 pr-8 text-sm outline-none transition focus:border-accent"
            >
              {sectors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Market rail
            </p>
            <div className="grid h-12 grid-cols-3 rounded border border-border bg-background p-1 text-[10px] font-bold uppercase tracking-[0.14em]">
              {marketOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMarket(item.value)}
                  className={`rounded-sm px-2 transition ${
                    market === item.value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
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
            className="inline-flex h-11 items-center justify-center border border-border px-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:border-foreground hover:bg-foreground hover:text-background"
          >
            Clear filters
          </button>
        </div>
      </aside>

      <div className="grid gap-px bg-border">
        {filteredDeals.map((deal, index) => (
          <Link
            key={deal.id}
            href={`/private-equities/assets/${deal.ticker}`}
            className={`group grid min-w-0 overflow-hidden bg-background transition hover:bg-foreground hover:text-background ${
              index === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : "md:grid-cols-[260px_1fr]"
            }`}
          >
            <div
              className={`relative overflow-hidden border-b border-border group-hover:border-background/20 md:border-b-0 md:border-r ${
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
              <div className="absolute inset-0 bg-foreground/25 transition group-hover:bg-foreground/40" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  {deal.ticker}
                </span>
                <span className="border border-background/50 bg-foreground/55 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                  {deal.type}
                </span>
              </div>
            </div>

            <div className="flex min-h-[260px] min-w-0 flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent group-hover:text-background">
                    {deal.sector}
                  </p>
                  <h3 className="mt-3 break-words font-serif text-3xl font-bold leading-tight">
                    {deal.name}
                  </h3>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-background" />
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground group-hover:text-background/65">
                {deal.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {deal.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="border border-border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground group-hover:border-background/25 group-hover:text-background/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 border-y border-border group-hover:border-background/20 sm:grid-cols-4">
                <AssetStat label="Valuation" value={formatCurrency(deal.valuation)} />
                <AssetStat
                  label={deal.capitalRaise ? "Raise" : "Target"}
                  value={
                    deal.capitalRaise
                      ? formatCurrency(deal.capitalRaise.targetRaise)
                      : `${deal.apy}%`
                  }
                />
                <AssetStat label="Score" value={`${deal.complianceScore}`} />
                <AssetStat label="Minimum" value={formatCurrency(deal.minInvestment)} />
              </div>

              <div className="mt-5 flex flex-col gap-3 text-xs font-semibold text-muted-foreground group-hover:text-background/60 sm:flex-row sm:items-center sm:justify-between">
                <span>{deal.location}</span>
                <span className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.16em] text-accent group-hover:text-background">
                  <ShieldCheck className="h-4 w-4" />
                  {deal.capitalRaise?.roundStatus ?? "Reviewed"}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filteredDeals.length === 0 ? (
          <div className="bg-background p-8">
            <p className="font-serif text-3xl font-bold">No assets match this view.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Clear the filters or broaden the search to return to the full
              private-market index.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AssetStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-r border-border px-3 py-4 even:border-r-0 last:border-r-0 group-hover:border-background/20 sm:border-b-0 sm:even:border-r sm:last:border-r-0">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground group-hover:text-background/45">
        {label}
      </p>
      <p className="mt-2 truncate font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
