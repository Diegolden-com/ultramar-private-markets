import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { FileText, ArrowRight, ClipboardCheck } from "lucide-react"

export default function InfoPage() {
  const strategies = [
    {
      id: "lending-markets",
      name: "Lending Markets",
      description: "Detailed backtesting results and performance analysis for our Lending Markets strategy",
      href: "/info/lending-markets",
    },
    {
      id: "derivative-arbitrage",
      name: "Simple Derivative Arbitrage",
      description: "General derivative arbitrage strategy using synthetic options and replicating portfolios",
      href: "/info/derivative-arbitrage",
    },
    {
      id: "polymarket-arbitrage",
      name: "Polymarket Arbitrage",
      description: "Specialized arbitrage strategy focused on Polymarket prediction markets",
      href: "/info/polymarket-arbitrage",
    },
    {
      id: "private-markets",
      name: "Private Markets",
      description: "Tokenized private equity exchange with AI-driven compliance monitoring for democratized access",
      href: "/info/private-markets",
    },
  ]

  const faqs = [
    {
      question: "What is PAN.TECH CAPITAL?",
      answer:
        "PAN.TECH CAPITAL is a DeFi investment platform that provides access to sophisticated investment strategies in decentralized finance. We offer curated strategies including Lending Markets, Polymarket Synthetic Options, and Private Equities, all designed to optimize returns while managing risk.",
    },
    {
      question: "How do backtesting results work?",
      answer:
        "Backtesting involves running our investment strategies against historical market data to evaluate their performance. Our backtesting results show how each strategy would have performed in past market conditions, including metrics like APY, drawdowns, Sharpe ratio, and win rates. These results help investors understand potential risks and returns.",
    },
    {
      question: "What are the risks involved?",
      answer:
        "All DeFi investments carry risks including smart contract vulnerabilities, market volatility, liquidity risks, and protocol-specific risks. Each strategy has a different risk profile: Lending Markets (LOW), Polymarket Synthetic Options (MEDIUM), and Private Equities (HIGH). We recommend diversifying across strategies and only investing what you can afford to lose.",
    },
    {
      question: "How are returns calculated?",
      answer:
        "Returns are calculated based on the Annual Percentage Yield (APY) of each strategy. APY includes compound interest and reflects the total return over a year. Actual returns may vary based on market conditions, gas fees, and the timing of your investment. Past performance does not guarantee future results.",
    },
    {
      question: "What is the minimum investment?",
      answer:
        "The minimum investment varies by strategy and is displayed on each strategy's detail page. Generally, we recommend starting with at least $1,000 to make gas fees economically viable, though some strategies may have lower minimums.",
    },
    {
      question: "How do I withdraw my funds?",
      answer:
        "You can withdraw your funds at any time by clicking the 'SELL' button on your strategy's page. Withdrawals are processed on-chain and typically complete within a few minutes, though this depends on network congestion. Note that some strategies may have lock-up periods or withdrawal fees.",
    },
    {
      question: "Is my wallet required to use the platform?",
      answer:
        "Currently, this is a prototype version and wallet connection is not required. In the production version, you will need to connect a Web3 wallet (like MetaMask, WalletConnect, or Coinbase Wallet) to invest in strategies and manage your portfolio.",
    },
    {
      question: "How often are strategies rebalanced?",
      answer:
        "Rebalancing frequency varies by strategy. Lending Markets rebalances daily to optimize yield across protocols. Polymarket Synthetic Options rebalances based on market conditions and option expiries. Private Equities rebalances quarterly to maintain target allocations.",
    },
  ]

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-4">AVAILABLE INSTRUMENTS</h1>
          <p className="text-base sm:text-lg text-muted-foreground font-mono">
            Read detailed performance analysis and backtesting results for each of our DeFi strategies
          </p>
        </div>

        <Link
          href="/info/risk-assessment"
          className="block border-2 border-foreground p-6 sm:p-8 mb-12 bg-foreground text-background hover:bg-background hover:text-foreground transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ClipboardCheck className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono mb-2">TAKE RISK ASSESSMENT TEST</h2>
                <p className="text-sm sm:text-base font-mono opacity-90">
                  Discover which instruments align with your financial goals and risk tolerance
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        {/* Strategy Results Cards */}
        <div className="space-y-6">
          {strategies.map((strategy) => (
            <Link
              key={strategy.id}
              href={strategy.href}
              className="block border-2 border-foreground p-4 sm:p-6 hover:bg-muted transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold font-mono truncate">{strategy.name}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-mono">{strategy.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono mb-8">FREQUENTLY ASKED QUESTIONS</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-2 border-foreground bg-background">
                <summary className="cursor-pointer list-none p-4 sm:p-6 font-mono font-bold text-sm sm:text-base hover:bg-muted transition-colors flex items-center justify-between">
                  <span className="pr-4">{faq.question}</span>
                  <span className="text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="border-t-2 border-foreground p-4 sm:p-6 bg-muted/30">
                  <p className="font-mono text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-12 border-2 border-foreground p-4 sm:p-6 bg-muted/30">
          <p className="text-xs sm:text-sm font-mono text-muted-foreground">
            <strong className="text-foreground">NOTE:</strong> These pages support markdown content. You can insert
            detailed backtesting results, charts, tables, and analysis for each strategy. The content is currently
            placeholder text that can be replaced with actual backtesting data.
          </p>
        </div>

        <footer className="mt-16 pt-8 border-t-2 border-foreground/20">
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              By using pantech.capital, you agree to our{" "}
              <Link href="/info/terms" className="underline hover:text-foreground transition-colors font-medium">
                Terms and Conditions
              </Link>
              . All investment strategies involve risk. Past performance does not guarantee future results.
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              © 2025 Pantech Capital c/o Odisea Labs LLC. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
