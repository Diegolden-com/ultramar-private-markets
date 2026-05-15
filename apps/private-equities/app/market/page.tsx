"use client"

import { RouteHeader } from "@/components/route-header"
import { SwapWidget } from "@/components/trading/swap-widget"
import { AmmCurve } from "@/components/market/amm-curve"
import { TrendingUp, Zap, Lock } from "lucide-react"

export default function MarketPage() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="THE MARKET"
                subtitle="Permissioned liquidity concepts for private assets, gated before any production transfer."
            />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
                {/* Left: The Theory (Visual Curve) */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold font-mono">
                            CONTROLLED <span className="text-accent">LIQUIDITY.</span>
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg leading-relaxed">
                            Private equity is historically illiquid and transfer-restricted.
                            <br /><br />
                            Ultramar models how a permissioned market could work only after issuer restrictions, investor eligibility, custody, and transfer controls are approved.
                        </p>
                    </div>

                    {/* Interactive Curve Visual */}
                    <div className="bg-zinc-900 border-2 border-foreground/20 aspect-video relative overflow-hidden group">
                        <AmmCurve />
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
                                * Read-only demo. No public swap or subscription action is available.
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
                        Pricing models remain illustrative until a counsel-approved transfer workflow exists.
                    </p>
                </div>
                <div className="space-y-3">
                    <TrendingUp className="w-8 h-8 text-accent" />
                    <h3 className="font-bold font-mono text-lg">PROTOCOL FEE</h3>
                    <p className="text-sm text-muted-foreground">
                        Fee logic belongs in final documents and production contracts, not public marketing copy.
                    </p>
                </div>
                <div className="space-y-3">
                    <Lock className="w-8 h-8 text-accent" />
                    <h3 className="font-bold font-mono text-lg">PERMISSIONED POOLS</h3>
                    <p className="text-sm text-muted-foreground">
                        Only whitelisted (KYC&apos;d) wallets can interact with the smart contracts, ensuring full regulatory compliance.
                    </p>
                </div>
            </div>
        </main>
    )
}
