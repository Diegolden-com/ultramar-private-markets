"use client"

import { useState } from "react"
import { RouteHeader } from "@/components/route-header"
import { ShieldCheck, Database, Globe, Scale, Lock, RefreshCw, Server, Activity, Binary } from "lucide-react"

interface ComplianceData {
    score: number
    status: string
    sources: { name: string; latency: string }[]
}

export default function OraclePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [complianceData, setComplianceData] = useState<ComplianceData | null>(null)

    const fetchComplianceData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/oracle/score')
            const data = await res.json()
            setComplianceData(data)
        } catch (error) {
            console.error("Failed to fetch oracle data", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="THE ORACLE"
                subtitle="The bridge between physical reality and digital truth."
            />

            {/* Hero Section with Data Stream Visual */}
            <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold font-mono leading-tight">
                        TRUSTCODE <br />
                        <span className="text-accent bg-accent/10 px-2">ACTIVATED.</span>
                    </h2>
                    <p className="text-muted-foreground font-mono text-lg">
                        The Oracle is a decentralized ingestion engine. It replaces "trust me, bro" with cryptographic proof.
                        We stream accounting data directly onto the blockchain, giving every token holder a real-time window into the business's heartbeat.
                    </p>
                </div>

                {/* Visual Data Stream Container */}
                <div className="border-2 border-foreground p-8 bg-black relative overflow-hidden group min-h-[350px] flex flex-col items-center justify-center">
                    {/* Matrix/Stream Effect Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 -left-4 w-full h-full animate-marquee-vertical flex flex-col text-[10px] font-mono text-accent leading-tight whitespace-nowrap">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <span key={i} className="opacity-50">{`0x${Math.random().toString(16).slice(2)}... [VERIFIED]`}</span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-grid-white/[0.05]" />

                    {/* Dynamic Status Component */}
                    <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <Binary className="w-16 h-16 text-accent animate-pulse" />
                                <div className="font-mono text-lg text-accent">SYNCING NODE...</div>
                            </div>
                        ) : complianceData ? (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-300 w-full">
                                <div className="relative inline-block">
                                    <div className="text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                        {complianceData.score}
                                    </div>
                                    <div className="text-xs font-mono absolute -top-4 -right-8 bg-accent text-background px-2 py-0.5 font-bold">
                                        HEALTH
                                    </div>
                                </div>

                                <div className={`font-mono text-xl font-bold px-4 py-1 inline-block border ${complianceData.status === 'OPTIMAL' ? 'border-green-500 text-green-400 bg-green-950/30' :
                                        complianceData.status === 'HEALTHY' ? 'border-blue-500 text-blue-400 bg-blue-950/30' :
                                            'border-red-500 text-red-400 bg-red-950/30'
                                    }`}>
                                    STATUS: {complianceData.status}
                                </div>

                                <div className="text-xs font-mono text-muted-foreground border-t border-white/10 pt-4 mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-left w-full max-w-xs mx-auto">
                                    {complianceData.sources.map((src) => (
                                        <div key={src.name} className="flex items-center justify-between gap-4">
                                            <span className="text-zinc-500">{src.name}</span>
                                            <span className="text-accent flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                                {src.latency}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Initial State
                            <div className="space-y-4">
                                <Server className="w-16 h-16 text-zinc-700 mx-auto" />
                                <div className="font-mono text-2xl font-bold text-zinc-700">AWAITING SIGNAL</div>
                                <button
                                    onClick={fetchComplianceData}
                                    className="bg-accent text-accent-foreground px-8 py-4 font-mono font-bold hover:scale-105 transition-all flex items-center gap-2 mx-auto border-2 border-transparent hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    PING ORACLE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* How it Works / The Oracle */}
            <div className="mb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="group border border-foreground/20 p-8 space-y-4 bg-background relative hover:bg-muted/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-foreground text-background font-mono text-xs px-2 py-1">STEP 01</div>
                        <Database className="w-10 h-10 text-muted-foreground group-hover:text-accent transition-colors" />
                        <h4 className="font-bold font-mono text-lg">INGEST</h4>
                        <p className="text-sm font-mono text-muted-foreground">
                            Encrypted adapters pull financial/banking data (plaid, stripe).
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="group border border-foreground/20 p-8 space-y-4 bg-background relative hover:bg-muted/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-foreground text-background font-mono text-xs px-2 py-1">STEP 02</div>
                        <Binary className="w-10 h-10 text-muted-foreground group-hover:text-accent transition-colors" />
                        <h4 className="font-bold font-mono text-lg">PROCESS</h4>
                        <p className="text-sm font-mono text-muted-foreground">
                            ZK-Proofs verify balances without revealing transactions.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="group border border-foreground/20 p-8 space-y-4 bg-background relative hover:bg-muted/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-foreground text-background font-mono text-xs px-2 py-1">STEP 03</div>
                        <Globe className="w-10 h-10 text-muted-foreground group-hover:text-accent transition-colors" />
                        <h4 className="font-bold font-mono text-lg">BROADCAST</h4>
                        <p className="text-sm font-mono text-muted-foreground">
                            Health score is published on-chain, triggering automated logic.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
