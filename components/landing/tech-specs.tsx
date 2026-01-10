"use client"

import { Activity, Scale, Zap, Lock, Eye, Network, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function TechSpecs() {
    return (
        <section className="bg-foreground text-background py-24 sm:py-32 relative overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-sm font-bold font-mono tracking-widest text-background/60 mb-2 uppercase">
                            Infrastructure
                        </h2>
                        <div className="text-4xl md:text-6xl font-bold font-mono tracking-tighter">
                            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-background to-background/50">MACHINE</span>
                        </div>
                    </div>
                    <div className="max-w-md text-right md:text-left">
                        <p className="font-mono text-sm text-background/70 leading-relaxed">
                            Ultramar is not just a marketplace. It is a vertically integrated financial operating system running on the Mantle Network.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-px bg-background/20 max-w-6xl mx-auto border border-background/20">
                    {/* Card 1: The Oracle */}
                    <Link href="/oracle" className="block relative group">
                        <div className="bg-foreground p-8 sm:p-12 h-full hover:bg-zinc-900 transition-colors duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Eye className="w-32 h-32 rotate-12" />
                            </div>

                            {/* Hover Indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-6 h-6 text-accent" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 border border-background/20 rounded-full group-hover:border-accent/50 transition-colors">
                                            <Activity className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="font-bold font-mono text-xl tracking-tight group-hover:text-accent transition-colors">THE ORACLE</h3>
                                    </div>
                                    <p className="text-background/60 font-sans leading-relaxed mb-8">
                                        Continuous integration with banking and accounting APIs provides real-time solvency verification.
                                    </p>
                                </div>

                                <div className="font-mono text-xs space-y-4 border-t border-background/10 pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between">
                                        <span>LATENCY</span>
                                        <span className="text-accent">~200ms</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SOURCES</span>
                                        <span>STRIPE, PLAID, SAP</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>UPDATE FREQ</span>
                                        <span>BLOCK-BY-BLOCK</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: The Market */}
                    <Link href="/market" className="block relative group">
                        <div className="bg-foreground p-8 sm:p-12 h-full hover:bg-zinc-900 transition-colors duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap className="w-32 h-32 -rotate-12" />
                            </div>

                            {/* Hover Indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-6 h-6 text-accent" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 border border-background/20 rounded-full group-hover:border-accent/50 transition-colors">
                                            <Network className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="font-bold font-mono text-xl tracking-tight group-hover:text-accent transition-colors">THE MARKET</h3>
                                    </div>
                                    <p className="text-background/60 font-sans leading-relaxed mb-8">
                                        Automated Market Makers (AMM) ensure instant liquidity for every asset, 24/7/365.
                                    </p>
                                </div>

                                <div className="font-mono text-xs space-y-4 border-t border-background/10 pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between">
                                        <span>MODEL</span>
                                        <span className="text-accent">CPMM (x*y=k)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SETTLEMENT</span>
                                        <span>INSTANT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>PROTOCOL FEE</span>
                                        <span>0.30%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: The Law */}
                    <Link href="/law" className="block relative group">
                        <div className="bg-foreground p-8 sm:p-12 h-full hover:bg-zinc-900 transition-colors duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Scale className="w-32 h-32 rotate-0" />
                            </div>

                            {/* Hover Indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-6 h-6 text-accent" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 border border-background/20 rounded-full group-hover:border-accent/50 transition-colors">
                                            <Lock className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="font-bold font-mono text-xl tracking-tight group-hover:text-accent transition-colors">THE LAW</h3>
                                    </div>
                                    <p className="text-background/60 font-sans leading-relaxed mb-8">
                                        Assets are held in bankruptcy-remote SPVs, legally binding token ownership to equity rights.
                                    </p>
                                </div>

                                <div className="font-mono text-xs space-y-4 border-t border-background/10 pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between">
                                        <span>JURISDICTION</span>
                                        <span className="text-accent">DELAWARE (US)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>STRUCTURE</span>
                                        <span>SERIES LLC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>COMPLIANCE</span>
                                        <span>REG D / REG S</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
