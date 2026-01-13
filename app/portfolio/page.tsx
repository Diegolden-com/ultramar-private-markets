"use client"

import { useEffect, useState } from "react"
import { RouteHeader } from "@/components/route-header"
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, Activity, Loader2 } from "lucide-react"

interface Asset {
    ticker: string;
    name: string;
    type: string;
    balance: number;
    price: number;
    value: number;
    change: number;
    apy: number;
}

interface PortfolioData {
    totalValue: number;
    dayChange: number;
    dayChangeValue: number;
    assets: Asset[];
}

export default function PortfolioPage() {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/portfolio')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch portfolio", err);
                setLoading(false);
            });
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="PORTFOLIO"
                subtitle="Aggregated holdings across the Ultramar ecosystem."
            />

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : data ? (
                <div className="space-y-12">
                    {/* Summary Card */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
                            <div className="relative z-10 space-y-2">
                                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Wallet className="w-4 h-4" /> Total Equity
                                </div>
                                <div className="text-5xl md:text-6xl font-bold font-mono tracking-tighter text-zinc-900 dark:text-white">
                                    {formatCurrency(data.totalValue)}
                                </div>
                                <div className="flex items-center gap-2 font-mono text-sm">
                                    <span className={data.dayChange >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}>
                                        {data.dayChange >= 0 ? "+" : ""}{data.dayChange}%
                                    </span>
                                    <span className="text-zinc-500 dark:text-zinc-600">
                                        ({data.dayChange >= 0 ? "+" : ""}{formatCurrency(data.dayChangeValue)}) today
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-center space-y-4">
                            <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Performance
                            </div>
                            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[75%]" />
                            </div>
                            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                                <span>YTD Return</span>
                                <span className="text-zinc-900 dark:text-white font-bold">+12.4%</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                                <span>Realized Gains</span>
                                <span className="text-zinc-900 dark:text-white font-bold">$14,200</span>
                            </div>
                        </div>
                    </div>

                    {/* Industrial Asset List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
                            <h3 className="text-xl font-bold font-mono flex items-center gap-2 text-zinc-900 dark:text-white">
                                <PieChart className="w-5 h-5 text-accent" /> HOLDINGS
                            </h3>
                            <button className="text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-black px-3 py-1 font-bold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
                                EXPORT CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-white/10 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                        <th className="py-4 px-4">Asset</th>
                                        <th className="py-4 px-4">Type</th>
                                        <th className="py-4 px-4 text-right">Balance</th>
                                        <th className="py-4 px-4 text-right">Price</th>
                                        <th className="py-4 px-4 text-right">Value</th>
                                        <th className="py-4 px-4 text-right">24h</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-sm">
                                    {data.assets.map((asset) => (
                                        <tr key={asset.ticker} className="border-b border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-zinc-900 dark:text-white">{asset.ticker}</div>
                                                <div className="text-xs text-muted-foreground">{asset.name}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded text-[10px] uppercase">
                                                    {asset.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right text-zinc-700 dark:text-zinc-300">
                                                {asset.balance.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-right text-zinc-700 dark:text-zinc-300">
                                                {formatCurrency(asset.price)}
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-zinc-900 dark:text-white">
                                                {formatCurrency(asset.value)}
                                            </td>
                                            <td className={`py-4 px-4 text-right ${asset.change >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                                                {asset.change > 0 && "+"}{asset.change}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-red-500 font-mono">
                    System Error: Unable to retrieve localized financial data.
                </div>
            )}
        </main>
    )
}
