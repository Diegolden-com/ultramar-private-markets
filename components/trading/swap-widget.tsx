"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp, Info, RefreshCcw } from "lucide-react"

interface SwapWidgetProps {
    ticker: string
    currentPrice: number
    minTicket: number
}

export function SwapWidget({ ticker, currentPrice, minTicket }: SwapWidgetProps) {
    const [mode, setMode] = useState<"BUY" | "SELL">("BUY")
    const [amountIn, setAmountIn] = useState<string>("")
    const [amountOut, setAmountOut] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    // Derived state
    const inputToken = mode === "BUY" ? "USDC" : ticker
    const outputToken = mode === "BUY" ? ticker : "USDC"

    // Simulate CPMM Pricing: Price Impact = 0.05% per $1000 traded
    // Base Price is passed in prop
    useEffect(() => {
        if (!amountIn || isNaN(Number(amountIn))) {
            setAmountOut("")
            return
        }

        const val = Number(amountIn)
        const priceImpact = (val / 10000) * 0.01 // Mock impact
        const effectivePrice = mode === "BUY"
            ? currentPrice * (1 + priceImpact)
            : currentPrice * (1 - priceImpact)

        const computedOut = val / effectivePrice

        // Simulating calc delay
        const timer = setTimeout(() => {
            setAmountOut(mode === "BUY" ? computedOut.toFixed(2) : (val * effectivePrice).toFixed(2))
        }, 300)

        return () => clearTimeout(timer)
    }, [amountIn, mode, currentPrice])

    const handleSwap = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setAmountIn("")
            setAmountOut("")
            alert(`Succesfully swapped ${amountIn} ${inputToken} for ${amountOut} ${outputToken}`)
        }, 1500)
    }

    return (
        <div className="sticky top-8 bg-foreground text-background p-6 sm:p-8 shadow-xl border-2 border-foreground">
            {/* Header / Tabs */}
            <div className="flex border-2 border-background mb-6">
                <button
                    onClick={() => setMode("BUY")}
                    className={`flex-1 py-3 font-bold font-mono transition-colors ${mode === "BUY" ? "bg-background text-foreground" : "bg-transparent text-background hover:bg-background/10"
                        }`}
                >
                    BUY
                </button>
                <button
                    onClick={() => setMode("SELL")}
                    className={`flex-1 py-3 font-bold font-mono transition-colors ${mode === "SELL" ? "bg-background text-foreground" : "bg-transparent text-background hover:bg-background/10"
                        }`}
                >
                    SELL
                </button>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
                {/* From */}
                <div className="bg-background/10 p-4 border border-background/20">
                    <div className="flex justify-between text-xs font-mono mb-2 opacity-70">
                        <span>PAY WITH</span>
                        <span>BALANCE: 10,000.00</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                            placeholder="0.00"
                            className="bg-transparent text-3xl font-bold font-mono w-full focus:outline-none placeholder:text-background/20"
                        />
                        <span className="font-bold">{inputToken}</span>
                    </div>
                </div>

                <div className="flex justify-center -my-7 relative z-10">
                    <div className="bg-background text-foreground p-2 border-2 border-foreground rounded-full">
                        <ArrowDownUp className="w-4 h-4" />
                    </div>
                </div>

                {/* To */}
                <div className="bg-background/10 p-4 border border-background/20">
                    <div className="flex justify-between text-xs font-mono mb-2 opacity-70">
                        <span>RECEIVE (EST.)</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            readOnly
                            value={amountOut}
                            placeholder="0.00"
                            className="bg-transparent text-3xl font-bold font-mono w-full focus:outline-none placeholder:text-background/20"
                        />
                        <span className="font-bold">{outputToken}</span>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-2 mb-6 font-mono text-xs opacity-70">
                <div className="flex justify-between">
                    <span>Rate</span>
                    <span>1 {ticker} ≈ {currentPrice.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between text-accent">
                    <span>Protocol Fee</span>
                    <span>0.3%</span>
                </div>
                <div className="flex justify-between">
                    <span>Min Ticket</span>
                    <span>${minTicket}</span>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleSwap}
                disabled={!amountIn || isLoading}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-background py-4 font-bold text-lg mb-3 transition-all uppercase border-2 border-transparent flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <RefreshCcw className="w-5 h-5 animate-spin" />
                        SWAPPING...
                    </>
                ) : (
                    mode === "BUY" ? "INVEST NOW" : "SELL POSITION"
                )}
            </button>

            <p className="text-center text-xs opacity-50 px-4">
                Powered by Ultramar AMM.
                <br />Slippage tolerance: 0.5% (Auto)
            </p>
        </div>
    )
}
