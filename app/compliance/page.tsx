"use client"

import { useState } from "react"
import { RouteHeader } from "@/components/route-header"
import { ShieldCheck, Database, Globe, Scale, Lock, RefreshCw, Server, Activity } from "lucide-react"

interface ComplianceData {
    score: number
    status: string
    sources: { name: string; latency: string }[]
}

export default function CompliancePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [complianceData, setComplianceData] = useState<ComplianceData | null>(null)

    const fetchComplianceData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/compliance/score')
            const data = await res.json()
            setComplianceData(data)
        } catch (error) {
            console.error("Failed to fetch compliance data", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="COMPLIANCE"
                subtitle="Real-time financial telemetry and automated continuous verification."
            />

            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold font-mono leading-tight">
                        REAL-TIME TRUTH, <br />
                        <span className="text-accent bg-accent/10 px-2">ONCHAIN.</span>
                    </h2>
                    <p className="text-muted-foreground font-mono text-lg">
                        We replace quarterly PDFs with millisecond-latency API streams.
                        Our AI monitors issuer bank accounts, receivables, and cash flow
                        24/7—providing a live &quot;Trust Score&quot; visible to every investor.
                    </p>
                </div>
                <div className="border-2 border-foreground p-8 bg-muted/20 relative overflow-hidden group min-h-[300px] flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />

                    {/* Dynamic Status Component */}
                    <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <RefreshCw className="w-16 h-16 text-accent animate-spin" />
                                <div className="font-mono text-lg animate-pulse">Running diagnostics...</div>
                            </div>
                        ) : complianceData ? (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="relative inline-block">
                                    <div className="text-6xl font-bold font-mono tracking-tighter">
                                        {complianceData.score}
                                    </div>
                                    <div className="text-xs font-mono absolute -top-4 -right-8 bg-foreground text-background px-2 py-0.5 rounded-full">
                                        SCORE
                                    </div>
                                </div>

                                <div className={`font-mono text-xl font-bold px-4 py-1 inline-block ${complianceData.status === 'OPTIMAL' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                                        complianceData.status === 'HEALTHY' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                            'bg-red-500/20 text-red-700 dark:text-red-400'
                                    }`}>
                                    STATUS: {complianceData.status}
                                </div>

                                <div className="text-sm font-mono text-muted-foreground border-t border-foreground/10 pt-4 mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-left">
                                    {complianceData.sources.map((src) => (
                                        <div key={src.name} className="flex items-center justify-between gap-4">
                                            <span>{src.name}</span>
                                            <span className="text-accent text-[10px]">● {src.latency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Initial State
                            <div className="space-y-4">
                                <Activity className="w-16 h-16 text-muted-foreground/50 mx-auto" />
                                <div className="font-mono text-2xl font-bold text-muted-foreground/50">SYSTEM IDLE</div>
                                <button
                                    onClick={fetchComplianceData}
                                    className="bg-accent text-accent-foreground px-6 py-3 font-mono font-bold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    SIMULATE ORACLE REFRESH
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Integrations Grid */}
            <div className="mb-20">
                <h3 className="text-xl font-bold font-mono mb-8 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    TRUSTED DATA SOURCES
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Stripe", desc: "Revenue Stream" },
                        { name: "QuickBooks", desc: "Accounting & payroll" },
                        { name: "Mercury", desc: "Treasury Balance" },
                        { name: "Plaid", desc: "Bank Verification" },
                    ].map((item) => (
                        <div key={item.name} className="border-2 border-foreground p-6 hover:bg-muted transition-colors flex flex-col items-center justify-center text-center gap-2 h-32">
                            <span className="font-bold text-xl">{item.name}</span>
                            <span className="text-xs font-mono text-muted-foreground">{item.desc}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-4 text-center">
                    Read-only API access granted by issuers directly to the Compliance Engine.
                </p>
            </div>

            {/* How it Works / The Oracle */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold font-mono mb-4">THE ONCHAIN ORACLE</h3>
                    <p className="text-muted-foreground font-mono max-w-2xl mx-auto">
                        A three-step loop ensuring that the price of equity always reflects the reality of the business.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="border border-foreground/20 p-8 space-y-4 bg-background relative">
                        <div className="absolute top-0 right-0 bg-foreground text-background font-mono text-xs px-2 py-1">STEP 01</div>
                        <Server className="w-10 h-10 text-muted-foreground" />
                        <h4 className="font-bold font-mono text-lg">INGEST</h4>
                        <p className="text-sm font-mono text-muted-foreground">
                            Secure adapters pull encrypted financial data from banking and payment APIs. Zero-knowledge proofs verify balances without revealing individual customer transactions.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="border border-foreground/20 p-8 space-y-4 bg-background relative">
                        <div className="absolute top-0 right-0 bg-foreground text-background font-mono text-xs px-2 py-1">STEP 02</div>
                        <ShieldCheck className="w-10 h-10 text-accent" />
                        <h4 className="font-bold font-mono text-lg">VERIFY</h4>
                        <p className="text-sm font-mono text-muted-foreground">
                            Our proprietary AI model analyzes burn rate, revenue retention, and fraud indicators. Anomalies trigger immediate &quot;Circuit Breaker&quot; pauses on trading.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="border border-foreground/20 p-8 space-y-4 bg-background relative">
                        <div className="absolute top-0 right-0 bg-foreground text-background font-mono text-xs px-2 py-1">STEP 03</div>
                        <Globe className="w-10 h-10 text-muted-foreground" />
                        <h4 className="font-bold font-mono text-lg">PUBLISH</h4>
                        <p className="text-sm font-mono text-muted-foreground">
                            The aggregate Compliance Score (0-100) is written on-chain. Smart Contracts automatically adjust collateral requirements or trading limits based on this score.
                        </p>
                    </div>
                </div>
            </div>

            {/* Legal Disclaimers */}
            <div className="bg-muted p-6 md:p-12 border-t-2 border-foreground">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-start gap-4">
                        <Scale className="w-6 h-6 shrink-0 mt-1" />
                        <div className="space-y-2">
                            <h5 className="font-bold font-mono text-sm">NOT A REGISTERED BROKER-DEALER</h5>
                            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                                Ultramar Private Equities is a technology provider. We develop software that enables issuers to tokenize assets and investors to self-custody. We do not provide investment advice, endorse any issuer, or facilitate negotiations. All investments involve risk, including the loss of principal.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Lock className="w-6 h-6 shrink-0 mt-1" />
                        <div className="space-y-2">
                            <h5 className="font-bold font-mono text-sm">TECHNOLOGY LIMITATIONS</h5>
                            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                                The &quot;Compliance Score&quot; and &quot;Oracle&quot; systems are automated software tools. They analyze historical and real-time data but cannot predict future performance or guarantee the absence of fraud. API connections are dependent on third-party uptime. Smart contracts are experimental technology.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
