import { Navigation } from "@/components/navigation"
import { ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { EquityCurveChart } from "@/components/equity-curve-chart"

type StrategyData = {
  name: string
  description: string
  apy: string
  tvl: string
  risk: string
  userBalance: string
  userBalanceUSD: string
  pnl30d: string
  pnlPercentage: string
}

const strategyData: Record<string, StrategyData> = {
  "lending-markets": {
    name: "LENDING MARKETS",
    description:
      "Automated lending across multiple DeFi protocols with dynamic rate optimization. This strategy automatically allocates capital to the highest-yielding lending protocols while maintaining risk parameters.",
    apy: "+12.4%",
    tvl: "$2.4M",
    risk: "LOW",
    userBalance: "0.00",
    userBalanceUSD: "$0.00",
    pnl30d: "+$0.00",
    pnlPercentage: "+0.00%",
  },
  "derivative-arbitrage": {
    name: "DERIVATIVE ARBITRAGE",
    description:
      "General derivative arbitrage using synthetic options and replicating portfolios across multiple markets. This strategy identifies mispricing opportunities in derivatives markets and constructs hedged positions to capture arbitrage profits.",
    apy: "+18.6%",
    tvl: "$1.5M",
    risk: "MEDIUM",
    userBalance: "0.00",
    userBalanceUSD: "$0.00",
    pnl30d: "+$0.00",
    pnlPercentage: "+0.00%",
  },
  "polymarket-synthetic-options": {
    name: "POLYMARKET ARBITRAGE",
    description:
      "Specialized arbitrage strategy focused on Polymarket prediction markets with vega hedging. This strategy creates synthetic option positions using prediction market outcomes and dynamically hedges vega exposure for consistent returns.",
    apy: "+24.8%",
    tvl: "$890K",
    risk: "MEDIUM",
    userBalance: "0.00",
    userBalanceUSD: "$0.00",
    pnl30d: "+$0.00",
    pnlPercentage: "+0.00%",
  },
  "private-equities": {
    name: "PRIVATE EQUITIES",
    description:
      "Tokenized private equity investments with automated portfolio rebalancing and yield optimization. This strategy provides exposure to high-growth private companies through tokenized equity positions with dynamic risk management.",
    apy: "+32.6%",
    tvl: "$1.2M",
    risk: "HIGH",
    userBalance: "0.00",
    userBalanceUSD: "$0.00",
    pnl30d: "+$0.00",
    pnlPercentage: "+0.00%",
  },
}

export default async function StrategyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const strategy = strategyData[id]

  if (!strategy) {
    return <div>Strategy not found</div>
  }

  const featuredCompanies = [
    {
      name: "OPENAI",
      description: "Leading AI research and deployment company",
      valuation: "$157B",
    },
    {
      name: "SPACEX",
      description: "Aerospace manufacturer and space transportation",
      valuation: "$180B",
    },
    {
      name: "STRIPE",
      description: "Financial infrastructure for the internet",
      valuation: "$65B",
    },
    {
      name: "ANTHROPIC",
      description: "AI safety and research company",
      valuation: "$18B",
    },
    {
      name: "DATABRICKS",
      description: "Unified analytics and AI platform",
      valuation: "$43B",
    },
    {
      name: "DISCORD",
      description: "Voice, video, and text communication platform",
      valuation: "$15B",
    },
    {
      name: "FIGMA",
      description: "Collaborative design and prototyping tool",
      valuation: "$20B",
    },
    {
      name: "NOTION",
      description: "All-in-one workspace and productivity platform",
      valuation: "$10B",
    },
    {
      name: "CANVA",
      description: "Online graphic design and publishing platform",
      valuation: "$26B",
    },
    {
      name: "EPIC GAMES",
      description: "Video game and software developer",
      valuation: "$31.5B",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-full overflow-x-hidden">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm mb-6 sm:mb-8 hover:underline"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="truncate">BACK TO STRATEGIES</span>
        </Link>

        {/* Banner */}
        <div className="border-2 border-foreground p-4 sm:p-8 lg:p-12 mb-6 sm:mb-8 bg-foreground text-background">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-mono mb-3 sm:mb-4 leading-tight break-words">
                {strategy.name}
              </h1>
              <p className="text-xs sm:text-base lg:text-xl leading-relaxed break-words">{strategy.description}</p>
            </div>
            <div className="border-2 border-background px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm lg:text-base self-start whitespace-nowrap flex-shrink-0">
              {strategy.risk} RISK
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 border-t-2 border-background pt-4 sm:pt-6">
            <div className="min-w-0">
              <div className="text-xs font-mono mb-1 opacity-80">APY (30D)</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold font-mono truncate">{strategy.apy}</div>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono mb-1 opacity-80">TVL</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold font-mono truncate">{strategy.tvl}</div>
            </div>
            <div className="col-span-2 sm:col-span-1 min-w-0">
              <div className="text-xs font-mono mb-1 opacity-80">STATUS</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold font-mono truncate">ACTIVE</div>
            </div>
          </div>
        </div>

        {id === "private-equities" && (
          <div className="mb-6 sm:mb-8">
            <div className="border-2 border-foreground">
              <div className="bg-foreground text-background p-3 sm:p-4 border-b-2 border-background">
                <h2 className="font-mono text-sm sm:text-base font-bold tracking-wider">FEATURED COMPANIES</h2>
              </div>
              <div className="bg-background p-4 sm:p-6">
                <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
                  <div className="flex gap-4 pb-4 snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                    {featuredCompanies.map((company) => (
                      <div
                        key={company.name}
                        className="flex-shrink-0 w-[280px] sm:w-[320px] border-2 border-foreground p-4 sm:p-6 snap-start hover:bg-muted transition-colors"
                      >
                        <h3 className="font-mono text-lg sm:text-xl font-bold mb-2">{company.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                          {company.description}
                        </p>
                        <div className="border-t-2 border-foreground pt-3">
                          <div className="text-xs font-mono text-muted-foreground mb-1">VALUATION</div>
                          <div className="text-base sm:text-lg font-bold font-mono text-accent">
                            {company.valuation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-4 text-center">
                  ← Scroll to explore featured private equity opportunities →
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - User Position */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* User Balance */}
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="font-mono text-xs sm:text-sm mb-3 sm:mb-4 text-muted-foreground">YOUR BALANCE</h3>
              <div className="text-2xl sm:text-4xl font-bold font-mono mb-2 truncate">{strategy.userBalance}</div>
              <div className="text-base sm:text-xl text-muted-foreground truncate">{strategy.userBalanceUSD}</div>
            </div>

            {/* 30D P&L */}
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="font-mono text-xs sm:text-sm mb-3 sm:mb-4 text-muted-foreground">30D PROFIT/LOSS</h3>
              <div className="text-2xl sm:text-4xl font-bold font-mono mb-2 flex items-center gap-2">
                <span className="truncate">{strategy.pnl30d}</span>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
              </div>
              <div className="text-base sm:text-xl text-accent font-mono truncate">{strategy.pnlPercentage}</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button className="w-full bg-foreground text-background py-3 sm:py-4 font-mono text-base sm:text-lg border-2 border-foreground hover:bg-foreground/90 transition-colors">
                BUY
              </button>
              <button className="w-full bg-background text-foreground py-3 sm:py-4 font-mono text-base sm:text-lg border-2 border-foreground hover:bg-muted transition-colors">
                SELL
              </button>
              <p className="text-xs sm:text-sm font-mono text-muted-foreground border-2 border-foreground p-3 sm:p-4 break-words">
                <strong>FUNCTIONALITY:</strong> These buttons will trigger wallet transactions to deposit (BUY) or
                withdraw (SELL) from this strategy. Requires wallet connection.
              </p>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="lg:col-span-2 min-w-0">
            <div className="border-2 border-foreground overflow-hidden">
              {/* Chart Header */}
              <div className="bg-foreground text-background p-3 sm:p-4 border-b-2 border-background">
                <h3 className="font-mono text-sm sm:text-base font-bold tracking-wider">EQUITY CURVE (30D)</h3>
              </div>

              {/* Chart Container */}
              <div className="bg-background p-3 sm:p-4 lg:p-6 pb-16 sm:pb-20 lg:pb-24">
                <div className="h-[280px] sm:h-[360px] lg:h-[420px] w-full">
                  <EquityCurveChart />
                </div>
              </div>

              {/* Chart Info - Collapsible on mobile feel */}
              <div className="border-t-2 border-foreground bg-muted/30 p-3 sm:p-4">
                <details className="group" open>
                  <summary className="font-mono text-xs sm:text-sm font-bold cursor-pointer list-none flex items-center justify-between hover:text-accent transition-colors">
                    <span>CHART INFORMATION</span>
                    <span className="text-lg group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-xs sm:text-sm font-mono text-muted-foreground mt-3 leading-relaxed">
                    This equity curve shows the strategy&apos;s performance over the last 30 days. The chart displays
                    cumulative returns and helps visualize drawdowns and growth periods.
                    <span className="block mt-2 text-accent">⚠ Demo data - Connect wallet to see real performance</span>
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
