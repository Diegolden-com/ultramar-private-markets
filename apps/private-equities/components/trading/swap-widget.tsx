"use client"

import { LockKeyhole, ShieldCheck } from "lucide-react"

interface SwapWidgetProps {
    ticker: string
    currentPrice: number
    minTicket: number
}

export function SwapWidget({ ticker, currentPrice, minTicket }: SwapWidgetProps) {
    return (
        <div className="sticky top-8 bg-foreground text-background p-6 sm:p-8 shadow-xl border-2 border-foreground">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-background/55">
                        Access gate
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">
                        Counsel-gated workflow
                    </h2>
                </div>
                <LockKeyhole className="h-6 w-6 shrink-0 text-accent" />
            </div>

            <p className="text-sm leading-6 text-background/70">
                Public pages do not accept funds, execute swaps, publish wire
                instructions, or treat interest as a binding commitment. Investor
                access opens only after legal review, eligibility checks, final
                documents, and transfer controls are approved.
            </p>

            <div className="my-6 grid gap-px bg-background/20">
                <GateFact label="Asset" value={ticker.toUpperCase()} />
                <GateFact label="Reference price" value={`${currentPrice.toFixed(2)} USDC`} />
                <GateFact label="Minimum ticket" value={`$${minTicket.toLocaleString("en-US")}`} />
                <GateFact label="Status" value="Data room buildout" />
            </div>

            <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 border-2 border-background/30 py-4 font-mono text-sm font-bold uppercase tracking-widest text-background/55"
            >
                <ShieldCheck className="h-5 w-5" />
                Subscription disabled
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-background/45">
                Informational context only. No public transaction action is available.
            </p>
        </div>
    )
}

function GateFact({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 bg-foreground py-3 text-xs">
            <span className="font-mono uppercase tracking-[0.18em] text-background/45">{label}</span>
            <span className="text-right font-mono font-bold">{value}</span>
        </div>
    )
}
