"use client"

import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export function Hero() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
            {/* Background Aurora Gradient */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-accent/10 blur-[180px] filter" />

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards z-10 max-w-5xl">
                <h1 className="mb-8 font-serif text-6xl font-bold tracking-tighter text-foreground sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
                    Capital, <span className="block text-muted-foreground/80 italic font-medium mt-2 sm:mt-0 sm:inline">Unshackled.</span>
                </h1>
                <p className="mx-auto mb-12 max-w-2xl font-mono text-lg text-muted-foreground/80 sm:text-xl md:text-2xl tracking-tight">
                    Real assets. Real yield. <br className="hidden sm:inline" />
                    On-chain transparency for the sovereign individual.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                    <Link
                        href="/app"
                        className="group flex h-14 w-full items-center justify-center gap-2 rounded-full border border-foreground/10 bg-foreground/90 px-8 font-mono text-lg font-bold text-background backdrop-blur-sm transition-all hover:bg-foreground hover:scale-105 sm:w-auto"
                    >
                        LAUNCH APP
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/info"
                        className="group flex h-14 w-full items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background/50 px-8 font-mono text-lg font-bold text-foreground backdrop-blur-md transition-all hover:bg-background/80 hover:scale-105 sm:w-auto"
                    >
                        THE MANIFESTO
                        <BookOpen className="h-5 w-5 opacity-70" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
