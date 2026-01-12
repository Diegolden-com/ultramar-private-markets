"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpRight, ShieldCheck, Activity, Globe, Zap, Percent, Clock } from "lucide-react"
import { DEALS } from "@/lib/deals"
// Removing this line and replacing with RouteHeader
import { RouteHeader } from "@/components/route-header"

export default function AppDealBoard() {
  const [sectorFilter, setSectorFilter] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [marketView, setMarketView] = useState<'primary' | 'secondary'>('primary')

  const sectors = ["All", ...Array.from(new Set(DEALS.map(d => d.sector)))]

  // Filter Logic
  const filteredDeals = DEALS.filter(deal => {
    const matchesSector = sectorFilter === "All" || deal.sector === sectorFilter
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = deal.type === marketView
    return matchesSector && matchesSearch && matchesType
  })

  return (
    <>
      {/* Top Bar / Ticker area */}
      <div className="bg-foreground text-background border-b-2 border-foreground px-4 py-2 text-xs flex items-center justify-between overflow-hidden font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-accent">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            MARKET OPEN
          </span>
          <span className="text-muted">|</span>
          <span className="opacity-80">TOTAL LIQUIDITY: $142,893,021</span>
          <span className="text-muted">|</span>
          <span className="opacity-80">ACTIVE DEALS: {DEALS.length}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 opacity-80">
          <span>ETH: $3,240.50</span>
          <span>USDC: $1.00</span>
        </div>
      </div>


      <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <RouteHeader
          title={marketView === 'primary' ? "PRIMARY MARKETS" : "SECONDARY MARKET"}
          subtitle={marketView === 'primary'
            ? "Direct access to vetted private equity rounds. Continuous compliance monitoring active."
            : "Peer-to-peer trading of tokenized real-world assets. Instant settlement."}
          actions={
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* View Toggle */}
              <div className="flex border-2 border-foreground bg-background p-1 gap-1 h-10 items-center">
                <button
                  onClick={() => setMarketView('primary')}
                  className={`flex-1 justify-center h-full px-4 text-xs font-bold font-mono transition-all flex items-center ${marketView === 'primary'
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                    }`}
                >
                  PRIMARY
                </button>
                <button
                  onClick={() => setMarketView('secondary')}
                  className={`flex-1 justify-center h-full px-4 text-xs font-bold font-mono transition-all flex items-center ${marketView === 'secondary'
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                    }`}
                >
                  SECONDARY
                </button>
              </div>

              {/* Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search ticker or name..."
                  className="pl-10 pr-4 py-2 bg-background border-2 border-foreground w-full sm:w-64 focus:outline-none focus:ring-0 focus:border-accent transition-all placeholder:text-muted-foreground font-mono text-sm h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 bg-background border-2 border-foreground w-full sm:w-auto focus:outline-none focus:ring-0 focus:border-accent appearance-none cursor-pointer hover:bg-muted/20 transition-colors font-mono text-sm h-10"
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
          }
        />
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="group bg-background border-2 border-foreground hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image Header */}
              <div className="relative h-64 w-full overflow-hidden border-b-2 border-foreground">
                <div className="absolute inset-0 bg-accent/10 mix-blend-overlay z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ticker & Status Overlay */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-background bg-foreground px-2 py-1 border border-transparent shadow-sm">
                    {deal.ticker}
                  </span>
                  {deal.status === 'closing_soon' && (
                    <span className="text-xs font-bold font-mono text-white bg-destructive px-2 py-1 border border-transparent flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3" /> CLOSING
                    </span>
                  )}
                </div>
              </div>

              {/* Card Header */}
              <div className="p-6 border-b-2 border-foreground bg-background relative z-20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif leading-tight pr-2">{deal.name}</h3>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider mb-1 justify-end font-mono">
                      <ShieldCheck className="w-3 h-3" /> Score
                    </div>
                    <div className="text-xl font-bold font-mono text-accent tabular-nums border-2 border-accent/20 px-2 py-0.5 rounded-sm inline-block">
                      {deal.complianceScore}
                    </div>
                  </div>
                </div>

                <p className="text-sm font-mono text-muted-foreground line-clamp-2 min-h-[40px]">
                  {deal.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 border-b-2 border-foreground divide-x-2 divide-foreground divide-y-2 divide-foreground">
                <div className="p-4 flex flex-col justify-center border-b-2 border-foreground">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1 font-mono">
                    <Activity className="w-3 h-3" /> APY (Est.)
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-foreground">
                    {deal.apy}%
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-center border-b-2 border-foreground">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1 font-mono">
                    <Percent className="w-3 h-3" /> Equity
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-foreground">
                    {deal.equityForSale}%
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1 font-mono">
                    <Zap className="w-3 h-3" /> Valuation
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-foreground">
                    ${(deal.valuation / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1 font-mono">
                    <Globe className="w-3 h-3" /> Region
                  </div>
                  <div className="text-sm font-bold font-mono truncate text-foreground">
                    {deal.location}
                  </div>
                </div>
              </div>

              {/* Footer / Tags */}
              <div className="p-6 mt-auto bg-muted/5">
                <div className="flex flex-wrap gap-2 mb-6">
                  {deal.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold font-mono text-muted-foreground border border-foreground/20 bg-background px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/app/${deal.ticker}`} className="w-full bg-foreground text-background py-4 font-mono font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-white border-2 border-transparent transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-[2px]">
                  VIEW DETAILS <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-24 text-muted-foreground border-2 border-dashed border-foreground/30 font-mono">
            <p>No deals found matching your criteria.</p>
            <button
              onClick={() => { setSectorFilter("All"); setSearchQuery("") }}
              className="text-accent hover:underline mt-2 text-sm"
            >
              Reset filters
            </button>
          </div>
        )}

      </main>
    </>
  )
}
