"use client";

import {
  CheckCircle2,
  DatabaseZap,
  FileCheck2,
  RefreshCw,
  Route,
  ShieldCheck,
  Timer,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-signal";

type ScenarioTone = "settled" | "reverted";

type Scenario = {
  id: string;
  label: string;
  state: string;
  tone: ScenarioTone;
  icon: typeof CheckCircle2;
  headline: string;
  guard: string;
  result: string;
  test: string;
  payment: string;
  output: string;
  fill: string;
  rows: Array<{
    label: string;
    value: string;
    status: "pass" | "fail" | "idle";
  }>;
};

const scenarios: Scenario[] = [
  {
    id: "approved",
    label: "Approved",
    state: "Settled",
    tone: "settled",
    icon: CheckCircle2,
    headline: "Window settles at the issuer price.",
    guard: "beforeSwap",
    result: "WindowConsumed + CapitalWindowHookSwap",
    test: "testPrimaryConversionWindowExecutesCustomAccountingSwap",
    payment: "1,500 USDC",
    output: "1,454.54 LCX",
    fill: "27% -> 29%",
    rows: [
      { label: "Passport", value: "0x4444 signed for window 1", status: "pass" },
      { label: "Oracle", value: "18 min proof inside max staleness", status: "pass" },
      { label: "Nonce", value: "fresh authorization", status: "pass" },
      { label: "Accounting", value: "exact input, minOut satisfied", status: "pass" },
    ],
  },
  {
    id: "missing-passport",
    label: "Missing passport",
    state: "Reverted",
    tone: "reverted",
    icon: XCircle,
    headline: "The hook rejects an empty travel document.",
    guard: "MissingPassport",
    result: "No registry consume, no swap event",
    test: "testMissingPassportHookDataReverts",
    payment: "1,500 USDC",
    output: "0 LCX",
    fill: "unchanged",
    rows: [
      { label: "Passport", value: "hookData absent", status: "fail" },
      { label: "Oracle", value: "not reached", status: "idle" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
  {
    id: "replay",
    label: "Replay",
    state: "Reverted",
    tone: "reverted",
    icon: RefreshCw,
    headline: "The second attempt cannot reuse the stamp.",
    guard: "authorizationUsed",
    result: "Consumed nonce blocks settlement",
    test: "testAuthorizationReplayReverts",
    payment: "1,500 USDC",
    output: "0 LCX",
    fill: "unchanged",
    rows: [
      { label: "Passport", value: "signature matches wallet", status: "pass" },
      { label: "Oracle", value: "fresh proof", status: "pass" },
      { label: "Nonce", value: "already marked used", status: "fail" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
  {
    id: "stale-oracle",
    label: "Stale oracle",
    state: "Reverted",
    tone: "reverted",
    icon: Timer,
    headline: "A stale issuer proof cannot price the window.",
    guard: "StaleOracle",
    result: "Registry consumption is blocked",
    test: "testStaleOracleReverts",
    payment: "1,500 USDC",
    output: "0 LCX",
    fill: "unchanged",
    rows: [
      { label: "Passport", value: "0x4444 signed for window 1", status: "pass" },
      { label: "Oracle", value: "proof exceeds staleness limit", status: "fail" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
  {
    id: "generic-router",
    label: "Generic router",
    state: "Reverted",
    tone: "reverted",
    icon: Route,
    headline: "A valid stamp cannot ride the wrong route.",
    guard: "InvalidAuthorization",
    result: "Router-bound signature rejects bypass",
    test: "testGenericRouterWithCapitalPassportReverts",
    payment: "1,000 USDC",
    output: "0 LCX",
    fill: "unchanged",
    rows: [
      { label: "Passport", value: "signed for CapitalWindowRouter", status: "pass" },
      { label: "Route", value: "sender is generic PoolSwapTest", status: "fail" },
      { label: "Nonce", value: "not consumed", status: "idle" },
      { label: "Accounting", value: "delta never returned", status: "idle" },
    ],
  },
];

export function HookathonScenarioSimulator() {
  const [selectedId, setSelectedId] = useState(scenarios[0].id);
  const scenario = useMemo(
    () => scenarios.find((item) => item.id === selectedId) ?? scenarios[0],
    [selectedId],
  );
  const ScenarioIcon = scenario.icon;

  return (
    <section className="grid min-w-0 gap-1 border-b border-border-muted bg-border-muted xl:grid-cols-[0.78fr_1.22fr]">
      <div className="min-w-0 bg-surface p-5 md:p-8">
        <DatabaseZap className="h-5 w-5 text-status-signal" aria-hidden="true" />
        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Scenario simulator
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-5xl">
          One hook, five judge-visible outcomes.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant">
          The demo toggles the same capital window through the core states asserted by the Solidity
          suite: approved settlement, missing passport, nonce replay, stale issuer proof, and generic
          router bypass rejection.
        </p>
        <div className="mt-8 grid gap-1 bg-border-muted sm:grid-cols-3">
          <SimulatorStat label="Guard" value={scenario.guard} />
          <SimulatorStat label="State" value={scenario.state} tone={scenario.tone} />
          <SimulatorStat label="Fill" value={scenario.fill} />
        </div>
      </div>

      <div className="min-w-0 bg-surface-paper p-5 text-surface-ink md:p-8">
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {scenarios.map((item) => {
            const Icon = item.icon;
            const active = item.id === scenario.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(item.id)}
                className={`min-h-24 min-w-0 border p-3 text-left transition ${
                  active
                    ? "border-surface-ink bg-surface-ink text-on-surface"
                    : "border-surface-container/30 bg-surface-container/10 text-surface-container hover:border-surface-ink/60 hover:bg-surface-container/20"
                } ${focusVisibleClass}`}
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      item.tone === "settled" ? "text-status-signal" : "text-destructive"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em]">
                    {item.state}
                  </span>
                </div>
                <span className="mt-4 block break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid min-w-0 gap-1 bg-surface-container/20 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 bg-surface-paper p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center border ${
                  scenario.tone === "settled"
                    ? "border-status-signal/50 bg-status-signal/10"
                    : "border-destructive/50 bg-destructive/10"
                }`}
              >
                <ScenarioIcon
                  className={`h-5 w-5 ${
                    scenario.tone === "settled" ? "text-status-signal" : "text-destructive"
                  }`}
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
                  {scenario.state}
                </p>
                <h3 className="mt-1 break-words font-serif text-3xl font-semibold leading-tight text-surface-ink">
                  {scenario.headline}
                </h3>
              </div>
            </div>

            <div className="mt-8 grid gap-1 bg-surface-container/20">
              <PaperSignal label="Exact input" value={scenario.payment} />
              <PaperSignal label="Custom delta output" value={scenario.output} />
              <PaperSignal label="Emitted result" value={scenario.result} />
            </div>

            <div className="mt-6 border-t border-surface-container/25 pt-4">
              <div className="flex min-w-0 items-start gap-3">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="min-w-0 break-words font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container [overflow-wrap:anywhere]">
                  {scenario.test}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 bg-surface-ink p-5 text-on-surface">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Hook checkpoints
              </p>
              <ShieldCheck className="h-4 w-4 text-status-signal" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-1 bg-border-muted">
              {scenario.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid min-w-0 gap-3 bg-surface-ink p-4 sm:grid-cols-[128px_28px_1fr]"
                >
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                    {row.label}
                  </p>
                  <StatusGlyph status={row.status} />
                  <p className="text-sm leading-5 text-on-surface-variant">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SimulatorStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: ScenarioTone;
}) {
  return (
    <div className="min-w-0 bg-surface-ink p-4">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p
        className={`mt-2 break-words font-mono text-sm font-semibold uppercase tracking-[0.08em] ${
          tone === "reverted" ? "text-destructive" : "text-on-surface"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PaperSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-surface-container/20 py-3 first:border-t-0 sm:grid-cols-[144px_1fr]">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-container">
        {label}
      </p>
      <p className="break-words text-sm font-medium leading-5 text-surface-ink">{value}</p>
    </div>
  );
}

function StatusGlyph({ status }: { status: "pass" | "fail" | "idle" }) {
  if (status === "pass") {
    return <CheckCircle2 className="h-4 w-4 text-status-signal" aria-label="Pass" />;
  }

  if (status === "fail") {
    return <XCircle className="h-4 w-4 text-destructive" aria-label="Fail" />;
  }

  return <span className="mt-1 h-2 w-2 bg-surface-container/50" aria-label="Not reached" />;
}
