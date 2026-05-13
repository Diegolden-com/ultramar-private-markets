"use client";

import { RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

type OracleResponse = {
  source: string;
  metrics: {
    assets: number;
    liabilities: number;
    equity: number;
    solvencyRatio: number;
    liquidityRatio: number;
    timestamp: number;
  };
  proof: {
    signer: string;
    signature: string;
  };
};

export function OracleConsole() {
  const [data, setData] = useState<OracleResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function pingOracle() {
    setLoading(true);
    try {
      const response = await fetch("/api/private-equities/oracle/score");
      const json = (await response.json()) as OracleResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Issuer Solvency Oracle</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The oracle reads accounting data, computes solvency and liquidity ratios,
          and produces a signed proof that can be referenced by the asset workflow.
        </p>
        <button
          type="button"
          onClick={pingOracle}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Syncing" : "Ping Oracle"}
        </button>
      </div>

      <div className="rounded-lg border border-foreground bg-foreground p-6 text-background">
        {data ? (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-background/15 pb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-background/60">
                {data.source}
              </span>
              <span className="text-xs text-background/60">
                {new Date(data.metrics.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-background/60">
                Solvency Ratio
              </p>
              <p className="mt-3 font-mono text-5xl font-semibold text-emerald-300">
                {(data.metrics.solvencyRatio * 100).toFixed(1)}%
              </p>
              <p className="mt-2 text-sm text-background/70">Solvent and liquid</p>
            </div>
            <div className="grid grid-cols-3 gap-3 border-y border-background/15 py-4 text-center">
              <OracleMetric label="Assets" value={formatCompact(data.metrics.assets)} />
              <OracleMetric label="Liabilities" value={formatCompact(data.metrics.liabilities)} />
              <OracleMetric label="Equity" value={formatCompact(data.metrics.equity)} />
            </div>
            <div className="mt-5 rounded-md border border-background/15 p-4 text-xs">
              <div className="mb-2 flex items-center gap-2 text-background/80">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Signed proof
              </div>
              <p className="truncate text-background/60">Signer: {data.proof.signer}</p>
              <p className="mt-1 truncate text-background/60">
                Signature: {data.proof.signature}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center text-center">
            <div>
              <ShieldCheck className="mx-auto h-12 w-12 text-background/35" />
              <p className="mt-4 text-sm text-background/60">
                Awaiting oracle sync from the issuer data layer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OracleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-background/50">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(value);
}
