"use client";

import { deals, formatCurrency } from "@/lib/deals";
import { ArrowUpRight, Filter, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
    <div className="space-y-8">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ticker, asset, sector"
            className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-8 text-sm outline-none focus:border-accent md:w-52"
          >
            {sectors.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div className="grid h-11 grid-cols-3 rounded-md border border-border bg-background p-1 text-xs font-semibold uppercase tracking-[0.12em]">
          {(["all", "primary", "secondary"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMarket(item)}
              className={`rounded px-2 transition ${
                market === item
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredDeals.map((deal) => (
          <Link
            key={deal.id}
            href={`/private-equities/assets/${deal.ticker}`}
            className="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
              <Image
                src={deal.image}
                alt={deal.name}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-foreground px-2 py-1 font-mono text-xs font-semibold text-background">
                  {deal.ticker}
                </span>
                <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-foreground">
                  {deal.type}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{deal.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {deal.location} / {deal.sector}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-accent" />
              </div>
              <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">
                {deal.description}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
                <AssetStat label="Valuation" value={formatCurrency(deal.valuation)} />
                <AssetStat label="Target" value={`${deal.apy}%`} />
                <AssetStat label="Score" value={`${deal.complianceScore}`} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent">
                <ShieldCheck className="h-4 w-4" />
                Compliance reviewed
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AssetStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
