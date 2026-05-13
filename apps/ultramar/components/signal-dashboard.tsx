import {
  averageAbsoluteSpread,
  samplePositions,
  sampleSignals,
  totalExposure,
  type Position,
  type Signal,
} from "@/lib/arbitrage";
import { Activity, BarChart3, Shield, Wallet } from "lucide-react";
import { MetricCard } from "./metric-card";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchBackend<T>(path: string, fallback: T): Promise<T> {
  if (!baseUrl) return fallback;

  try {
    const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const data = (await response.json()) as T;
    return Array.isArray(data) && data.length === 0 ? fallback : data;
  } catch {
    return fallback;
  }
}

export async function SignalDashboard() {
  const [signals, positions] = await Promise.all([
    fetchBackend<Signal[]>("/signals", sampleSignals),
    fetchBackend<Position[]>("/positions", samplePositions),
  ]);

  const exposure = totalExposure(positions);
  const avgSpread = averageAbsoluteSpread(signals);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Signals"
          value={signals.length.toString()}
          detail="Active or monitored dislocations"
          icon={Activity}
        />
        <MetricCard
          label="Avg spread"
          value={avgSpread.toFixed(3)}
          detail="Absolute probability spread"
          icon={BarChart3}
        />
        <MetricCard
          label="Exposure"
          value={`$${exposure.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          detail="Current notional sizing"
          icon={Wallet}
        />
        <MetricCard
          label="Guardrails"
          value="Live"
          detail="Sizing and concentration checks"
          icon={Shield}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-semibold">Signal Board</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Polymarket prices normalized against derivatives-implied probabilities.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Market</th>
                  <th className="px-5 py-4 font-semibold">Implied</th>
                  <th className="px-5 py-4 font-semibold">Model</th>
                  <th className="px-5 py-4 font-semibold">Spread</th>
                  <th className="px-5 py-4 font-semibold">Confidence</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr key={signal.id} className="border-b border-border/70 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium">{signal.market}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {signal.venue} / {signal.updatedAt}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-mono">{formatProb(signal.impliedProb)}</td>
                    <td className="px-5 py-4 font-mono">
                      {formatProb(signal.theoreticalProb)}
                    </td>
                    <td
                      className={`px-5 py-4 font-mono ${
                        signal.spread > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {signal.spread > 0 ? "+" : ""}
                      {signal.spread.toFixed(3)}
                    </td>
                    <td className="px-5 py-4">{signal.confidence}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">
                        {signal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Position Summary</h2>
          <div className="mt-5 space-y-4">
            {positions.map((position) => (
              <div key={position.id} className="rounded-md border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{position.market}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{position.venue}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold">
                    ${(position.size * position.avgPrice).toLocaleString("en-US")}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Hedge: {position.hedge}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatProb(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
