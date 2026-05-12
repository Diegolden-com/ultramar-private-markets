import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { ArrowRight } from 'lucide-react'
import { WaitlistForm } from "@/components/waitlist-form"
import { UltramarFacets } from "@/components/ultramar-facets"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main>
        <section className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-accent">
              Ultramar.capital / Allocator
            </p>
            <h1 className="mb-8 font-serif text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
              Ultramar Capital
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The allocator layer for Ultramar.capital. Compare DeFi yield,
              derivatives, event-market signals, and tokenized private-market
              exposure from one portfolio context.
            </p>
            <p className="mb-10 mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
              Transparent strategy metadata, non-custodial architecture, and
              clear paths into each specialist app.
            </p>

            <div className="grid gap-4 sm:grid-cols-[260px_minmax(0,384px)] sm:items-start">
              <Link
                href="/app"
                className="inline-flex h-14 items-center justify-center gap-3 whitespace-nowrap bg-foreground px-7 font-mono text-sm uppercase tracking-wider text-background transition-colors hover:bg-foreground/90"
              >
                View Strategies
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="w-full">
                <WaitlistForm />
              </div>
            </div>
          </div>

          <div className="border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Strategy stack
            </p>
            <div className="mt-8 space-y-5">
              {[
                ["01", "Lending Markets", "Stablecoin yield and rate dislocations."],
                ["02", "Derivative Arbitrage", "Options, volatility, and hedge-aware positions."],
                ["03", "Polymarket Arbitrage", "Prediction markets compared with model probabilities."],
                ["04", "Private Markets", "Tokenized real assets and solvency-backed exposure."],
              ].map(([number, title, description]) => (
                <div key={title} className="border-t border-border pt-5">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-mono text-xs text-accent">{number}</span>
                    <h2 className="font-serif text-xl font-semibold">{title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <UltramarFacets />

        <section className="container mx-auto px-4 py-20">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-accent">
              Allocator principles
            </p>
            <h2 className="font-serif text-4xl font-semibold">
              Built to evaluate strategies before capital moves.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="border border-border p-8 transition-colors hover:border-accent">
              <div className="mb-4 font-mono text-5xl font-bold text-accent">01</div>
              <h3 className="mb-4 font-serif text-2xl font-semibold">Transparent Performance</h3>
              <p className="leading-relaxed text-muted-foreground">
                Real-time performance metrics and complete transparency on all instruments. Know exactly where your
                capital is deployed.
              </p>
            </div>

            <div className="border border-border p-8 transition-colors hover:border-accent">
              <div className="mb-4 font-mono text-5xl font-bold text-accent">02</div>
              <h3 className="mb-4 font-serif text-2xl font-semibold">Secure Architecture</h3>
              <p className="leading-relaxed text-muted-foreground">
                Non-custodial architecture. Your keys, your crypto. We never have access to your funds.
              </p>
            </div>

            <div className="border border-border p-8 transition-colors hover:border-accent">
              <div className="mb-4 font-mono text-5xl font-bold text-accent">03</div>
              <h3 className="mb-4 font-serif text-2xl font-semibold">Efficient Investments</h3>
              <p className="leading-relaxed text-muted-foreground">
                Optimized gas usage and automated rebalancing. Focus on returns, not on managing positions.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="border border-border bg-primary p-12 text-center text-primary-foreground sm:p-16 md:p-20">
            <h2 className="mb-6 font-serif text-3xl font-semibold sm:text-4xl md:text-5xl">
              Ready to compare the suite?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90 sm:text-xl">
              Open the strategy catalogue and move from research to the right
              Ultramar surface.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-3 border border-accent-foreground/20 bg-accent px-8 py-4 font-mono text-lg uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
            >
              View Strategies
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-32 py-8">
        <div className="container mx-auto px-4 text-center text-sm font-mono tracking-wider text-muted-foreground">
          ULTRAMAR CAPITAL © PAN.TECH — ALL RIGHTS RESERVED © 2025
        </div>
      </footer>
    </div>
  )
}
