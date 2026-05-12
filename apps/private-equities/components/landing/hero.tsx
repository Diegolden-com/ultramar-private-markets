"use client"

import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
    return (
        <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')] bg-repeat" />
            </div>

            <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
                <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-foreground/30 to-transparent" />
                <div className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl z-10"
            >
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-6 font-mono text-xs tracking-[0.4em] text-accent uppercase"
                >
                    Ultramar.capital / Private markets
                </motion.p>

                <h1 className="mb-10 font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-[0.98]">
                    Ultramar Private Equities
                </h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mx-auto mb-14 max-w-2xl font-sans text-lg sm:text-xl md:text-2xl text-muted-foreground/80 leading-relaxed"
                >
                    The private-market rail for Ultramar.capital. Tokenized
                    company exposure, issuer data, solvency proofs, and
                    permissioned secondary-market experiments.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6"
                >
                    <Link
                        href="/equities"
                        className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-8 font-mono text-sm font-bold text-background transition-all duration-300 hover:bg-foreground/90 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            EXPLORE ASSETS
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 group-hover:translate-x-0" />
                    </Link>
                    <Link
                        href="/info"
                        className="group flex h-14 items-center justify-center gap-3 rounded-full border border-foreground/15 bg-foreground/[0.03] px-8 font-mono text-sm font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-foreground/[0.06] hover:border-foreground/25"
                    >
                        READ INFO
                        <BookOpen className="h-4 w-4 opacity-50" />
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}
