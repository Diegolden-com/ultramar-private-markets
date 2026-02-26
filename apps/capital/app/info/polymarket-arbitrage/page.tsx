import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PolymarketArbitragePage() {
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
            VEGA ARBITRAGE STRATEGIES
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-mono opacity-90">Probability Arbitrage System v0</p>
          <div className="mt-4 text-xs sm:text-sm font-mono opacity-75">
            <div>Author: BRRR Capital</div>
            <div>Date: September 22, 2025 | Version: 1.0</div>
          </div>
        </div>

        {/* Main Content */}
        <article className="space-y-8">
          {/* Context */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">CONTEXT</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              This document defines the requirements for Version 0 (MVP) of a quantitative trading system. The strategy
              is based on identifying and exploiting discrepancies between risk-neutral probabilities, calculated
              theoretically with the Black-Scholes model, and the implied probabilities observed in Polymarket
              prediction markets.
            </p>
          </section>

          {/* OKRs */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              OBJECTIVES AND KEY RESULT INDICATORS (OKRs)
            </h2>

            <div className="space-y-6">
              {/* Objective 1 */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">
                  Objective 1: Build a robust MVP system for identifying and executing probability arbitrage
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>KR 1.1:</strong> Develop a calculation engine that derives risk-neutral probabilities from
                      the Black-Scholes model.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>KR 1.2:</strong> Implement a functional API connector with Polymarket that captures market
                      sentiments of the selected markets in real-time.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>KR 1.3:</strong> Successfully execute the first fully automated operation on the
                      production network before December 1, 2025, based on a probability discrepancy above the defined
                      threshold (e.g., 5%).
                    </span>
                  </li>
                </ul>
              </div>

              {/* Objective 2 */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">
                  Objective 2: Validate the thesis that there are exploitable inefficiencies between theoretical models
                  and prediction markets
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>KR 2.1:</strong> Achieve a win rate greater than 60% in the first 100 operations executed.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>KR 2.2:</strong> Obtain a positive return on capital (ROC) after the first 60 days of
                      active trading.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>KR 2.3:</strong> Generate a P&L report that demonstrates a low correlation (beta &lt; 0.2)
                      with the general cryptocurrency market (e.g., BTC/ETH).
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              LIMITATIONS
            </h2>

            <div className="space-y-4">
              <div className="border-2 border-foreground p-4">
                <h3 className="font-bold text-sm sm:text-base mb-2">1. Theoretical Model (v0)</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  The strategy will strictly rely on the standard Black-Scholes model. More complex models (e.g., Merton
                  jumps, stochastic volatility) will not be implemented in this initial version.
                </p>
              </div>

              <div className="border-2 border-foreground p-4">
                <h3 className="font-bold text-sm sm:text-base mb-2">2. Market Scope</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Operations will focus exclusively on Polymarket markets related to digital asset price events (e.g.,
                  &quot;Will ETH exceed $5,000 by December 31?&quot;), where Black-Scholes parameters are directly applicable.
                </p>
              </div>

              <div className="border-2 border-foreground p-4">
                <h3 className="font-bold text-sm sm:text-base mb-2">3. Volatility Management</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-2">
                  Implied volatility, a key input, will be obtained from traditional options markets. The system will
                  not calculate its own implied volatility in v0.
                </p>
                <div className="text-xs sm:text-sm font-mono space-y-1 mt-2">
                  <div>• Deribit</div>
                  <div>• AEVO</div>
                  <div>• Hyperliquid</div>
                  <div>• Eventually we&apos;ll do a GARCH</div>
                </div>
              </div>

              <div className="border-2 border-foreground p-4">
                <h3 className="font-bold text-sm sm:text-base mb-2">4. Platform Dependency</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  The strategy is 100% dependent on Polymarket&apos;s API, liquidity, and continuous operation of its smart
                  contracts on the Polygon network.
                </p>
              </div>
            </div>
          </section>

          {/* Assumptions */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-muted/30">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              ASSUMPTIONS
            </h2>

            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Validity of the Model:</strong> We assume that the Black-Scholes model, despite its
                  simplifications, provides a reasonable approximation of risk-neutral probability for defined price
                  events.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Market Inefficiency:</strong> We assume that prices in Polymarket are influenced by cognitive
                  biases, asymmetric information flows, and sentiment, creating exploitable deviations relative to
                  theoretical probability.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Data Availability:</strong> We assume constant and reliable access to data feeds for the model
                  inputs: spot price, implied volatility, and risk-free interest rates.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Adequate Liquidity:</strong> We assume that the selected markets in Polymarket will have
                  sufficient liquidity to execute economically viable operations without significant adverse price
                  impact.
                </span>
              </li>
            </ul>
          </section>

          {/* Dependencies */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              DEPENDENCIES
            </h2>

            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Financial Data API:</strong> The system critically depends on an external data provider (e.g.,
                  Deribit API, Chainlink) to obtain real-time implied volatility and spot prices.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Polymarket API:</strong> All functionality for reading market sentiments and executing orders
                  depends on the stability and documentation of Polymarket&apos;s API.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>On-Chain Infrastructure:</strong> Transaction execution requires a reliable RPC provider for
                  the Polygon network to minimize front-running risk and transaction failures.
                </span>
              </li>
            </ul>
          </section>

          {/* High-Level Epics */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              TASKS / HIGH-LEVEL EPICS
            </h2>

            <div className="space-y-4">
              {/* Epic 1 */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">
                  Epic 1: Theoretical Valuation Engine (Off-Chain)
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 1.1:</strong> Develop the central Black-Scholes module to calculate option prices and
                      &quot;greeks&quot; (Delta, Vega, etc.).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 1.2:</strong> Create a function to convert the option Delta into a risk-neutral
                      probability.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 1.3:</strong> Integrate real-time data feeds (spot price, volatility, interest rate)
                      as inputs for the engine.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Epic 2 */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">
                  Epic 2: Polymarket Connector and Executor (Off-Chain with On-Chain Interaction)
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 2.1:</strong> Develop the API client to query active markets and their sentiments in
                      Polymarket.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 2.2:</strong> Implement logic to convert Polymarket sentiments into implied
                      probabilities.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 2.3:</strong> Build the execution module that interacts with Polymarket&apos;s smart
                      contracts to buy and sell shares.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Epic 3 */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">Epic 3: Strategy Logic and Risk Management</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 3.1:</strong> Create the &quot;Manager&quot; that continuously compares theoretical probability
                      with market-observed probability.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 3.2:</strong> Define and implement the discrepancy thresholds that trigger an entry
                      order.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 3.3:</strong> Develop risk management rules, including position sizing based on
                      conviction (magnitude of discrepancy) and available capital.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Epic 4 */}
              <div className="border-2 border-foreground p-4 bg-muted/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">Epic 4: Monitoring and Reporting Dashboard</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 4.1:</strong> Build a real-time visualization interface that shows probability
                      discrepancies, open positions, and current P&L.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Task 4.2:</strong> Implement an alert system to notify the team about each executed trade
                      and any anomalies in the system.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Replicating Portfolio Configuration - MOST IMPORTANT SECTION */}
          <section className="border-2 border-foreground p-4 sm:p-6 lg:p-8 bg-accent/10">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 border-b-2 border-foreground pb-2">
              REPLICATING PORTFOLIO CONFIGURATION FOR ARBITRAGE
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-6">
              The proposed arbitrage strategy is based on the construction of replicating portfolios that allow
              exploiting discrepancies between theoretical probabilities and implied probabilities in prediction
              markets.
            </p>

            <div className="space-y-6">
              {/* 1. Fundamental Principle */}
              <div className="border-2 border-foreground p-4 bg-background">
                <h3 className="font-bold text-base sm:text-lg mb-3">1. Fundamental Principle of Arbitrage</h3>
                <p className="text-sm sm:text-base mb-2">
                  Arbitrage is executed when we identify a significant difference between:
                </p>
                <ul className="space-y-2 text-sm sm:text-base ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>The risk-neutral probability derived from the Black-Scholes model (P_BS)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>The implied probability in Polymarket prices (P_PM)</span>
                  </li>
                </ul>
              </div>

              {/* 2. Portfolio Construction */}
              <div className="border-2 border-foreground p-4 bg-background">
                <h3 className="font-bold text-base sm:text-lg mb-3">2. Replicating Portfolio Construction</h3>

                <div className="space-y-4">
                  <div className="border-2 border-foreground p-3 bg-muted/30">
                    <h4 className="font-bold text-sm sm:text-base mb-2">
                      When P_BS &gt; P_PM (theoretical probability greater than market probability):
                    </h4>
                    <ul className="space-y-2 text-sm sm:text-base ml-4">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          <strong>Main Position:</strong> Buy &quot;YES&quot; shares in Polymarket (betting on the event
                          occurring)
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          <strong>Complementary Hedge:</strong> Establish a short position in the underlying asset
                          proportional to the calculated Delta
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-2 border-foreground p-3 bg-muted/30">
                    <h4 className="font-bold text-sm sm:text-base mb-2">
                      When P_BS &lt; P_PM (theoretical probability less than market probability):
                    </h4>
                    <ul className="space-y-2 text-sm sm:text-base ml-4">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          <strong>Main Position:</strong> Buy &quot;NO&quot; shares in Polymarket (betting on the event not
                          occurring)
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>
                          <strong>Complementary Hedge:</strong> Establish a long position in the underlying asset
                          proportional to the calculated Delta
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Position Sizing */}
              <div className="border-2 border-foreground p-4 bg-background">
                <h3 className="font-bold text-base sm:text-lg mb-3">3. Determination of Position Size</h3>
                <p className="text-sm sm:text-base mb-3">
                  The optimal replicating portfolio size is calculated using the following factors:
                </p>
                <ul className="space-y-2 text-sm sm:text-base ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Magnitude of Discrepancy:</strong> Greater discrepancy = Larger capital allocation
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Modified Kelly Criterion:</strong> Determines the optimal percentage of capital to risk
                      based on the probability of success and expected gain/loss ratio
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Available Liquidity:</strong> Adjusts size to avoid significant market impact
                    </span>
                  </li>
                </ul>
              </div>

              {/* 4. Dynamic Management */}
              <div className="border-2 border-foreground p-4 bg-background">
                <h3 className="font-bold text-base sm:text-lg mb-3">4. Dynamic Portfolio Management</h3>
                <p className="text-sm sm:text-base mb-3">
                  The replicating portfolio requires continuous rebalancing to maintain risk neutrality:
                </p>
                <ul className="space-y-2 text-sm sm:text-base ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Rebalancing Frequency:</strong> Depends on the underlying asset&apos;s volatility and the time
                      until the event resolution
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Gamma Management:</strong> Adjust positions when significant changes in the underlying
                      asset&apos;s price affect the Delta
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Trigger Points:</strong> Rebalance when the discrepancy between P_BS and P_PM changes by
                      more than X percentage points
                    </span>
                  </li>
                </ul>
              </div>

              {/* 5. Technical Implementation */}
              <div className="border-2 border-foreground p-4 bg-background">
                <h3 className="font-bold text-base sm:text-lg mb-3">5. Technical Implementation of the Portfolio</h3>
                <p className="text-sm sm:text-base mb-3">To implement replicating portfolios, the system needs:</p>
                <ul className="space-y-2 text-sm sm:text-base ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Segregated Accounts:</strong> Maintain separate accounts on perpetuals/futures exchanges
                      for the hedge component
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Dedicated Wallet:</strong> For operations in Polymarket connected to the automated system
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Gas Reserve:</strong> Maintain a dedicated fund for on-chain transactions to ensure quick
                      execution
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Reconciliation Module:</strong> System that verifies and reconciles positions between
                      Polymarket and derivatives exchanges
                    </span>
                  </li>
                </ul>
              </div>

              {/* 6. Specific Risk Management */}
              <div className="border-2 border-foreground p-4 bg-background">
                <h3 className="font-bold text-base sm:text-lg mb-3">6. Specific Risk Management</h3>
                <p className="text-sm sm:text-base mb-3">Specific risks that require mitigation in this strategy:</p>
                <ul className="space-y-2 text-sm sm:text-base ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Correlation Risk:</strong> Monitor and adjust when the correlation between the underlying
                      asset and the prediction market deviates
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Liquidity Risk:</strong> Establish position size limits proportional to available
                      liquidity in Polymarket
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Execution Risk:</strong> Implement execution algorithms that minimize slippage and detect
                      adverse conditions
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      <strong>Model Risk:</strong> Periodically compare model predictions against real results to
                      calibrate parameters
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Status Note */}
          <section className="border-2 border-foreground p-4 sm:p-6 bg-muted/30">
            <h3 className="text-lg sm:text-xl font-bold font-mono mb-3">PROJECT STATUS</h3>
            <p className="text-xs sm:text-sm leading-relaxed">
              This strategy is in active development. The MVP is scheduled for launch before December 1, 2025, with the
              capability to execute the first fully automated operation based on probability discrepancies. The system
              initially focuses on Polymarket&apos;s digital asset price markets where the Black-Scholes model is directly
              applicable.
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
