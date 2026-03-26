"use client"

import { useEffect, useState } from "react"
import { RouteHeader } from "@/components/route-header"
import { Wallet, PieChart, Activity, Loader2, TrendingUp, TrendingDown, Download } from "lucide-react"
import { motion } from "framer-motion"

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
                <div className="space-y-10">
                    {/* Summary Cards - Premium design */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="md:col-span-2 relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-accent/10">
                                        <Wallet className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Total Equity</span>
                                </div>
                                <div className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-foreground mb-3">
                                    {formatCurrency(data.totalValue)}
                                </div>
                                <div className="flex items-center gap-3 font-mono text-sm">
                                    {data.dayChange >= 0 ? (
                                        <>
                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
                                                <TrendingUp className="w-4 h-4" />
                                                +{data.dayChange}%
                                            </span>
                                            <span className="text-muted-foreground">
                                                ({data.dayChange >= 0 ? "+" : ""}{formatCurrency(data.dayChangeValue)}) today
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-500">
                                                <TrendingDown className="w-4 h-4" />
                                                {data.dayChange}%
                                            </span>
                                            <span className="text-muted-foreground">
                                                ({formatCurrency(data.dayChangeValue)}) today
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 flex flex-col"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 via-transparent to-transparent" />
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-chart-3/10">
                                        <Activity className="w-5 h-5 text-chart-3" />
                                    </div>
                                    <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Performance</span>
                                </div>
                                <div className="h-3 w-full bg-muted rounded-full overflow-hidden mb-4">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "75%" }}
                                        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full" 
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm font-mono">
                                    <span className="text-muted-foreground">YTD Return</span>
                                    <span className="font-bold text-foreground">+12.4%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-mono mt-3">
                                    <span className="text-muted-foreground">Realized Gains</span>
                                    <span className="font-bold text-foreground">$14,200</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Holdings Table */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between border-b border-border/60 pb-4">
                            <h3 className="text-lg font-bold font-mono flex items-center gap-3 text-foreground">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <PieChart className="w-4 h-4 text-accent" />
                                </div>
                                <span className="tracking-widest">HOLDINGS</span>
                            </h3>
                            <button className="flex items-center gap-2 text-xs font-mono bg-foreground text-background px-4 py-2 rounded-lg font-semibold hover:bg-foreground/90 transition-colors">
                                <Download className="w-3 h-3" />
                                EXPORT CSV
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/30 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                            <th className="py-4 px-6 font-medium">Asset</th>
                                            <th className="py-4 px-6 font-medium">Type</th>
                                            <th className="py-4 px-6 text-right font-medium">Balance</th>
                                            <th className="py-4 px-6 text-right font-medium">Price</th>
                                            <th className="py-4 px-6 text-right font-medium">Value</th>
                                            <th className="py-4 px-6 text-right font-medium">24h</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-sm">
                                        {data.assets.map((asset, index) => (
                                            <motion.tr 
                                                key={asset.ticker}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                                                className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                                            >
                                                <td className="py-5 px-6">
                                                    <div className="font-bold text-foreground">{asset.ticker}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{asset.name}</div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-[10px] uppercase font-medium">
                                                        {asset.type}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right text-muted-foreground">
                                                    {asset.balance.toLocaleString()}
                                                </td>
                                                <td className="py-5 px-6 text-right text-muted-foreground">
                                                    {formatCurrency(asset.price)}
                                                </td>
                                                <td className="py-5 px-6 text-right font-bold text-foreground">
                                                    {formatCurrency(asset.value)}
                                                </td>
                                                <td className={`py-5 px-6 text-right ${asset.change >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                                                    {asset.change > 0 && "+"}{asset.change}%
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="text-center text-red-500 font-mono p-8 rounded-2xl border border-red-500/20 bg-red-500/5">
                    System Error: Unable to retrieve localized financial data.
                </div>
            )}
        </main>
    )
}
