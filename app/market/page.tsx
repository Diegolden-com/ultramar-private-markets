"use client"

import { RouteHeader } from "@/components/route-header"
import { SwapWidget } from "@/components/trading/swap-widget"
import { ArrowLeftRight, TrendingUp, Zap, Lock } from "lucide-react"

export default function MarketPage() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="THE MARKET"
                subtitle="High-velocity, permissioned liquidity for private assets."
            />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
                {/* Left: The Theory (Visual Curve) */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold font-mono">
                            INSTANT <span className="text-accent">LIQUIDITY.</span>
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg leading-relaxed">
                            Private equity is historically illiquid. You buy, you wait 10 years, you pray.
                            <br /><br />
                            Ultramar changes this. By pairing every Asset Token with USDC in a permissioned Liquidity Pool, we enable 24/7 trading.
                        </p>
                    </div>

                    {/* Interactive Curve Visual */}
                    <div className="bg-zinc-900 border-2 border-foreground/20 p-8 aspect-video relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-white/[0.05]" />

                        {/* The Curve Line */}
                        <svg className="absolute inset-0 w-full h-full text-accent" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                                d="M 0 100 Q 20 20 100 0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="opacity-50"
                            />
                            {/* Animated Point */}
                            <circle cx="20" cy="20" r="1.5" fill="currentColor" className="animate-ping" style={{ animationDuration: '3s' }} />
                        </svg>

                        <div className="absolute bottom-4 left-4 font-mono text-xs text-muted-foreground">
                            x * y = k
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                            <ArrowLeftRight className="w-12 h-12 text-foreground mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="font-mono text-sm font-bold bg-background/80 backdrop-blur px-3 py-1 border border-white/10">
                                AUTOMATED MARKET MAKER
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: The Practice (Interactive Widget) */}
                <div className="relative">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 blur-2xl rounded-full" />

                    <div className="relative z-10 pointer-events-none opacity-90 contrast-125">
                        {/* Reusing SwapWidget in read-only/demo fashion effectively */}
                        <div className="pointer-events-auto">
                            <SwapWidget
                                ticker="DEMO.TOKEN"
                                currentPrice={1.00}
                                minTicket={0}
                            />
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-xs font-mono text-muted-foreground">
                                * Interactive Demo. Try swapping to see price impact.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Stacks */}
            <div className="grid md:grid-cols-3 gap-6 border-t border-foreground/10 pt-16">
                <div className="space-y-3">
                    <Zap className="w-8 h-8 text-accent" />
                    <h3 className="font-bold font-mono text-lg">ALGORITHMIC PRICING</h3>
                    <p className="text-sm text-muted-foreground">
                        No order books. No matching. Price is determined deterministically by the ratio of assets in the pool.
                    </p>
                </div>
                <div className="space-y-3">
                    <TrendingUp className="w-8 h-8 text-accent" />
                    <h3 className="font-bold font-mono text-lg">PROTOCOL FEE</h3>
                    <p className="text-sm text-muted-foreground">
                        A flat 0.3% fee on trades goes to Liquidity Providers (LPs), incentivizing deep market depth.
                    </p>
                </div>
                <div className="space-y-3">
                    <Lock className="w-8 h-8 text-accent" />
                    <h3 className="font-bold font-mono text-lg">PERMISSIONED POOLS</h3>
                    <p className="text-sm text-muted-foreground">
                        Only whitelisted (KYC'd) wallets can interact with the smart contracts, ensuring full regulatory compliance.
                    </p>
                </div>
            </div>
        </main>
    )
}
