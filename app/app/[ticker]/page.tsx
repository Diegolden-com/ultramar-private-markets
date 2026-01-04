import { DEALS } from "@/lib/deals"
import { ArrowLeft, ShieldCheck, Globe, Activity, Zap, Percent, Clock, FileText, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono pb-24">
            {/* Top Navigation */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/app"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-500 transition-colors"
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
                                <span className="text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded">
                                    {deal.ticker}
                                </span>
                                {deal.status === 'closing_soon' && (
                                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> CLOSING SOON
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{deal.name}</h1>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Globe className="w-4 h-4" />
                                <span>{deal.location}</span>
                                <span className="mx-2">•</span>
                                <span>{deal.sector}</span>
                            </div>
                        </div>

                        <div className="flex items-end gap-2">
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">AI Compliance Score</div>
                                <div className="flex items-center gap-2 justify-end">
                                    <ShieldCheck className="w-8 h-8 text-green-500" />
                                    <span className="text-4xl font-bold text-green-600 dark:text-green-500">{deal.complianceScore}</span>
                                    <span className="text-xl text-slate-400 self-end mb-1">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="max-w-3xl">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-sky-500 pl-4">
                            {deal.description}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Metrics & Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Metrics Grid */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                    <Activity className="w-4 h-4" /> Target APY
                                </div>
                                <div className="text-3xl font-bold">{deal.apy}%</div>
                                <div className="text-xs text-green-500 mt-1">+2.4% vs Sector Avg</div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                    <Zap className="w-4 h-4" /> Valuation
                                </div>
                                <div className="text-3xl font-bold">${(deal.valuation / 1000000).toFixed(1)}M</div>
                                <div className="text-xs text-slate-500 mt-1">Pre-money FCF Based</div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                    <Percent className="w-4 h-4" /> Equity For Sale
                                </div>
                                <div className="text-3xl font-bold">{deal.equityForSale}%</div>
                                <div className="text-xs text-slate-500 mt-1">Preferred Stock</div>
                            </div>
                        </div>

                        {/* Deal Highlights / Deep Dive */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-sky-500" />
                                DEAL HIGHLIGHTS
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-1">Audited Financials Integration</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Direct API connection to QuickBooks/SAP allows for real-time verification of free cash flow claims.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-1">Operational Expansion</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Capital directly funds physical locations/equipment with clear ROI projection based on existing unit economics.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-1">Legal Wrapper</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Token ownership represents legal claim to equity via SPV structure based in Delaware.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl">
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 dark:border-slate-900/10 pb-4">
                                <span className="text-sm font-bold opacity-80">MINIMUM TICKET</span>
                                <span className="text-2xl font-bold">${deal.minInvestment}</span>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">Round Size</span>
                                    <span className="font-bold">$562,500</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">Closing Date</span>
                                    <span className="font-bold">Feb 28, 2030</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60">Structure</span>
                                    <span className="font-bold">SPV / LLC</span>
                                </div>
                            </div>

                            <button className="w-full bg-sky-500 hover:bg-sky-400 text-white py-4 rounded-lg font-bold text-lg mb-3 transition-colors">
                                Invest Now
                            </button>
                            <p className="text-center text-xs opacity-50 px-4">
                                By clicking Invest, you agree to the Terms of Service and accredited investor verification.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
