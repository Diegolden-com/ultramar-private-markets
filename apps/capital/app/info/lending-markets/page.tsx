import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LendingMarketsResultsPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        <Link
          href="/info"
          className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm mb-6 sm:mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO INFO
        </Link>

        {/* Header */}
        <div className="border-2 border-foreground p-4 sm:p-6 lg:p-8 mb-8 bg-foreground text-background">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-3 sm:mb-4">ODISEA HF1</h1>
          <p className="text-sm sm:text-base lg:text-lg font-mono opacity-90">
            Cross-Network Arbitrage Backtesting Results
          </p>
        </div>

        {/* Content */}
        <article className="space-y-8 sm:space-y-12 font-mono text-sm sm:text-base">
          {/* Overview Section */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">OVERVIEW</h2>
            <p className="leading-relaxed mb-4">
              <strong>HF1 (Base USDC Configuration)</strong> is a Python-based backtesting model that evaluates{" "}
              <strong>cross-network arbitrage opportunities</strong> for{" "}
              <strong>USDC lending and borrowing rates</strong> across Aave deployments on{" "}
              <strong>Arbitrum, Ethereum, and Base</strong>.
            </p>
            <p className="leading-relaxed">
              It focuses exclusively on <strong>USDC</strong>, using historical DeFi data to simulate arbitrage activity
              and measure potential portfolio performance under various <strong>transaction cost scenarios</strong>.
            </p>
          </section>

          {/* Objective */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-muted/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">OBJECTIVE</h2>
            <p className="leading-relaxed">
              This analysis measures how differences in <strong>Aave lending and borrowing APRs</strong> between
              networks could be exploited through arbitrage — lending where supply yields are highest and borrowing
              where rates are lowest — while accounting for transaction costs and liquidity conditions.
            </p>
          </section>

          {/* Base Configuration Table */}
          <section className="border-2 border-foreground">
            <div className="bg-foreground text-background p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold">BASE CONFIGURATION</h2>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              {[
                { label: "Stablecoin", value: "USDC" },
                { label: "Networks", value: "Arbitrum, Ethereum, Base" },
                { label: "Entry Threshold", value: "1.0% APR" },
                { label: "Exit Threshold", value: "0.6% APR" },
                { label: "Initial Capital", value: "100,000 USD" },
                { label: "Simulation Period", value: "2023–2025" },
                { label: "Cost Scenarios", value: "0.0025 – 1.0 USD" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center border-b border-foreground pb-3 last:border-0"
                >
                  <div className="font-bold mb-1 sm:mb-0 sm:w-1/3">{item.label}</div>
                  <div className="text-muted-foreground sm:w-2/3">{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Model Description */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">MODEL DESCRIPTION</h2>
            <p className="leading-relaxed mb-4">For each day:</p>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>
                The model identifies the <strong>highest supply rate</strong> and the{" "}
                <strong>lowest borrow rate</strong> across the three networks.
              </li>
              <li>
                It computes the <strong>APR spread</strong> = (max supply – min borrow).
              </li>
              <li>If the spread exceeds the entry threshold, the model enters a position.</li>
              <li>
                While open, capital compounds daily by <code className="bg-muted px-2 py-1">(spread / 365)</code>.
              </li>
              <li>When the spread falls below the exit threshold, the position closes.</li>
              <li>Network switches trigger a transaction cost proportional to the chosen scenario.</li>
            </ol>
          </section>

          {/* Portfolio Behavior */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-muted/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">PORTFOLIO BEHAVIOR</h2>
            <p className="leading-relaxed mb-4">
              The equity curve remains flat during long low-yield periods and rises when the spread is high enough to
              justify entering trades.
            </p>
            <ul className="space-y-2 leading-relaxed">
              <li>
                <strong>Flat periods (2023–mid 2024):</strong> markets balanced, no significant spread.
              </li>
              <li>
                <strong>Sharp growth (late 2024):</strong> Base and Ethereum diverge strongly → sustained arbitrage
                opportunities.
              </li>
              <li>
                <strong>Plateau (2025):</strong> spreads normalize and portfolio stabilizes.
              </li>
            </ul>
          </section>

          {/* Key Metrics */}
          <section className="border-2 border-foreground">
            <div className="bg-foreground text-background p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold">KEY METRICS</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="border-b-2 border-foreground">
                    <th className="text-left p-3 sm:p-4 font-bold">Metric</th>
                    <th className="text-left p-3 sm:p-4 font-bold">Description</th>
                    <th className="text-left p-3 sm:p-4 font-bold">Typical Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Total Return %", desc: "Net portfolio growth", result: "+7–8%" },
                    { metric: "Sharpe Ratio", desc: "Return-to-risk measure", result: "~1.8" },
                    { metric: "Max Drawdown %", desc: "Largest equity drop", result: "<0.5%" },
                    { metric: "Days in Position", desc: "Active arbitrage days", result: "~25% of total" },
                    { metric: "Cross-Network Switches", desc: "Network changes", result: "5–7" },
                    { metric: "Intra-Network Switches", desc: "Switches within same network", result: "15–20" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-foreground">
                      <td className="p-3 sm:p-4 font-bold">{row.metric}</td>
                      <td className="p-3 sm:p-4 text-muted-foreground">{row.desc}</td>
                      <td className="p-3 sm:p-4">{row.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 sm:p-6 bg-muted/20 border-t-2 border-foreground">
              <p className="text-sm leading-relaxed">
                The base configuration turned out to be the one with the highest Total Return. The &quot;Ultra Low&quot; cost
                scenario of 0.0025 USD ended with a total return of <strong>8.13%</strong>. The model prioritizes{" "}
                <strong>intra-network trades</strong> (low-cost) and only bridges when the expected return compensates
                for the higher gas fees.
              </p>
            </div>
          </section>

          {/* USDC Summary Table */}
          <section className="border-2 border-foreground">
            <div className="bg-foreground text-background p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold">USDC BASE CONFIGURATION RESULTS</h2>
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden p-4 space-y-4">
              {[
                {
                  scenario: "Ultra Low (0.0025)",
                  equity: "108,133",
                  return: "+8.134%",
                  sharpe: "6.654",
                  drawdown: "0.0",
                },
                { scenario: "Low (0.025)", equity: "108,129", return: "+8.13%", sharpe: "6.651", drawdown: "0.0" },
                { scenario: "Moderate (0.05)", equity: "108,125", return: "+8.125%", sharpe: "6.649", drawdown: "0.0" },
                { scenario: "High (0.5)", equity: "108,044", return: "+8.044%", sharpe: "6.60", drawdown: "0.0" },
                { scenario: "Very High (1.0)", equity: "107,953", return: "+7.954%", sharpe: "6.55", drawdown: "0.0" },
              ].map((row, i) => (
                <div key={i} className="border-2 border-foreground p-4 space-y-2">
                  <div className="font-bold text-lg mb-3">{row.scenario}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Final Equity</div>
                      <div className="font-bold">${row.equity}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Total Return</div>
                      <div className="font-bold text-accent">{row.return}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Sharpe</div>
                      <div className="font-bold">{row.sharpe}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Max Drawdown</div>
                      <div className="font-bold">{row.drawdown}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="border-b-2 border-foreground">
                    <th className="text-left p-4 font-bold">Scenario</th>
                    <th className="text-left p-4 font-bold">Final Equity (USD)</th>
                    <th className="text-left p-4 font-bold">Total Return %</th>
                    <th className="text-left p-4 font-bold">Sharpe</th>
                    <th className="text-left p-4 font-bold">Max Drawdown %</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      scenario: "Ultra Low (0.0025)",
                      equity: "108,133",
                      return: "+8.134%",
                      sharpe: "6.654",
                      drawdown: "0.0",
                    },
                    { scenario: "Low (0.025)", equity: "108,129", return: "+8.13%", sharpe: "6.651", drawdown: "0.0" },
                    {
                      scenario: "Moderate (0.05)",
                      equity: "108,125",
                      return: "+8.125%",
                      sharpe: "6.649",
                      drawdown: "0.0",
                    },
                    { scenario: "High (0.5)", equity: "108,044", return: "+8.044%", sharpe: "6.60", drawdown: "0.0" },
                    {
                      scenario: "Very High (1.0)",
                      equity: "107,953",
                      return: "+7.954%",
                      sharpe: "6.55",
                      drawdown: "0.0",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-foreground">
                      <td className="p-4 font-bold">{row.scenario}</td>
                      <td className="p-4">${row.equity}</td>
                      <td className="p-4 text-accent font-bold">{row.return}</td>
                      <td className="p-4">{row.sharpe}</td>
                      <td className="p-4">{row.drawdown}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* USDT Configuration */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-muted/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">USDT BASE CONFIGURATION</h2>
            <p className="leading-relaxed mb-4">
              The same model was applied to <strong>USDT</strong> across the same networks. The USDT arbitrage strategy
              behaves slightly more conservatively than the USDC case due to lower liquidity depth and narrower spreads
              across chains.
            </p>
            <p className="leading-relaxed">
              The USDT model, even though it has positive total returns for all its cost scenarios, is nowhere near the
              results of the USDC model. Even the highest cost USDC model has a higher total return than the lowest cost
              USDT scenario (7.954% vs 2.185%).
            </p>
          </section>

          {/* USDT Summary Table */}
          <section className="border-2 border-foreground">
            <div className="bg-foreground text-background p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold">USDT BASE CONFIGURATION RESULTS</h2>
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden p-4 space-y-4">
              {[
                {
                  scenario: "Ultra Low (0.0025)",
                  equity: "102,184",
                  return: "+2.185%",
                  sharpe: "5.328",
                  drawdown: "0.0",
                },
                { scenario: "Low (0.025)", equity: "102,182", return: "+2.182%", sharpe: "5.325", drawdown: "0.0" },
                { scenario: "Moderate (0.05)", equity: "102,179", return: "+2.18%", sharpe: "5.322", drawdown: "0.0" },
                { scenario: "High (0.5)", equity: "102,133", return: "+2.134%", sharpe: "5.271", drawdown: "0.0" },
                { scenario: "Very High (1.0)", equity: "102,082", return: "+2.083%", sharpe: "5.211", drawdown: "0.0" },
              ].map((row, i) => (
                <div key={i} className="border-2 border-foreground p-4 space-y-2">
                  <div className="font-bold text-lg mb-3">{row.scenario}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Final Equity</div>
                      <div className="font-bold">${row.equity}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Total Return</div>
                      <div className="font-bold text-accent">{row.return}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Sharpe</div>
                      <div className="font-bold">{row.sharpe}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Max Drawdown</div>
                      <div className="font-bold">{row.drawdown}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="border-b-2 border-foreground">
                    <th className="text-left p-4 font-bold">Scenario</th>
                    <th className="text-left p-4 font-bold">Final Equity (USD)</th>
                    <th className="text-left p-4 font-bold">Total Return %</th>
                    <th className="text-left p-4 font-bold">Sharpe</th>
                    <th className="text-left p-4 font-bold">Max Drawdown %</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      scenario: "Ultra Low (0.0025)",
                      equity: "102,184",
                      return: "+2.185%",
                      sharpe: "5.328",
                      drawdown: "0.0",
                    },
                    { scenario: "Low (0.025)", equity: "102,182", return: "+2.182%", sharpe: "5.325", drawdown: "0.0" },
                    {
                      scenario: "Moderate (0.05)",
                      equity: "102,179",
                      return: "+2.18%",
                      sharpe: "5.322",
                      drawdown: "0.0",
                    },
                    { scenario: "High (0.5)", equity: "102,133", return: "+2.134%", sharpe: "5.271", drawdown: "0.0" },
                    {
                      scenario: "Very High (1.0)",
                      equity: "102,082",
                      return: "+2.083%",
                      sharpe: "5.211",
                      drawdown: "0.0",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-foreground">
                      <td className="p-4 font-bold">{row.scenario}</td>
                      <td className="p-4">${row.equity}</td>
                      <td className="p-4 text-accent font-bold">{row.return}</td>
                      <td className="p-4">{row.sharpe}</td>
                      <td className="p-4">{row.drawdown}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bridge-Aware Analysis */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              BRIDGE-AWARE CROSS-NETWORK & CROSS-STABLECOIN ARBITRAGE
            </h2>
            <p className="leading-relaxed mb-4">
              This module extends the base USDC/USDT analyses into a <strong>multi-scenario backtest</strong> capable of
              simulating cross-network and cross-stablecoin arbitrage strategies. It integrates liquidity data from{" "}
              <strong>Arbitrum</strong>, <strong>Ethereum</strong>, and <strong>Base</strong>, introducing both{" "}
              <em>intra-network</em> and <em>cross-network</em> transaction costs to evaluate the real-world
              profitability of these opportunities.
            </p>

            <h3 className="text-xl font-bold mb-3 mt-6">Simulation Parameters</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <div className="flex flex-col sm:flex-row border-b border-foreground pb-2">
                <div className="font-bold sm:w-1/3">Entry Thresholds</div>
                <div className="text-muted-foreground sm:w-2/3">0.2% – 0.6%</div>
              </div>
              <div className="flex flex-col sm:flex-row border-b border-foreground pb-2">
                <div className="font-bold sm:w-1/3">Exit Thresholds</div>
                <div className="text-muted-foreground sm:w-2/3">0.1% – 0.5%</div>
              </div>
              <div className="flex flex-col sm:flex-row border-b border-foreground pb-2">
                <div className="font-bold sm:w-1/3">Initial Capitals</div>
                <div className="text-muted-foreground sm:w-2/3">5k – 100k USD</div>
              </div>
              <div className="flex flex-col sm:flex-row border-b border-foreground pb-2">
                <div className="font-bold sm:w-1/3">Intra-Network Cost</div>
                <div className="text-muted-foreground sm:w-2/3">0.001 – 0.5 USD</div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="font-bold sm:w-1/3">Cross-Network Cost</div>
                <div className="text-muted-foreground sm:w-2/3">1.0 – 5.0 USD</div>
              </div>
            </div>
          </section>

          {/* Interpretation */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-muted/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">INTERPRETATION OF RESULTS</h2>
            <div className="space-y-4">
              <div className="border-2 border-foreground p-4">
                <div className="font-bold mb-2">2023 – Mid 2024: Flat</div>
                <div className="text-sm text-muted-foreground">No significant spreads; idle capital</div>
              </div>
              <div className="border-2 border-foreground p-4">
                <div className="font-bold mb-2">Q4 2024: Sharp Rise</div>
                <div className="text-sm text-muted-foreground">
                  Market dislocation; yield gaps widened → profitable arbitrage
                </div>
              </div>
              <div className="border-2 border-foreground p-4">
                <div className="font-bold mb-2">2025: Plateau</div>
                <div className="text-sm text-muted-foreground">Spread compression; reduced opportunities</div>
              </div>
            </div>
            <p className="leading-relaxed mt-6 text-sm">
              This pattern validates the strategy&apos;s conservative nature — it only trades during favorable yield
              divergences and preserves capital otherwise.
            </p>
          </section>

          {/* Conclusion */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">CONCLUSION</h2>
            <p className="leading-relaxed mb-4">
              The HF1 framework demonstrates how algorithmic arbitrage strategies can be modeled, tested, and evaluated
              across both <strong>stablecoin</strong> (USDC–USDT) and <strong>network</strong> (Arbitrum, Ethereum,
              Base) dimensions. By incorporating transaction and bridge costs, the simulation captures the trade-off
              between <strong>profit opportunity and operational friction</strong>.
            </p>
            <p className="leading-relaxed mb-4">
              Throughout all configurations, the <strong>equity curve pattern</strong> remains consistent — a long
              period of flat behavior followed by rapid growth near the end of 2024, corresponding to a spike in lending
              and borrowing rate differentials across DeFi protocols.
            </p>
            <p className="leading-relaxed">
              The HF1 cross-analysis serves as a realistic and cost-aware foundation for understanding the{" "}
              <strong>timing, scale, and feasibility</strong> of future on-chain arbitrage implementations.
            </p>
          </section>

          {/* Author */}
          <section className="border-2 border-foreground p-4 sm:p-6 bg-foreground text-background">
            <div className="text-sm">
              <div className="font-bold mb-1">AUTHOR</div>
              <div>Carlos Arroyo</div>
              <div className="opacity-75">Economist & Data Analyst — Odisea HF1 Project</div>
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}
