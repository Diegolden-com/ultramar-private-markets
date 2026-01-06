import { ArrowRight, Building2, Cpu, FileCheck, Globe2, LineChart, Store } from "lucide-react"
import Link from "next/link"
import { RouteHeader } from "@/components/route-header"

export default function InfoPage() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RouteHeader
                title="PRIVATE EQUITIES"
                subtitle="Giving investors exposure to real, brick-and-mortar businesses across latitudes and longitudes, different markets, and jurisdictions."
            />
            <div className="max-w-5xl mx-auto">
                {/* The Flow Section */}
                <section className="mb-16">
                    <h2 className="text-xl sm:text-2xl font-bold font-mono mb-8 text-foreground border-b-2 border-foreground pb-2">
                        HOW IT WORKS
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-background border-2 border-foreground p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Building2 className="w-6 h-6 text-accent" />
                                <h3 className="text-lg font-bold font-mono">BUSINESS OPT-IN</h3>
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                                Medium and large private businesses opt into Ultramar, agreeing to connect our systems directly to their operations.
                            </p>
                        </div>

                        <div className="bg-background border-2 border-foreground p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Cpu className="w-6 h-6 text-accent" />
                                <h3 className="text-lg font-bold font-mono">AI INTEGRATION</h3>
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                                We connect our proprietary AI into their accounting systems (SAP or QuickBooks) for real-time data ingestion and monitoring.
                            </p>
                        </div>

                        <div className="bg-background border-2 border-foreground p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <LineChart className="w-6 h-6 text-accent" />
                                <h3 className="text-lg font-bold font-mono">CONTINUOUS SNIFF TESTS</h3>
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                                Regular, continuous analysis to ensure business health and legitimacy before and during investment periods.
                            </p>
                        </div>

                        <div className="bg-background border-2 border-foreground p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileCheck className="w-6 h-6 text-accent" />
                                <h3 className="text-lg font-bold font-mono">LEGAL BACKUP</h3>
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                                Investments are legitimized by robust financial contracts that provide legal security for our investors.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Case Study Section */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b-2 border-foreground pb-2">
                        <h2 className="text-xl sm:text-2xl font-bold font-mono uppercase">
                            Case Study
                        </h2>
                        <span className="font-mono text-xs uppercase bg-accent text-accent-foreground px-3 py-1 font-bold">
                            Live Example
                        </span>
                    </div>

                    <div className="bg-muted/30 border-2 border-foreground p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Store className="w-48 h-48" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl font-bold font-mono mb-2 uppercase">
                                Lavanderías CX
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground mb-6 font-mono text-sm">
                                <Globe2 className="w-4 h-4" />
                                <span>Mexico City, MX</span>
                            </div>

                            <p className="text-base sm:text-lg mb-8 font-mono max-w-2xl text-muted-foreground">
                                A laundromat chain with 3 existing locations looking for capital to expand their operations
                                with a new storefront in the fastest-growing sector of their city.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="font-bold font-mono text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                                        The Offering
                                    </h4>
                                    <p className="font-mono text-lg font-bold">6 Week Round</p>
                                </div>
                                <div>
                                    <h4 className="font-bold font-mono text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                                        Equity For Sale
                                    </h4>
                                    <p className="font-mono text-lg font-bold">Up to 12.5%</p>
                                </div>
                                <div>
                                    <h4 className="font-bold font-mono text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                                        Valuation Model
                                    </h4>
                                    <p className="font-mono text-lg font-bold">Pre-money valuation of FCF</p>
                                    <p className="font-mono text-xs text-muted-foreground mt-1">(Directly from QuickBooks)</p>
                                </div>
                                <div>
                                    <h4 className="font-bold font-mono text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                                        Discount Rate
                                    </h4>
                                    <p className="font-mono text-lg font-bold text-accent">
                                        3x Yearly Treasury Rate
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-foreground">
                                <Link href="/app" className="bg-foreground text-background px-6 py-3 font-mono font-bold flex items-center justify-center gap-2 hover:bg-background hover:text-foreground border-2 border-transparent hover:border-foreground transition-all">
                                    VIEW DEAL ROOM <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mantle Network Section */}
                <section className="mt-24 mb-16 text-center">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/mantle-logo-black.png"
                            alt="Mantle Network"
                            className="h-12 w-auto dark:hidden"
                        />
                        <img
                            src="/mantle-logo-white.png"
                            alt="Mantle Network"
                            className="h-12 w-auto hidden dark:block"
                        />
                    </div>
                    <p className="font-mono text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        A world where finance is free, efficient, and accessible — powered by tokenized technology and open to all.
                    </p>
                </section>
            </div>
        </main >
    )
}
