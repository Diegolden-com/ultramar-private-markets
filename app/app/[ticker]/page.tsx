import { DEALS } from "@/lib/deals"
import { ArrowLeft, ShieldCheck, Globe, Activity, Zap, Percent, Clock, FileText, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SwapWidget } from "@/components/trading/swap-widget"

export function generateStaticParams() {
    return DEALS.map((deal) => ({
        ticker: deal.ticker,
    }))
}

export default async function DealPage(props: { params: Promise<{ ticker: string }> }) {
    const params = await props.params;
    const deal = DEALS.find((d) => d.ticker === params.ticker)

    if (!deal) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-mono pb-24">
            {/* Top Navigation */}
            <div className="border-b-2 border-foreground bg-background">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/app"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO MARKET
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 border border-accent/20">
                                    {deal.ticker}
                                </span>
                                {deal.status === 'closing_soon' && (
                                    <span className="text-sm font-bold text-destructive bg-destructive/10 px-3 py-1 border border-destructive/20 flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> CLOSING SOON
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 uppercase">{deal.name}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Globe className="w-4 h-4" />
                                <span>{deal.location}</span>
                                <span className="mx-2">•</span>
                                <span>{deal.sector}</span>
                            </div>
                        </div>

                        <div className="flex items-end gap-2">
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Compliance Score</div>
                                <div className="flex items-center gap-2 justify-end">
                                    <ShieldCheck className="w-8 h-8 text-green-500" />
                                    <span className="text-4xl font-bold text-accent">{deal.complianceScore}</span>
                                    <span className="text-xl text-muted-foreground self-end mb-1">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="max-w-3xl">
                        <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-accent pl-4">
                            {deal.description}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Metrics & Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Metrics Grid */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-background p-6 border-2 border-foreground">
                                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                                    <Activity className="w-4 h-4" /> Target APY
                                </div>
                                <div className="text-3xl font-bold font-mono">{deal.apy}%</div>
                                <div className="text-xs text-green-500 mt-1">+2.4% vs Sector Avg</div>
                            </div>
                            <div className="bg-background p-6 border-2 border-foreground">
                                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                                    <Zap className="w-4 h-4" /> Valuation
                                </div>
                                <div className="text-3xl font-bold font-mono">${(deal.valuation / 1000000).toFixed(1)}M</div>
                                <div className="text-xs text-muted-foreground mt-1">Pre-money FCF Based</div>
                            </div>
                            <div className="bg-background p-6 border-2 border-foreground">
                                <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                                    <Percent className="w-4 h-4" /> Equity For Sale
                                </div>
                                <div className="text-3xl font-bold font-mono">{deal.equityForSale}%</div>
                                <div className="text-xs text-muted-foreground mt-1">Preferred Stock</div>
                            </div>
                        </div>

                        {/* Deal Highlights / Deep Dive */}
                        <div className="bg-background border-2 border-foreground p-6 sm:p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase">
                                <FileText className="w-5 h-5 text-accent" />
                                Deal Highlights
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-500/10 p-1 border border-green-500/20">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-1 uppercase">Audited Financials Integration</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Direct API connection to QuickBooks/SAP allows for real-time verification of free cash flow claims.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-500/10 p-1 border border-green-500/20">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-1 uppercase">Operational Expansion</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Capital directly funds physical locations/equipment with clear ROI projection based on existing unit economics.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-500/10 p-1 border border-green-500/20">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-1 uppercase">Legal Wrapper</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Token ownership represents legal claim to equity via SPV structure based in Delaware.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Action Card */}
                    <div className="lg:col-span-1">
                        <SwapWidget
                            ticker={deal.ticker}
                            currentPrice={1.00} // Mock price, 1 share = $1 nominal usually or valuation based
                            minTicket={deal.minInvestment}
                        />
                    </div>
                </div>

            </main>
        </div>
    )
}
