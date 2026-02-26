import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DerivativeArbitrageResultsPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Link
          href="/info"
          className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm mb-6 sm:mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO INFO
        </Link>

        {/* Header */}
        <div className="border-2 border-foreground p-4 sm:p-6 lg:p-8 mb-8 bg-foreground text-background">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-3 sm:mb-4">
            SIMPLE DERIVATIVE ARBITRAGE
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-mono opacity-90">Current Status of Hedge Fund 2 (HF2)</p>
        </div>

        {/* Main Content */}
        <article className="space-y-8">
          {/* Main Problem */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              MAIN PROBLEM
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              There is scarce historical derivatives data available to perform effective backtesting. Cleaning and
              processing this data represents a significant challenge.
            </p>
          </section>

          {/* Proposed Solution */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              PROPOSED SOLUTION
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Implement a live data collection system with the following architecture:
            </p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>PostgreSQL database to store data (initially hosted on Supabase)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Integration with Deribit&apos;s official API to capture real-time opportunities</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Forward testing monitoring at-the-money options</span>
              </li>
            </ul>
          </section>

          {/* Arbitrage Strategy */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              ARBITRAGE STRATEGY
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6">
              Identify pure arbitrages through replicating portfolios and the Black-Scholes model, using the creation of
              synthetic assets:
            </p>

            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">Synthetic Asset Formulas</h3>

            <div className="space-y-4">
              {/* Synthetic Stock */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <div className="font-bold text-sm sm:text-base mb-2">Synthetic Stock:</div>
                <div className="font-mono text-xs sm:text-sm bg-background p-3 border-2 border-foreground overflow-x-auto">
                  Call - Put - PV(Strike) + Dividend
                </div>
              </div>

              {/* Synthetic Bond */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <div className="font-bold text-sm sm:text-base mb-2">Synthetic Bond:</div>
                <div className="font-mono text-xs sm:text-sm bg-background p-3 border-2 border-foreground overflow-x-auto">
                  Stock - Call + Put
                </div>
              </div>

              {/* Synthetic Call */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <div className="font-bold text-sm sm:text-base mb-2">Synthetic Call:</div>
                <div className="font-mono text-xs sm:text-sm bg-background p-3 border-2 border-foreground overflow-x-auto">
                  Stock + Put - PV(Strike + Dividend)
                </div>
              </div>

              {/* Synthetic Put */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <div className="font-bold text-sm sm:text-base mb-2">Synthetic Put:</div>
                <div className="font-mono text-xs sm:text-sm bg-background p-3 border-2 border-foreground overflow-x-auto">
                  Call - Stock + PV(Strike)
                </div>
              </div>
            </div>
          </section>

          {/* Required Help */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-accent/10">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              REQUIRED HELP FROM MARCOS
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4">We need support to:</p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Validate the arbitrage model with replicating portfolios</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Review the technical implementation of the data collection system</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Optimize the arbitrage opportunity detection strategy</span>
              </li>
            </ul>
          </section>

          {/* Implementation Methodology */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              IMPLEMENTATION METHODOLOGY
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6">
              The strategy is based on observing Calls and Puts traded on Deribit&apos;s market to identify arbitrage
              opportunities by comparing them with synthetic assets.
            </p>

            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">Detection Process</h3>
            <ul className="space-y-2 text-sm sm:text-base mb-6">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Observe market prices of Calls and Puts on Deribit</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Create synthetic Calls using replication formulas</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Identify price discrepancies (mispricing) between real and synthetic derivatives</span>
              </li>
            </ul>

            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">MVP Components</h3>
            <div className="grid gap-4">
              <div className="border-2 border-foreground p-4">
                <div className="font-bold text-sm sm:text-base mb-2">Derivatives price source:</div>
                <div className="text-sm sm:text-base text-muted-foreground">Deribit API for options</div>
              </div>
              <div className="border-2 border-foreground p-4">
                <div className="font-bold text-sm sm:text-base mb-2">Interest rates:</div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  Fixed lending and borrowing rates from Aave
                </div>
              </div>
              <div className="border-2 border-foreground p-4">
                <div className="font-bold text-sm sm:text-base mb-2">Algorithm:</div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  Detection of simple arbitrages based on basic mispricing
                </div>
              </div>
            </div>
          </section>

          {/* Status Note */}
          <section className="border-2 border-foreground p-4 sm:p-6 bg-muted/30">
            <h3 className="text-lg sm:text-xl font-bold font-mono mb-3">PROJECT STATUS</h3>
            <p className="text-xs sm:text-sm leading-relaxed">
              This project is currently in the development phase. The live data collection system is being implemented
              to enable forward testing of the synthetic options arbitrage strategy. Backtesting results will be
              available once the historical data collection phase is complete.
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
