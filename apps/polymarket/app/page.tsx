import { Button } from "@/components/ui/button";
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
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground"
            >
              Ultramar
            </Link>
            <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
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
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-positive animate-terminal-pulse" />
                  MVP Live
                </span>
              </div>
              <h1 className="animate-fade-in-up delay-2 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
                Trading signals where{" "}
                <span className="text-primary">options</span> meet{" "}
                <span className="text-primary">prediction markets</span>
              </h1>
              <p className="animate-fade-in-up delay-3 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
                Ultramar detects price discrepancies between crypto options on
                Deribit and prediction markets on Polymarket. Real-time signals,
                theoretical pricing, and automated execution.
              </p>
              <div className="animate-fade-in-up delay-4 flex items-center gap-3 pt-2">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Open Dashboard
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/auth/sign-up">Create Account</Link>
                </Button>
              </div>
            </div>

            {/* Right: Terminal */}
            <div className="animate-fade-in-up delay-3">
              <Hero />
            </div>
          </div>
        </div>
      </section>

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
                className={`group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 animate-fade-in-up delay-${i + 1}`}
              >
                <div className="mb-4 inline-flex rounded-lg border border-border bg-secondary p-2.5">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
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
          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.step} className={`animate-fade-in-up delay-${i + 1}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
                    {s.step}
                  </span>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
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
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Open Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Ultramar
          </p>
          <p className="text-xs text-muted-foreground">
            Crypto options signal infrastructure
          </p>
        </div>
      </footer>
    </main>
  );
}
