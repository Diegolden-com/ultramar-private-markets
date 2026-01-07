"use client"

import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export function Hero() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
                <h1 className="mb-6 max-w-4xl font-serif text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl">
                    Capital, <span className="text-muted-foreground italic">Unshackled.</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl font-mono text-lg text-muted-foreground sm:text-xl md:text-2xl">
                    Real assets. Real yield. <br className="hidden sm:inline" />
                    On-chain transparency for the sovereign individual.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
                    <Link
                        href="/app"
                        className="group flex h-14 w-full items-center justify-center gap-2 border border-foreground bg-foreground px-8 font-mono text-lg font-bold text-background transition-all hover:bg-background hover:text-foreground sm:w-auto"
                    >
                        LAUNCH APP
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/info"
                        className="group flex h-14 w-full items-center justify-center gap-2 border border-muted-foreground bg-transparent px-8 font-mono text-lg font-bold text-muted-foreground transition-all hover:border-foreground hover:text-foreground sm:w-auto"
                    >
                        READ MANIFESTO
                        <BookOpen className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            {/* Abstract Background Element */}
            <div className="absolute -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
        </section>
    )
}
