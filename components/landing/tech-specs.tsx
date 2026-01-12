"use client"

import { Activity, Scale, Zap, Lock, Eye, Network, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function TechSpecs() {
    return (
        <section className="bg-background text-foreground py-24 sm:py-32 relative overflow-hidden selection:bg-accent selection:text-background">
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-sm font-bold font-mono tracking-widest text-muted-foreground mb-2 uppercase">
                            Infrastructure
                        </h2>
                        <div className="text-4xl md:text-6xl font-bold font-mono tracking-tighter text-foreground">
                            THE MACHINE
                        </div>
                    </div>
                    <div className="max-w-md text-right md:text-left">
                        <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                            Ultramar is a vertically integrated financial operating system running on the Mantle Network.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-px bg-border max-w-6xl mx-auto border border-border">
                    {/* Card 1: The Oracle */}
                    <Link href="/oracle" className="block relative group h-full">
                        <div className="bg-background p-8 sm:p-12 h-full hover:bg-muted/50 transition-colors duration-500 relative overflow-hidden flex flex-col justify-between">

                            {/* Tarot Image Background/Overlay */}
                            <div className="absolute top-0 right-0 w-64 h-64 -translate-y-12 translate-x-12 opacity-20 group-hover:opacity-40 transition-all duration-700 mix-blend-multiply dark:mix-blend-screen grayscale">
                                <Image
                                    src="/tarot-oracle.png"
                                    alt="The Oracle Eye"
                                    fill
                                    className="object-contain rotate-12"
                                />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 border border-border rounded-full group-hover:border-accent/50 transition-colors bg-secondary/50">
                                        <Activity className="w-5 h-5 text-accent" />
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="font-bold font-mono text-2xl tracking-tight mb-4 text-foreground group-hover:text-accent transition-colors">THE ORACLE</h3>

                                <p className="text-muted-foreground font-sans leading-relaxed mb-8 text-sm">
                                    Continuous integration with banking and accounting APIs provides real-time solvency verification.
                                </p>
                            </div>

                            <div className="relative z-10 font-mono text-xs space-y-4 border-t border-border pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
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
                    </Link>

                    {/* Card 2: The Market */}
                    <Link href="/market" className="block relative group h-full">
                        <div className="bg-background p-8 sm:p-12 h-full hover:bg-muted/50 transition-colors duration-500 relative overflow-hidden flex flex-col justify-between">
                            {/* Tarot Image Background/Overlay */}
                            <div className="absolute top-0 right-0 w-64 h-64 -translate-y-8 translate-x-12 opacity-20 group-hover:opacity-40 transition-all duration-700 mix-blend-multiply dark:mix-blend-screen grayscale">
                                <Image
                                    src="/tarot-market.png"
                                    alt="The Market Wheel"
                                    fill
                                    className="object-contain -rotate-12"
                                />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 border border-border rounded-full group-hover:border-accent/50 transition-colors bg-secondary/50">
                                        <Network className="w-5 h-5 text-accent" />
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="font-bold font-mono text-2xl tracking-tight mb-4 text-foreground group-hover:text-accent transition-colors">THE MARKET</h3>

                                <p className="text-muted-foreground font-sans leading-relaxed mb-8 text-sm">
                                    Automated Market Makers (AMM) ensure instant liquidity for every asset, 24/7/365.
                                </p>
                            </div>

                            <div className="relative z-10 font-mono text-xs space-y-4 border-t border-border pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
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
                    </Link>

                    {/* Card 3: The Law */}
                    <Link href="/law" className="block relative group h-full">
                        <div className="bg-background p-8 sm:p-12 h-full hover:bg-muted/50 transition-colors duration-500 relative overflow-hidden flex flex-col justify-between">
                            {/* Tarot Image Background/Overlay */}
                            <div className="absolute top-0 right-0 w-64 h-64 -translate-y-12 translate-x-12 opacity-20 group-hover:opacity-40 transition-all duration-700 mix-blend-multiply dark:mix-blend-screen grayscale">
                                <Image
                                    src="/tarot-law.png"
                                    alt="Scales of Justice"
                                    fill
                                    className="object-contain rotate-6"
                                />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 border border-border rounded-full group-hover:border-accent/50 transition-colors bg-secondary/50">
                                        <Lock className="w-5 h-5 text-accent" />
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="font-bold font-mono text-2xl tracking-tight mb-4 text-foreground group-hover:text-accent transition-colors">THE LAW</h3>

                                <p className="text-muted-foreground font-sans leading-relaxed mb-8 text-sm">
                                    Assets are held in bankruptcy-remote SPVs, legally binding token ownership to equity rights.
                                </p>
                            </div>

                            <div className="relative z-10 font-mono text-xs space-y-4 border-t border-border pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
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
                    </Link>
                </div>
            </div>
        </section>
    )
}
