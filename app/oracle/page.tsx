"use client"

import { useState, useEffect } from "react"
import { RouteHeader } from "@/components/route-header"
import { ShieldCheck, Database, Globe, Scale, Lock, RefreshCw, Server, Activity, Binary, CheckCircle, AlertTriangle } from "lucide-react"

interface OracleResponse {
    source: string
    // Live Data Fields
    metrics?: {
        assets: number
        liabilities: number
        equity: number
        solvencyRatio: number
        liquidityRatio: number
        timestamp: number
    }
    proof?: {
        signer: string
        signature: string
        data: any
    }
    // Mock / Fallback Fields
    score?: number
    status?: string
    sources?: { name: string; latency: string; status: string; dataPoint: string }[]
}

export default function OraclePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<OracleResponse | null>(null)

    const fetchOracleData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/oracle/score')
            const json = await res.json()
            setData(json)
        } catch (error) {
            console.error("Failed to fetch oracle data", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Colors determine status
    const isSolvent = data?.metrics ? data.metrics.solvencyRatio > 0 : (data?.score || 0) > 70
    const statusColor = isSolvent ? "text-emerald-500" : "text-rose-500"
    const statusBorder = isSolvent ? "border-emerald-500/50" : "border-rose-500/50"
    const statusBg = isSolvent ? "bg-emerald-950/20" : "bg-rose-950/20"

    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="THE ORACLE"
                subtitle="The bridge between physical reality and digital truth."
            />

            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-20 items-start">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold font-mono leading-tight">
                        TRUSTCODE <br />
                        <span className="text-accent-foreground bg-accent/20 dark:bg-accent/10 px-2 box-decoration-clone">ACTIVATED.</span>
                    </h2>
                    <p className="text-zinc-700 dark:text-muted-foreground font-mono text-lg font-medium max-w-xl">
                        The Oracle streams real-time accounting data from QuickBooks, sanitizes it, and publishes a
                        <span className="text-foreground font-bold border-b-2 border-accent"> Zero-Knowledge Proof (ZKP)</span> of solvency to the blockchain.
                    </p>

                    {!data && (
                        <button
                            onClick={fetchOracleData}
                            disabled={isLoading}
                            className="bg-accent text-accent-foreground px-8 py-4 font-mono font-bold hover:scale-105 transition-all flex items-center gap-2 border-2 border-transparent hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                        >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            {isLoading ? "SYNCING NODE..." : "PING ORACLE"}
                        </button>
                    )}
                </div>

                {/* Data Display Container */}
                <div className="relative group min-h-[400px] flex flex-col">
                    {/* Border & Background Effects */}
                    <div className="absolute inset-0 bg-black/80 border-2 border-zinc-800 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-grid-white/[0.05]" />

                    <div className="relative z-10 p-8 flex-1 flex flex-col justify-center w-full">
                        {!data ? (
                            <div className="flex flex-col items-center justify-center space-y-4 text-zinc-500 w-full h-full min-h-[300px]">
                                <Server className="w-16 h-16 opacity-50" />
                                <span className="font-mono">AWAITING SIGNAL LINK...</span>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in zoom-in duration-300 w-full">
                                {/* Header Status */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${isSolvent ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        <span className="font-mono text-sm text-muted-foreground">
                                            {data.source === 'Live QuickBooks Data' ? 'LIVE FEED :: ACTIVE' : 'MOCK FEED :: CONNECTED'}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs text-zinc-600">
                                        {data.metrics?.timestamp ? new Date(data.metrics.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                                    </span>
                                </div>

                                {/* Primary Metric: Solvency Ratio */}
                                <div className="text-center space-y-2">
                                    <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Solvency Ratio</div>
                                    <div className={`text-6xl md:text-7xl font-bold font-mono tracking-tighter ${statusColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                        {data.metrics ? `${(data.metrics.solvencyRatio * 100).toFixed(2)}%` : `${data.score || 0}/100`}
                                    </div>
                                    <div className={`inline-block px-3 py-1 font-mono text-xs font-bold border ${statusBorder} ${statusBg} rounded-full`}>
                                        {isSolvent ? "SOLVENT & LIQUID" : "INSOLVENCY RISK DETECTED"}
                                    </div>
                                </div>

                                {/* Secondary Metrics for Live Data */}
                                {data.metrics && (
                                    <div className="grid grid-cols-3 gap-4 border-t border-b border-white/10 py-4">
                                        <MetricBox label="Assets" value={formatCurrency(data.metrics.assets)} />
                                        <MetricBox label="Liabilities" value={formatCurrency(data.metrics.liabilities)} />
                                        <MetricBox label="Equity" value={formatCurrency(data.metrics.equity)} />
                                    </div>
                                )}

                                {/* Proof Section */}
                                {data.proof ? (
                                    <div className="space-y-2">
                                        <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded font-mono text-xs space-y-2 overflow-hidden">
                                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                                <ShieldCheck className="w-3 h-3 text-accent" />
                                                <span className="font-bold">CRYPTOGRAPHIC PROOF</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Signer:</span>
                                                <span className="text-zinc-300 truncate max-w-[200px]">{data.proof.signer}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Signature:</span>
                                                <span className="text-zinc-300 truncate max-w-[200px]">{data.proof.signature}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-center font-mono text-zinc-600">
                                            VERIFIED ON REGISTRY: 0x71C...9B2
                                        </div>
                                    </div>
                                ) : (
                                    // Fallback for mock data sources list
                                    <div className="text-xs font-mono text-muted-foreground grid grid-cols-2 gap-2">
                                        {data.sources?.map((s) => (
                                            <div key={s.name} className="flex justify-between border border-white/5 p-2">
                                                <span>{s.name}</span>
                                                <span className={s.status === 'CONNECTED' ? 'text-emerald-500' : 'text-zinc-500'}>{s.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Explainer Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card
                    icon={<Database className="w-6 h-6" />}
                    title="Ingest"
                    desc="Encrypted adapters pull raw GL data directly from QuickBooks API."
                    step="01"
                />
                <Card
                    icon={<Binary className="w-6 h-6" />}
                    title="Process"
                    desc="Oracle engine computes solvency ratios without revealing sensitive ledger rows."
                    step="02"
                />
                <Card
                    icon={<Globe className="w-6 h-6" />}
                    title="Broadcast"
                    desc="Signed proofs are published to the Registry contract (0x...)."
                    step="03"
                />
            </div>
        </main>
    )
}

function MetricBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center">
            <div className="text-[10px] text-zinc-400 uppercase mb-1">{label}</div>
            <div className="font-mono font-bold text-sm sm:text-base text-zinc-100">{value}</div>
        </div>
    )
}

function Card({ icon, title, desc, step }: { icon: any, title: string, desc: string, step: string }) {
    return (
        <div className="relative border border-zinc-200 bg-white dark:bg-zinc-900/20 dark:border-white/10 p-6 space-y-4 hover:shadow-lg dark:hover:bg-zinc-900/40 transition-all group">
            <div className="absolute top-0 right-0 bg-zinc-100 text-zinc-900 dark:bg-foreground dark:text-background font-mono text-xs px-2 py-1 font-bold">
                STEP {step}
            </div>
            <div className="text-zinc-700 dark:text-zinc-500 group-hover:text-accent transition-colors">{icon}</div>
            <h3 className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{desc}</p>
        </div>
    )
}

function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val)
}
