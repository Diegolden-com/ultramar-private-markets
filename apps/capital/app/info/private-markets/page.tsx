import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivateMarketsPage() {
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

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-6 sm:mb-8">PRIVATE MARKETS</h1>

        {/* Core Value Proposition */}
        <section className="mb-8 sm:mb-12">
          <div className="border-2 border-foreground bg-foreground text-background p-4 sm:p-6 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-3">CORE VALUE PROPOSITION</h2>
            <p className="font-mono text-sm sm:text-base leading-relaxed">
              A next-generation exchange that tokenizes private company equity and uses AI-driven continuous compliance
              monitoring to democratize access to high-growth private markets while maintaining investor protection.
            </p>
          </div>

          {/* The Problem */}
          <div className="border-2 border-foreground p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">THE PROBLEM</h3>
            <ul className="space-y-2 font-mono text-sm sm:text-base text-muted-foreground">
              <li>
                • Private markets are dominated by institutional investors and private equity funds, keeping retail
                investors out
              </li>
              <li>
                • Companies go public much later (at trillion-dollar valuations rather than billions), after most growth
                has occurred
              </li>
              <li>• This system exacerbates income inequality as institutional investors capture most of the upside</li>
              <li>• Companies often go public only after exhausting &quot;rational investors&quot; in private markets</li>
              <li>• Traditional exchanges are limited hours and costly to access and list</li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="border-2 border-foreground p-4 sm:p-6 bg-muted/30">
            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">THE SOLUTION</h3>
            <ul className="space-y-2 font-mono text-sm sm:text-base text-muted-foreground">
              <li>• Tokenize ownership of vetted private companies ($10–30M+ revenue or strong recurring revenue)</li>
              <li>• Always-on AI taps company financial APIs to produce real-time compliance scores</li>
              <li>• 24/7 global trading access with lower fees and simplified participation</li>
              <li>• Create tokenized ownership of companies with $10-30M+ in revenue</li>
              <li>• Implement AI monitoring that taps into company financial APIs (bank accounts, receivables)</li>
              <li>• AI provides real-time compliance rankings or &quot;smell tests&quot; to validate legitimacy</li>
              <li>• Goal: provide retail investors access while maintaining fraud protection</li>
            </ul>
          </div>
        </section>

        {/* Why Tokenization */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">WHY TOKENIZATION VS. TRADITIONAL MARKETS</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">24/7 GLOBAL LIQUIDITY</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                Unlike traditional exchanges limited to 35 hours/week, tokenized assets trade continuously across time
                zones
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">LOWER BARRIERS TO ENTRY</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                No costly listing requirements—companies connect financial APIs and receive continuous compliance scores
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">REDUCED INTERMEDIATION COSTS</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                Smart contracts replace clearing houses, transfer agents, and multiple layers of settlement
                infrastructure
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">REAL-TIME FRAUD PREVENTION</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                AI monitoring provides continuous &quot;smell tests&quot; vs. periodic audits that miss problems for quarters
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">EARLIER RETAIL ACCESS</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                Investors can participate in $10-30M+ revenue companies before late-stage billion-dollar private rounds
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">PROGRAMMABLE COMPLIANCE</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                Smart contracts enforce accreditation, holding periods, and transfer restrictions automatically
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">COMPOSABILITY</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                Tokenized equity can be used as collateral in DeFi lending or bundled into index products
              </p>
            </div>
            <div className="border-2 border-foreground p-4">
              <h4 className="font-mono font-bold text-sm mb-2">GLOBAL ATOMIC SETTLEMENT</h4>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                Cross-border transactions settle instantly without correspondent banking delays
              </p>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">TECHNICAL ARCHITECTURE</h2>

          <div className="space-y-4">
            <details className="group border-2 border-foreground">
              <summary className="cursor-pointer list-none p-4 sm:p-6 font-mono font-bold text-sm sm:text-base hover:bg-muted transition-colors flex items-center justify-between">
                <span>1. ISSUER ONBOARDING LAYER</span>
                <span className="text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="border-t-2 border-foreground p-4 sm:p-6 bg-muted/30">
                <ul className="space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
                  <li>
                    • Companies grant API access to banking, accounting, and revenue systems (Plaid, Stripe, QuickBooks
                    integrations)
                  </li>
                  <li>• Smart contract mints ERC-20 or similar tokens representing fractional equity ownership</li>
                  <li>• Cap table automatically syncs on-chain with each transaction</li>
                  <li>• Minimum criteria: $10M+ revenue OR $5M+ recurring revenue with 80%+ retention</li>
                </ul>
              </div>
            </details>

            <details className="group border-2 border-foreground">
              <summary className="cursor-pointer list-none p-4 sm:p-6 font-mono font-bold text-sm sm:text-base hover:bg-muted transition-colors flex items-center justify-between">
                <span>2. AI COMPLIANCE ENGINE</span>
                <span className="text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="border-t-2 border-foreground p-4 sm:p-6 bg-muted/30">
                <ul className="space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
                  <li>
                    • Continuous ingestion of financial telemetry data (cash flows, AR aging, bank balances, transaction
                    patterns)
                  </li>
                  <li>
                    • Machine learning models trained on fraud indicators, financial distress signals, and industry
                    benchmarks
                  </li>
                  <li>• Real-time compliance score (0-100) displayed to all market participants</li>
                  <li>• Automated alerts when scores drop below thresholds</li>
                  <li>• Natural language explanation of score factors for transparency</li>
                </ul>
              </div>
            </details>

            <details className="group border-2 border-foreground">
              <summary className="cursor-pointer list-none p-4 sm:p-6 font-mono font-bold text-sm sm:text-base hover:bg-muted transition-colors flex items-center justify-between">
                <span>3. TRADING INFRASTRUCTURE</span>
                <span className="text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="border-t-2 border-foreground p-4 sm:p-6 bg-muted/30">
                <ul className="space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
                  <li>
                    • <strong>Automated Market Maker (AMM):</strong> Constant product formula (x*y=k) ensures instant
                    execution
                  </li>
                  <li>
                    • <strong>Hybrid order book option:</strong> For larger cap issuers, combine AMM with limit order
                    book
                  </li>
                  <li>
                    • <strong>Multi-chain deployment:</strong> Launch on Ethereum L2 (Arbitrum/Base) for lower gas fees
                  </li>
                  <li>
                    • <strong>Fiat on/off ramps:</strong> Partner with stablecoin providers for seamless USD↔USDC
                    conversion
                  </li>
                </ul>
              </div>
            </details>

            <details className="group border-2 border-foreground">
              <summary className="cursor-pointer list-none p-4 sm:p-6 font-mono font-bold text-sm sm:text-base hover:bg-muted transition-colors flex items-center justify-between">
                <span>4. INVESTOR PROTECTION MECHANISMS</span>
                <span className="text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="border-t-2 border-foreground p-4 sm:p-6 bg-muted/30">
                <ul className="space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
                  <li>• Accreditation verification for non-tokenized securities (Reg D equivalent)</li>
                  <li>• Investment limits for non-accredited investors (e.g., 10% of annual income per issuer)</li>
                  <li>• Mandatory holding periods for certain issuers (lockups encoded in smart contracts)</li>
                  <li>• Insurance fund capitalized by protocol fees to cover edge cases</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Business Model */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">BUSINESS MODEL</h2>

          <div className="border-2 border-foreground p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">REVENUE STREAMS</h3>
            <div className="space-y-3 font-mono text-sm sm:text-base text-muted-foreground">
              <div>
                <strong className="text-foreground">Issuer listing fee:</strong> $10K-50K one-time based on company size
              </div>
              <div>
                <strong className="text-foreground">Trading fee:</strong> 0.3% split between liquidity providers (0.25%)
                and protocol treasury (0.05%)
              </div>
              <div>
                <strong className="text-foreground">Compliance subscription:</strong> $500-2K/month per issuer for
                enhanced AI monitoring
              </div>
              <div>
                <strong className="text-foreground">Data licensing:</strong> Anonymized market and compliance data sold
                to research firms
              </div>
            </div>
          </div>

          <div className="border-2 border-foreground p-4 sm:p-6 bg-muted/30">
            <h3 className="text-lg sm:text-xl font-bold font-mono mb-4">MARKET OPPORTUNITY</h3>
            <ul className="space-y-2 font-mono text-sm sm:text-base text-muted-foreground">
              <li>• Private markets AUM in the trillions with limited retail access today</li>
              <li>• Retail brokerage and alt-investing platforms rapidly growing</li>
              <li>• Maturing fintech and open banking APIs enable continuous data access</li>
              <li>• Advances in AI allow automated fraud detection and &quot;smell tests&quot;</li>
              <li>• Appetite for broader participation in private markets and secondary liquidity</li>
            </ul>
          </div>
        </section>

        {/* Competition & Differentiation */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">COMPETITION & DIFFERENTIATION</h2>

          <div className="space-y-6">
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="text-lg font-bold font-mono mb-3">DIRECT COMPETITORS</h3>
              <div className="space-y-2 font-mono text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Republic, StartEngine, Wefunder:</strong> Reg CF/A+ crowdfunding
                  platforms—but no secondary liquidity
                </div>
                <div>
                  <strong className="text-foreground">tZERO, INX:</strong> Tokenized securities platforms—but focus on
                  traditional compliance, not AI-driven monitoring
                </div>
                <div>
                  <strong className="text-foreground">Securitize:</strong> Tokenization infrastructure provider—enables
                  others but doesn&apos;t operate marketplace
                </div>
              </div>
            </div>

            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="text-lg font-bold font-mono mb-3">INDIRECT COMPETITORS</h3>
              <div className="space-y-2 font-mono text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Carta, Forge, Hiive:</strong> Private market secondaries—but
                  illiquid, manual matching, high fees
                </div>
                <div>
                  <strong className="text-foreground">Traditional exchanges:</strong> Nasdaq, NYSE private market
                  initiatives—but locked into legacy infrastructure
                </div>
              </div>
            </div>

            <div className="border-2 border-foreground p-4 sm:p-6 bg-accent/10">
              <h3 className="text-lg font-bold font-mono mb-3">OUR COMPETITIVE ADVANTAGES (MOAT)</h3>
              <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                <li>• Only platform combining tokenization + AMM liquidity + AI compliance in integrated stack</li>
                <li>• Focus on $10-30M+ revenue companies (sweet spot between crowdfunding and late-stage PE)</li>
                <li>
                  • Continuous monitoring creates proprietary compliance dataset that becomes more valuable with scale
                </li>
                <li>• Network effects from two-sided marketplace liquidity</li>
                <li>• 24/7 access + AI-native continuous compliance vs. periodic reporting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">SUCCESS METRICS & TRACTION</h2>

          <div className="border-2 border-foreground mb-6">
            <div className="bg-foreground text-background p-4 sm:p-6 border-b-2 border-foreground">
              <h3 className="text-lg font-bold font-mono">KEY PERFORMANCE INDICATORS</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border-2 border-foreground p-3">
                  <div className="font-mono text-xs text-muted-foreground mb-1">ISSUER ADOPTION</div>
                  <div className="font-mono font-bold text-lg">100+ companies</div>
                  <div className="font-mono text-xs text-muted-foreground">within 24 months</div>
                </div>
                <div className="border-2 border-foreground p-3">
                  <div className="font-mono text-xs text-muted-foreground mb-1">TRADING VOLUME</div>
                  <div className="font-mono font-bold text-lg">$100M+ monthly</div>
                  <div className="font-mono text-xs text-muted-foreground">by Month 18</div>
                </div>
                <div className="border-2 border-foreground p-3">
                  <div className="font-mono text-xs text-muted-foreground mb-1">COMPLIANCE ACCURACY</div>
                  <div className="font-mono font-bold text-lg">95%+ detection</div>
                  <div className="font-mono text-xs text-muted-foreground">vs. periodic audit baseline</div>
                </div>
                <div className="border-2 border-foreground p-3">
                  <div className="font-mono text-xs text-muted-foreground mb-1">RETAIL PARTICIPATION</div>
                  <div className="font-mono font-bold text-lg">50K+ investors</div>
                  <div className="font-mono text-xs text-muted-foreground">avg 8+ issuers each</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-foreground p-4 sm:p-6 bg-muted/30">
            <h3 className="text-lg font-bold font-mono mb-3">CURRENT TRACTION</h3>
            <ul className="space-y-2 font-mono text-sm text-muted-foreground">
              <li>• Early conversations and debate highlight strong interest across stakeholders</li>
              <li>• Planned pilots with companies in $10–30M+ revenue range</li>
            </ul>
          </div>
        </section>

        {/* Regulatory Strategy */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">REGULATORY STRATEGY</h2>

          <div className="space-y-4">
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="font-mono font-bold mb-2">UNITED STATES</h3>
              <p className="font-mono text-sm text-muted-foreground">
                Operate as Alternative Trading System (ATS) registered with SEC. Partner with broker-dealer for custody.
                Limit to Reg D (506(c)) offerings initially, pursue Reg A+ pathway for non-accredited access.
              </p>
            </div>
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="font-mono font-bold mb-2">EUROPEAN UNION</h3>
              <p className="font-mono text-sm text-muted-foreground">
                Leverage MiFID II framework for multilateral trading facility (MTF). Comply with MiCA regulation for
                tokenized securities. Establish in crypto-friendly jurisdiction with EU passporting.
              </p>
            </div>
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="font-mono font-bold mb-2">LATIN AMERICA</h3>
              <p className="font-mono text-sm text-muted-foreground">
                Mexico: CNBV sandbox. Brazil: CVM framework for crowdfunding platforms. Argentina/Chile: Leverage
                existing private market exemptions with blockchain rails.
              </p>
            </div>
            <div className="border-2 border-foreground p-4 sm:p-6">
              <h3 className="font-mono font-bold mb-2">ASIA-PACIFIC</h3>
              <p className="font-mono text-sm text-muted-foreground">
                Singapore: MAS VCC structure for tokenized funds. Hong Kong: SFC licensing for virtual asset trading
                platform focused on security tokens.
              </p>
            </div>
          </div>
        </section>

        {/* Exit Strategy */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">EXIT STRATEGY</h2>

          <div className="border-2 border-foreground p-4 sm:p-6">
            <ul className="space-y-3 font-mono text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">Acquisition by major exchange:</strong> Nasdaq, CME, or
                Intercontinental Exchange acquiring technology and regulatory licenses
              </li>
              <li>
                • <strong className="text-foreground">Crypto-native buyer:</strong> Coinbase, Kraken, or Binance adding
                securities to pure crypto offerings
              </li>
              <li>
                • <strong className="text-foreground">Financial infrastructure provider:</strong> Fidelity, BlackRock,
                or State Street integrating tokenized private markets
              </li>
              <li>
                • <strong className="text-foreground">IPO/direct listing:</strong> Once reach scale ($500M+ annual
                volume), public markets for continued growth capital
              </li>
            </ul>
          </div>
        </section>

        {/* Conclusion */}
        <section className="border-2 border-foreground p-4 sm:p-6 bg-accent/10">
          <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4">KEY INSIGHT</h2>
          <p className="font-mono text-sm sm:text-base text-muted-foreground leading-relaxed">
            This isn&apos;t just about technology—it&apos;s about creating access to private market returns that currently only
            institutions capture, using modern tools (blockchain + AI) to solve the fraud prevention problem that has
            historically justified keeping retail investors out.
          </p>
        </section>
      </main>
    </div>
  )
}
