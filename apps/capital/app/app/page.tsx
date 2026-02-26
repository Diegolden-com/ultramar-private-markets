"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { TrendingUp, BarChart3, Search, X, Info } from "lucide-react"

const strategies = [
  {
    id: "lending-markets",
    name: "LENDING MARKETS",
    description: "Automated lending across multiple DeFi protocols with dynamic rate optimization",
    apy: "+12.4%",
    apyValue: 12.4,
    tvl: "$2.4M",
    tvlValue: 2400000,
    risk: "LOW",
    infoPage: "/info/lending-markets",
  },
  {
    id: "derivative-arbitrage",
    name: "DERIVATIVE ARBITRAGE",
    description: "General derivative arbitrage using synthetic options and replicating portfolios across markets",
    apy: "+18.6%",
    apyValue: 18.6,
    tvl: "$1.5M",
    tvlValue: 1500000,
    risk: "MEDIUM",
    infoPage: "/info/derivative-arbitrage",
  },
  {
    id: "polymarket-synthetic-options",
    name: "POLYMARKET ARBITRAGE",
    description: "Specialized arbitrage strategy focused on Polymarket prediction markets with vega hedging",
    apy: "+24.8%",
    apyValue: 24.8,
    tvl: "$890K",
    tvlValue: 890000,
    risk: "MEDIUM",
    infoPage: "/info/polymarket-arbitrage",
  },
  {
    id: "private-equities",
    name: "PRIVATE EQUITIES",
    description: "Tokenized private equity investments with automated portfolio rebalancing and yield optimization",
    apy: "+32.6%",
    apyValue: 32.6,
    tvl: "$1.2M",
    tvlValue: 1200000,
    risk: "HIGH",
    infoPage: "/info/private-markets",
  },
]

type SortOption = "apy" | "tvl" | "name"
type RiskFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH"

export default function AppPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("ALL")
  const [sortBy, setSortBy] = useState<SortOption>("apy")

  const filteredStrategies = useMemo(() => {
    let filtered = strategies

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (strategy) =>
          strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply risk filter
    if (riskFilter !== "ALL") {
      filtered = filtered.filter((strategy) => strategy.risk === riskFilter)
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "apy":
          return b.apyValue - a.apyValue
        case "tvl":
          return b.tvlValue - a.tvlValue
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, riskFilter, sortBy])

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-3 sm:mb-4">STRATEGIES</h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Select a strategy to view details and manage your position
          </p>
        </div>

        <div className="mb-6 sm:mb-8 max-w-4xl space-y-4 sm:space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-foreground bg-background pl-10 pr-10 py-2 sm:py-3 font-mono text-sm sm:text-base focus:outline-none focus:bg-muted transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            {/* Risk Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-xs sm:text-sm text-muted-foreground self-center mr-2">RISK (β):</span>
              {(["ALL", "LOW", "MEDIUM", "HIGH"] as RiskFilter[]).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`border-2 border-foreground px-3 py-1 font-mono text-xs sm:text-sm transition-colors ${
                    riskFilter === risk ? "bg-foreground text-background" : "bg-background hover:bg-muted"
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-xs sm:text-sm text-muted-foreground self-center mr-2">SORT BY:</span>
              {[
                { value: "apy" as SortOption, label: "APY" },
                { value: "tvl" as SortOption, label: "TVL" },
                { value: "name" as SortOption, label: "NAME" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`border-2 border-foreground px-3 py-1 font-mono text-xs sm:text-sm transition-colors ${
                    sortBy === option.value ? "bg-foreground text-background" : "bg-background hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="font-mono text-xs sm:text-sm text-muted-foreground">
            SHOWING {filteredStrategies.length} OF {strategies.length} STRATEGIES
          </div>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {filteredStrategies.length > 0 ? (
            filteredStrategies.map((strategy) => (
              <div key={strategy.id} className="relative border-2 border-foreground hover:bg-muted transition-colors">
                {/* Info Button */}
                <Link
                  href={strategy.infoPage}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 border-2 border-foreground bg-background p-2 hover:bg-foreground hover:text-background transition-colors group"
                  title="View detailed information"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>

                <Link href={`/app/strategy/${strategy.id}`} className="block p-4 sm:p-6 lg:p-8 pr-12 sm:pr-16">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold font-mono mb-2">{strategy.name}</h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        {strategy.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 border-t-2 border-foreground pt-4 sm:pt-6">
                    <div>
                      <div className="text-xs sm:text-sm font-mono text-muted-foreground mb-1">APY (30D)</div>
                      <div className="text-lg sm:text-2xl font-bold font-mono flex items-center gap-1 sm:gap-2">
                        {strategy.apy}
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-mono text-muted-foreground mb-1">TVL</div>
                      <div className="text-lg sm:text-2xl font-bold font-mono">{strategy.tvl}</div>
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-mono text-muted-foreground mb-1">STATUS</div>
                      <div className="text-lg sm:text-2xl font-bold font-mono flex items-center gap-1 sm:gap-2">
                        ACTIVE
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="border-2 border-foreground p-8 sm:p-12 text-center">
              <p className="font-mono text-lg mb-2">NO STRATEGIES FOUND</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        <div className="mt-12 border-2 border-foreground p-4 sm:p-6 lg:p-8 max-w-4xl bg-muted">
          <p className="font-mono text-xs sm:text-sm">
            <strong>NOTE:</strong> This is a prototype interface. Wallet connection and transaction functionality will
            be implemented in production. All displayed data is for demonstration purposes only.
          </p>
        </div>
      </main>
    </div>
  )
}
