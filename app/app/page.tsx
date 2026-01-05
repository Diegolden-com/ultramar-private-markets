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

  const sectors = ["All", ...Array.from(new Set(DEALS.map(d => d.sector)))]

  // Filter Logic
  const filteredDeals = DEALS.filter(deal => {
    const matchesSector = sectorFilter === "All" || deal.sector === sectorFilter
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSector && matchesSearch
  })

  return (
    <>
      {/* Top Bar / Ticker area */}
      <div className="bg-slate-900 text-white dark:bg-black border-b border-slate-800 px-4 py-2 text-xs flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            MARKET OPEN
          </span>
          <span className="text-slate-500">|</span>
          <span className="opacity-80">TOTAL LIQUIDITY: $142,893,021</span>
          <span className="text-slate-500">|</span>
          <span className="opacity-80">ACTIVE DEALS: {DEALS.length}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>ETH: $3,240.50</span>
          <span>USDC: $1.00</span>
        </div>
      </div>


      <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <RouteHeader
          title="PRIMARY MARKETS"
          subtitle="Direct access to vetted private equity rounds. Continuous compliance monitoring active."
          actions={
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search ticker or name..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 appearance-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 dark:hover:shadow-sky-500/10 flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-0.5 rounded">
                        {deal.ticker}
                      </span>
                      {deal.status === 'closing_soon' && (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" /> CLOSING
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold truncate pr-2">{deal.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-slate-400 uppercase tracking-wider mb-1 justify-end">
                      <ShieldCheck className="w-3 h-3" /> Compliance Itel
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-500 tabular-nums">
                      {deal.complianceScore}<span className="text-sm text-slate-400">/100</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[40px]">
                  {deal.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 flex-grow">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> APY (Est.)
                  </div>
                  <div className="text-lg font-bold tabular-nums">
                    {deal.apy}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Equity
                  </div>
                  <div className="text-lg font-bold tabular-nums">
                    {deal.equityForSale}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Valuation
                  </div>
                  <div className="text-lg font-bold tabular-nums">
                    ${(deal.valuation / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Region
                  </div>
                  <div className="text-sm font-bold truncate">
                    {deal.location}
                  </div>
                </div>
              </div>

              {/* Footer / Tags */}
              <div className="px-6 pb-6 pt-0 mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {deal.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/app/${deal.ticker}`} className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white transition-all group-hover:translate-y-[-2px]">
                  View Details <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p>No deals found matching your criteria.</p>
            <button
              onClick={() => { setSectorFilter("All"); setSearchQuery("") }}
              className="text-sky-500 hover:underline mt-2 text-sm"
            >
              Reset filters
            </button>
          </div>
        )}

      </main>
    </>
  )
}
