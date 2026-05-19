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
    <div className="grid gap-1 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="card card-border bg-surface p-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Issuer telemetry
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
          Issuer Solvency Oracle
        </h2>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          The oracle reads accounting data, computes solvency and liquidity ratios,
          and produces a signed proof that can be referenced by the asset workflow.
        </p>
        <button
          type="button"
          onClick={pingOracle}
          disabled={loading}
          className="btn btn-outline btn-success mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Syncing" : "Ping Oracle"}
        </button>
      </div>

      <div className="card card-border bg-surface p-6 text-on-surface">
        {data ? (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-border-muted pb-4">
              <span className="badge badge-outline font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                {data.source}
              </span>
              <span className="badge badge-outline font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                {new Date(data.metrics.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="py-8 text-center">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Solvency Ratio
              </p>
              <p className="mt-3 font-mono text-5xl font-semibold text-status-signal">
                {(data.metrics.solvencyRatio * 100).toFixed(1)}%
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">Solvent and liquid</p>
            </div>
            <div className="stats grid grid-cols-3 gap-1 border-y border-border-muted bg-border-muted text-center">
              <OracleMetric label="Assets" value={formatCompact(data.metrics.assets)} />
              <OracleMetric label="Liabilities" value={formatCompact(data.metrics.liabilities)} />
              <OracleMetric label="Equity" value={formatCompact(data.metrics.equity)} />
            </div>
            <div className="mt-5 border border-border-muted bg-surface-ink p-4 text-xs">
              <div className="mb-2 flex items-center gap-2 text-on-surface">
                <ShieldCheck className="h-4 w-4 text-status-signal" />
                Signed proof
              </div>
              <p className="truncate text-on-surface-variant">Signer: {data.proof.signer}</p>
              <p className="mt-1 truncate text-on-surface-variant">
                Signature: {data.proof.signature}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center text-center">
            <div>
              <ShieldCheck className="mx-auto h-12 w-12 text-on-surface-variant" />
              <p className="mt-4 text-sm text-on-surface-variant">
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
    <div className="stat bg-surface p-4">
      <p className="stat-title font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="stat-value mt-1 font-mono text-sm font-semibold text-on-surface">{value}</p>
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
