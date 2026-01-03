"use client"

import { Download, TrendingUp, TrendingDown } from "lucide-react"
import { PortfolioChart } from "@/app/components/portfolio-chart"

const positions = [
    {
        strategy: "LENDING MARKETS",
        balance: "0.00",
        value: "$0.00",
        pnl: "+$0.00",
        pnlPercent: "+0.00%",
        isPositive: true,
    },
    {
        strategy: "POLYMARKET SYNTHETIC OPTIONS",
        balance: "0.00",
        value: "$0.00",
        pnl: "+$0.00",
        pnlPercent: "+0.00%",
        isPositive: true,
    },
]

const recentTransactions = [
    {
        date: "2025-01-15",
        type: "DEPOSIT",
        strategy: "LENDING MARKETS",
        amount: "$0.00",
    },
    {
        date: "2025-01-10",
        type: "WITHDRAW",
        strategy: "POLYMARKET SYNTHETIC OPTIONS",
        amount: "$0.00",
    },
]

export default function DashboardPage() {
    return (
        <>
            <div className="mb-12">
                <h1 className="text-5xl font-bold font-mono mb-4">DASHBOARD</h1>
                <p className="text-lg text-muted-foreground">Monitor your portfolio performance and transaction history</p>
            </div>

            {/* Portfolio Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="border-2 border-foreground p-6">
                    <h3 className="font-mono text-sm mb-2 text-muted-foreground">TOTAL PORTFOLIO VALUE</h3>
                    <div className="text-4xl font-bold font-mono">$0.00</div>
                </div>

                <div className="border-2 border-foreground p-6">
                    <h3 className="font-mono text-sm mb-2 text-muted-foreground">TOTAL P&L (ALL TIME)</h3>
                    <div className="text-4xl font-bold font-mono flex items-center gap-2">
                        +$0.00
                        <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                </div>

                <div className="border-2 border-foreground p-6">
                    <h3 className="font-mono text-sm mb-2 text-muted-foreground">30D RETURN</h3>
                    <div className="text-4xl font-bold font-mono text-accent">+0.00%</div>
                </div>
            </div>

            {/* Portfolio Chart */}
            <div className="border-2 border-foreground mb-12">
                {/* Header Section */}
                <div className="bg-foreground text-background p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold font-mono">PORTFOLIO PERFORMANCE</h2>
                </div>

                {/* Time Period Buttons */}
                <div className="border-b-2 border-foreground p-3 sm:p-4 bg-muted/30">
                    <div className="grid grid-cols-4 gap-2">
                        <button className="border-2 border-foreground px-3 py-2 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm hover:bg-background transition-colors">
                            7D
                        </button>
                        <button className="border-2 border-foreground px-3 py-2 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm bg-background hover:bg-foreground hover:text-background transition-colors">
                            30D
                        </button>
                        <button className="border-2 border-foreground px-3 py-2 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm hover:bg-background transition-colors">
                            90D
                        </button>
                        <button className="border-2 border-foreground px-3 py-2 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm hover:bg-background transition-colors">
                            ALL
                        </button>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="bg-background p-3 sm:p-4 lg:p-6 pb-16 sm:pb-20 lg:pb-24">
                    <div className="h-[280px] sm:h-[360px] lg:h-[420px] w-full">
                        <PortfolioChart />
                    </div>
                </div>

                {/* Chart Info - Collapsible */}
                <div className="border-t-2 border-foreground bg-muted/30 p-3 sm:p-4">
                    <details className="group">
                        <summary className="font-mono text-xs sm:text-sm font-bold cursor-pointer list-none flex items-center justify-between hover:text-accent transition-colors">
                            <span>CHART INFORMATION</span>
                            <span className="text-lg group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="text-xs sm:text-sm font-mono text-muted-foreground mt-3 pt-3 border-t border-foreground/20">
                            This chart aggregates performance across all your active positions. Use the time period buttons to
                            adjust the view and analyze your portfolio's historical performance.
                        </p>
                    </details>
                </div>
            </div>

            {/* Active Positions */}
            <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4 sm:mb-6">ACTIVE POSITIONS</h2>
                <div className="border-2 border-foreground">
                    {/* Desktop Table Header - Hidden on mobile */}
                    <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b-2 border-foreground bg-muted font-mono text-sm">
                        <div>STRATEGY</div>
                        <div>BALANCE</div>
                        <div>VALUE</div>
                        <div>P&L</div>
                        <div>P&L %</div>
                    </div>

                    {/* Position Items */}
                    {positions.map((position, index) => (
                        <div key={index}>
                            {/* Mobile Card Layout */}
                            <div className="md:hidden p-4 border-b-2 border-foreground last:border-b-0 hover:bg-muted transition-colors space-y-3">
                                {/* Strategy Name - Prominent */}
                                <div className="pb-3 border-b border-foreground/20">
                                    <span className="font-mono text-xs text-muted-foreground block mb-1">STRATEGY</span>
                                    <span className="font-mono text-base font-bold">{position.strategy}</span>
                                </div>

                                {/* Balance and Value in 2 columns */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="font-mono text-xs text-muted-foreground block mb-1">BALANCE</span>
                                        <span className="font-mono text-sm">{position.balance}</span>
                                    </div>
                                    <div>
                                        <span className="font-mono text-xs text-muted-foreground block mb-1">VALUE</span>
                                        <span className="font-mono text-sm">{position.value}</span>
                                    </div>
                                </div>

                                {/* P&L Section - Highlighted */}
                                <div className="pt-3 border-t border-foreground/20 bg-muted/50 -mx-4 px-4 py-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <span className="font-mono text-xs text-muted-foreground block mb-1">P&L</span>
                                            <span className="font-mono text-base font-bold">{position.pnl}</span>
                                        </div>
                                        <div>
                                            <span className="font-mono text-xs text-muted-foreground block mb-1">P&L %</span>
                                            <div
                                                className={`font-mono text-base font-bold flex items-center gap-2 ${position.isPositive ? "text-accent" : "text-destructive"
                                                    }`}
                                            >
                                                {position.pnlPercent}
                                                {position.isPositive ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Grid Layout */}
                            <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b-2 border-foreground last:border-b-0 hover:bg-muted transition-colors">
                                <div className="font-mono font-bold">{position.strategy}</div>
                                <div className="font-mono">{position.balance}</div>
                                <div className="font-mono">{position.value}</div>
                                <div className="font-mono">{position.pnl}</div>
                                <div
                                    className={`font-mono flex items-center gap-2 ${position.isPositive ? "text-accent" : "text-destructive"
                                        }`}
                                >
                                    {position.pnlPercent}
                                    {position.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold font-mono">TRANSACTION HISTORY</h2>
                    <button className="flex items-center justify-center gap-2 border-2 border-foreground px-4 sm:px-6 py-3 font-mono text-sm hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">DOWNLOAD CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </button>
                </div>

                <div className="border-2 border-foreground mb-6">
                    {/* Desktop Table Header - Hidden on mobile */}
                    <div className="hidden md:grid grid-cols-4 gap-4 p-4 border-b-2 border-foreground bg-muted font-mono text-sm">
                        <div>DATE</div>
                        <div>TYPE</div>
                        <div>STRATEGY</div>
                        <div>AMOUNT</div>
                    </div>

                    {/* Transaction Items */}
                    {recentTransactions.map((tx, index) => (
                        <div key={index}>
                            {/* Mobile Card Layout */}
                            <div className="md:hidden p-4 border-b-2 border-foreground last:border-b-0 hover:bg-muted transition-colors space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-muted-foreground">DATE</span>
                                    <span className="font-mono text-sm">{tx.date}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-muted-foreground">TYPE</span>
                                    <span className="font-mono text-sm font-bold bg-foreground text-background px-3 py-1">
                                        {tx.type}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-muted-foreground">STRATEGY</span>
                                    <span className="font-mono text-sm text-right max-w-[60%] break-words">{tx.strategy}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-foreground/20">
                                    <span className="font-mono text-xs text-muted-foreground">AMOUNT</span>
                                    <span className="font-mono text-lg font-bold">{tx.amount}</span>
                                </div>
                            </div>

                            {/* Desktop Grid Layout */}
                            <div className="hidden md:grid grid-cols-4 gap-4 p-4 border-b-2 border-foreground last:border-b-0 hover:bg-muted transition-colors">
                                <div className="font-mono">{tx.date}</div>
                                <div className="font-mono font-bold">{tx.type}</div>
                                <div className="font-mono">{tx.strategy}</div>
                                <div className="font-mono">{tx.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-sm font-mono text-muted-foreground border-2 border-foreground p-4 bg-muted">
                    <strong>DOWNLOAD CSV FUNCTIONALITY:</strong> This button will generate and download a CSV file containing
                    your complete transaction history including timestamps, transaction hashes, gas fees, and net amounts.
                    Useful for tax reporting and record keeping.
                </p>
            </div>
        </>
    )
}
