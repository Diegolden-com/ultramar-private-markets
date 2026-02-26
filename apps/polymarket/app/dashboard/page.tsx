import PositionSummary from "@/components/PositionSummary";
import SignalTable from "@/components/SignalTable";
import { Activity, BarChart3, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function fetchJson(path: string) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

type Signal = {
  id: number;
  implied_prob: number;
  theoretical_prob: number;
  spread: number;
  meta?: Record<string, unknown>;
  created_at?: string;
};

type Position = {
  id: number;
  venue: string;
  size: number;
  avg_price: number;
};

export default async function DashboardPage() {
  const signals: Signal[] = await fetchJson("/signals");
  const positions: Position[] = await fetchJson("/positions");

  const avgSpread =
    signals.length > 0
      ? signals.reduce((sum, s) => sum + Math.abs(s.spread), 0) / signals.length
      : 0;

  const totalExposure = positions.reduce(
    (acc, pos) => acc + pos.size * pos.avg_price,
    0,
  );

  const stats = [
    {
      label: "Total Signals",
      value: signals.length.toString(),
      icon: Activity,
      accent: "text-primary",
    },
    {
      label: "Avg Spread",
      value: avgSpread.toFixed(4),
      icon: TrendingUp,
      accent: avgSpread > 0.03 ? "text-signal-positive" : "text-muted-foreground",
    },
    {
      label: "Exposure",
      value: `$${totalExposure.toFixed(2)}`,
      icon: Wallet,
      accent: "text-foreground",
    },
    {
      label: "Positions",
      value: positions.length.toString(),
      icon: BarChart3,
      accent: positions.length > 0 ? "text-primary" : "text-muted-foreground",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.2em]"
            >
              Ultramar
            </Link>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              /
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-xs text-signal-positive">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-positive animate-terminal-pulse" />
              LIVE
            </span>
            <Link
              href="/auth/login"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Signal Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Market Overview
          </h1>
        </div>

        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`animate-fade-in-up delay-${i + 1} rounded-xl border border-border bg-card p-4`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <stat.icon className={`h-4 w-4 ${stat.accent}`} />
              </div>
              <p className={`mt-2 font-mono text-2xl font-semibold font-data ${stat.accent}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="animate-fade-in-up delay-3">
            <SignalTable signals={signals} />
          </div>
          <div className="animate-fade-in-up delay-4">
            <PositionSummary positions={positions} />
          </div>
        </div>
      </div>
    </main>
  );
}
