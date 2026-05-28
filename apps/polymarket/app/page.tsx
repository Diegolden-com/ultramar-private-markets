import { BrandName, BrandText } from "@/components/brand-name";
import { Hero } from "@/components/hero";
import {
  Activity,
  BarChart3,
  Shield,
  FlaskConical,
  ChevronRight,
  Zap,
  Eye,
  Target,
} from "lucide-react";
import Link from "next/link";
import { ultramarSuiteLinks } from "@/lib/ultramar-apps";
import { UltramarFacets } from "@/components/ultramar-facets";

const FEATURES = [
  {
    icon: Activity,
    title: "Real-time Signals",
    description:
      "Continuous ingestion from Polymarket and Deribit. Detects price discrepancies the moment they appear.",
  },
  {
    icon: BarChart3,
    title: "Options Pricing",
    description:
      "Black-Scholes model with implied volatility surface. Computes theoretical probabilities from the options market.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Kelly criterion sizing, position limits, and real-time exposure tracking. Built-in guardrails.",
  },
  {
    icon: FlaskConical,
    title: "Paper Trading",
    description:
      "Backtest strategies with historical replay before committing capital. Validate signals risk-free.",
  },
];

const STEPS = [
  {
    icon: Eye,
    step: "01",
    title: "Ingest",
    description:
      "WebSocket feeds from prediction markets and options exchanges stream into the normalization layer.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Detect",
    description:
      "Implied probabilities are compared against Black-Scholes theoretical values. Spreads are flagged in real-time.",
  },
  {
    icon: Target,
    step: "03",
    title: "Execute",
    description:
      "Actionable signals with Kelly-optimal sizing. Paper trade or go live with built-in hedging.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="navbar sticky top-0 z-50 border-b border-border bg-background/80 px-0 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="btn btn-ghost btn-sm px-0 text-sm font-semibold uppercase tracking-[0.2em] text-foreground"
            >
              Ultramar
            </Link>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <Link
                href="/dashboard"
                className="btn btn-ghost btn-sm"
              >
                Dashboard
              </Link>
              {ultramarSuiteLinks.map((app) => (
                <a
                  key={app.href}
                  href={app.href}
                  className="badge badge-outline border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {app.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn btn-ghost btn-sm">
              Sign in
            </Link>
            <Link href="/auth/sign-up" className="btn btn-primary btn-sm">
              Sign up
            </Link>
          </div>
        </div>
        <div className="absolute top-full w-full border-t border-border bg-background/90 sm:hidden">
          <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-6 py-2 text-xs text-muted-foreground">
            <Link
              href="/dashboard"
              className="badge badge-outline shrink-0"
            >
              Dashboard
            </Link>
            {ultramarSuiteLinks.map((app) => (
              <a
                key={app.href}
                href={app.href}
                className="badge badge-outline shrink-0"
              >
                {app.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 lg:pt-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6">
              <div className="animate-fade-in-up delay-1">
                <span className="badge badge-success badge-outline gap-2">
                  <span className="status status-success animate-terminal-pulse" />
                  MVP Live
                </span>
              </div>
              <p className="animate-fade-in-up delay-2 text-xs font-medium uppercase tracking-[0.3em] text-primary">
                <BrandName /> / Signals
              </p>
              <h1 className="animate-fade-in-up delay-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Ultramar Polymarket
              </h1>
              <p className="animate-fade-in-up delay-4 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
                <BrandText>
                  {
                    "The signal layer for Ultramar.capital. It compares Polymarket prices with derivatives-implied probabilities, then turns those dislocations into monitored trading signals."
                  }
                </BrandText>
              </p>
              <div className="animate-fade-in-up delay-5 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Link href="/dashboard" className="btn btn-primary w-full sm:w-auto">
                  Open Signal Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link href="/auth/sign-up" className="btn btn-outline w-full sm:w-auto">
                  Create Account
                </Link>
              </div>
            </div>

            {/* Right: Terminal */}
            <div className="min-w-0 animate-fade-in-up delay-3">
              <Hero />
            </div>
          </div>
        </div>
      </section>

      <UltramarFacets />

      {/* Features */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Capabilities
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight lg:text-3xl">
              Full-stack signal infrastructure
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card card-border group bg-card transition-colors hover:border-primary/30 animate-fade-in-up delay-${i + 1}`}
              >
                <div className="card-body">
                  <div className="avatar placeholder mb-4">
                    <div className="w-11 rounded-lg border border-border bg-secondary text-primary">
                      <f.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="card-title text-base">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight lg:text-3xl">
              From market data to actionable signals
            </h2>
          </div>
          <div className="steps steps-vertical w-full gap-8 lg:steps-horizontal">
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className={`step step-primary animate-fade-in-up delay-${i + 1}`}
              >
                <div className="mt-4 max-w-sm text-left lg:text-center">
                  <span className="badge badge-primary mb-4 font-mono">
                    {s.step}
                  </span>
                  <s.icon className="mx-0 mb-3 h-5 w-5 text-muted-foreground lg:mx-auto" />
                  <h3 className="mb-2 text-base font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
            Start detecting signals
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Open the dashboard to explore live trading signals, or create an
            account to unlock paper trading and execution.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              Open Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Ultramar
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Crypto options signal infrastructure</span>
            {ultramarSuiteLinks.map((app) => (
              <a
                key={app.href}
                href={app.href}
                className="transition-colors hover:text-foreground"
              >
                {app.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
