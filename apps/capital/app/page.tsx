import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { ArrowRight } from 'lucide-react'
import { WaitlistForm } from "@/components/waitlist-form"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <section className="max-w-4xl mx-auto text-center mb-32">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-tight font-serif font-light tracking-tight">
            Institutional-Grade
            <br />
            <span className="font-semibold">Investment Excellence</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-muted-foreground mb-4">
            Sophisticated onchain strategies for discerning investors.
          </p>
          <p className="text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Transparent performance metrics. Non-custodial architecture.
          </p>
          
          <div className="max-w-md mx-auto">
            <WaitlistForm />
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-32">
          <div className="border border-border p-8 hover:border-accent transition-colors">
            <div className="text-5xl font-bold font-mono mb-4 text-accent">01</div>
            <h3 className="text-2xl mb-4 font-serif font-semibold tracking-tight">Transparent Performance</h3>
            <p className="leading-relaxed text-muted-foreground">
              Real-time performance metrics and complete transparency on all instruments. Know exactly where your
              capital is deployed.
            </p>
          </div>

          <div className="border border-border p-8 hover:border-accent transition-colors">
            <div className="text-5xl font-bold font-mono mb-4 text-accent">02</div>
            <h3 className="text-2xl mb-4 font-serif font-semibold tracking-tight">Secure Architecture</h3>
            <p className="leading-relaxed text-muted-foreground">
              Non-custodial architecture. Your keys, your crypto. We never have access to your funds.
            </p>
          </div>

          <div className="border border-border p-8 hover:border-accent transition-colors">
            <div className="text-5xl font-bold font-mono mb-4 text-accent">03</div>
            <h3 className="text-2xl mb-4 font-serif font-semibold tracking-tight">Efficient Investments</h3>
            <p className="leading-relaxed text-muted-foreground">
              Optimized gas usage and automated rebalancing. Focus on returns, not on managing positions.
            </p>
          </div>
        </section>

        <section className="border border-border p-12 sm:p-16 md:p-20 text-center bg-primary text-primary-foreground">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-6 tracking-tight">Ready to Start?</h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Login and start investing in minutes.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-lg hover:bg-accent/90 transition-all font-mono uppercase tracking-wider border border-accent-foreground/20"
          >
            View Strategies
            <ArrowRight className="w-5 h-5" />
          </Link>
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
