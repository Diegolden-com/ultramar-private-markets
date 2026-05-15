import { JsonLd } from "@/components/json-ld";
import { deals, findDeal, formatCurrency } from "@/lib/deals";
import { breadcrumbJsonLd, createSeoMetadata, webPageJsonLd } from "@/lib/seo";
import { AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusLabels = {
  active: "Active",
  closing_soon: "Closing soon",
  funded: "Funded",
} as const;

const diligenceSteps = [
  ["KYC Clearance", "complete"],
  ["NDA Execution", "complete"],
  ["Memo Review", "active"],
  ["Data Room Access", "pending"],
  ["Capital Call", "idle"],
] as const;

export function generateStaticParams() {
  return deals.map((deal) => ({ ticker: deal.ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const deal = findDeal(ticker);
  if (!deal) return {};

  return createSeoMetadata({
    title: `${deal.name} Private Equity`,
    description: deal.description,
    path: `/private-equities/assets/${deal.ticker}`,
    image: {
      url: deal.image,
      width: 1200,
      height: 630,
      alt: `${deal.name} private-market asset`,
    },
    keywords: [deal.name, deal.ticker, deal.sector, "private equity asset"],
  });
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const deal = findDeal(ticker);
  if (!deal) notFound();

  const targetRaise = deal.capitalRaise?.targetRaise ?? deal.valuation;
  const fundingProgress = deal.capitalRaise ? 60 : deal.equityForSale;
  const committed = targetRaise * (fundingProgress / 100);
  const useOfFunds = getUseOfFunds(deal);
  const offeringTerms = getOfferingTerms(deal);

  return (
    <main className="grid grid-cols-1 gap-1 bg-border-muted px-4 py-8 text-on-surface md:grid-cols-12 md:px-12">
      <JsonLd
        id={`${deal.ticker.toLowerCase()}-asset-json-ld`}
        data={[
          webPageJsonLd({
            path: `/private-equities/assets/${deal.ticker}`,
            name: `${deal.name} Private Equity`,
            description: deal.description,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Assets", path: "/private-equities/assets" },
            { name: deal.name, path: `/private-equities/assets/${deal.ticker}` },
          ]),
        ]}
      />

      <div className="flex flex-col gap-1 bg-surface-ink md:col-span-8 lg:col-span-9">
        <Link
          href="/private-equities/assets"
          className="inline-flex w-fit items-center gap-2 bg-surface-ink py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assets
        </Link>

        <section className="border border-border-muted bg-surface p-6 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Asset Identifier
              </p>
              <h1 className="font-serif text-4xl font-bold leading-[1.1] text-on-surface md:text-5xl">
                {deal.name}
              </h1>
            </div>
            <div className="text-right">
              <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Classification
              </p>
              <span className="border border-border-muted bg-surface-dim px-2 py-1 font-mono text-sm font-medium uppercase text-on-surface">
                {deal.sector}
              </span>
            </div>
          </div>

          <div className="border-t border-border-muted pt-6">
            <div className="mb-2 flex justify-between">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Funding Progress
              </span>
              <span className="font-mono text-sm font-medium text-status-signal">
                {fundingProgress}%
              </span>
            </div>
            <div className="relative h-2 w-full border border-border-muted bg-surface-dim">
              <div
                className="absolute left-0 top-0 h-full bg-status-signal"
                style={{ width: `${fundingProgress}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              <div>
                <p className="block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  Committed
                </p>
                <p className="font-mono text-xl font-semibold text-on-surface">
                  {formatCurrency(committed)}
                </p>
              </div>
              <div className="text-right">
                <p className="block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  Target Raise
                </p>
                <p className="font-mono text-xl font-semibold text-on-surface">
                  {formatCurrency(targetRaise)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <article className="border border-border-muted bg-surface p-6 text-lg leading-relaxed text-on-surface md:p-12">
          <h2 className="mb-6 border-b border-border-muted pb-2 font-serif text-3xl font-semibold leading-tight">
            Executive Summary
          </h2>
          <p className="mb-8 text-on-surface-variant">{deal.description}</p>

          <h3 className="mb-4 mt-8 font-serif text-2xl font-medium">Use of Funds</h3>
          <div className="mb-8 grid grid-cols-1 gap-1 border border-border-muted bg-border-muted md:grid-cols-3">
            {useOfFunds.map(({ label, percent, amount }) => (
              <div key={label} className="bg-surface p-4">
                <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {label}
                </p>
                <p className="mb-1 block font-mono text-xl font-semibold text-on-surface">{percent}</p>
                <p className="font-mono text-sm font-medium text-on-surface-variant">{amount}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-8 font-serif text-2xl font-medium">Offering Terms</h3>
          <div className="mb-8 border border-border-muted">
            <div className="grid grid-cols-2 border-b border-border-muted bg-surface-dim">
              <div className="p-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Parameter
              </div>
              <div className="p-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Specification
              </div>
            </div>
            {offeringTerms.map(([label, value], index) => (
              <div
                key={label}
                className={`grid grid-cols-2 ${index === offeringTerms.length - 1 ? "" : "border-b border-border-muted"}`}
              >
                <div className="p-3 font-mono text-sm font-medium uppercase text-on-surface">{label}</div>
                <div className="p-3 font-mono text-sm font-medium uppercase text-on-surface">{value}</div>
              </div>
            ))}
          </div>

          <section className="border border-border-muted border-t-status-signal bg-surface-dim p-6">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              <AlertTriangle className="h-4 w-4" />
              Critical Risk Factors
            </h3>
            <ul className="space-y-4 text-sm leading-normal text-on-surface-variant">
              {(deal.capitalRaise?.risks ?? [
                "Operational integration risk during facility transition and automation deployment.",
                "FX exposure from localized revenue streams against USD reporting standards.",
                "Supply-chain disruption could impact CapEx deployment timelines.",
              ]).slice(0, 3).map((risk) => (
                <li key={risk} className="border-l-2 border-border-muted pl-4">
                  {risk}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>

      <aside className="flex flex-col gap-1 bg-surface-ink md:col-span-4 lg:col-span-3">
        <section className="border border-border-muted bg-surface p-6">
          <h2 className="mb-4 border-b border-border-muted pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Diligence Path
          </h2>
          <div className="space-y-3 font-mono text-sm font-medium uppercase text-on-surface">
            {diligenceSteps.map(([label, state]) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 border ${
                    state === "active"
                      ? "border-status-signal bg-status-signal"
                      : state === "pending"
                        ? "hatch-pattern-blue border-border-muted"
                        : state === "complete"
                          ? "border-border-muted bg-surface-dim"
                          : "border-border-muted bg-transparent"
                  }`}
                />
                <span
                  className={
                    state === "complete"
                      ? "text-on-surface-variant line-through opacity-50"
                      : state === "pending"
                        ? "text-status-signal"
                        : "text-on-surface"
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border-muted bg-surface p-6">
          <h2 className="mb-4 border-b border-border-muted pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Data Room Status
          </h2>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-4 w-4 border border-status-signal hatch-pattern-blue" />
            <span className="font-mono text-sm font-medium uppercase text-status-signal">
              Pending Authorization
            </span>
          </div>
          <button
            className="w-full border border-border-muted bg-surface-ink py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant transition-colors hover:border-status-signal hover:text-status-signal"
            type="button"
          >
            Request Unlock
          </button>
        </section>

        <section className="hatch-pattern flex flex-1 flex-col border border-border-muted bg-surface p-6">
          <h2 className="mb-4 border-b border-border-muted pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Oracle Bridge
          </h2>
          <div className="flex h-32 flex-col items-center justify-center opacity-50">
            <Lock className="mb-2 h-8 w-8" />
            <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
              Telemetry locked
              <br />
              Awaiting clearance
            </p>
          </div>
        </section>

        <section className="mt-auto border border-border-muted bg-surface p-6">
          <button
            className="w-full border border-surface-paper bg-surface-ink py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-paper transition-colors hover:border-status-signal hover:bg-status-signal"
            type="button"
          >
            Initiate Allocation
          </button>
          <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Status: {statusLabels[deal.status]} / {deal.location}
          </p>
        </section>
      </aside>
    </main>
  );
}

function getUseOfFunds(deal: NonNullable<ReturnType<typeof findDeal>>) {
  if (deal.capitalRaise) {
    return deal.capitalRaise.useOfFunds.map((item) => ({
      label: item.label,
      percent: `${item.percent}%`,
      amount: formatCurrency((deal.capitalRaise?.targetRaise ?? 0) * (item.percent / 100)),
    }));
  }

  return [
    {
      label: "Available allocation",
      percent: `${deal.equityForSale}%`,
      amount: formatCurrency(deal.valuation * (deal.equityForSale / 100)),
    },
    {
      label: "Minimum ticket",
      percent: "Entry",
      amount: formatCurrency(deal.minInvestment),
    },
    {
      label: "Target return",
      percent: `${deal.apy}%`,
      amount: deal.type === "primary" ? "Primary rail" : "Secondary rail",
    },
  ];
}

function getOfferingTerms(deal: NonNullable<ReturnType<typeof findDeal>>) {
  if (deal.capitalRaise) {
    return [
      ["Instrument", deal.capitalRaise.instrument],
      ["Target raise", formatCurrency(deal.capitalRaise.targetRaise)],
      ["Closing window", deal.capitalRaise.closingWindow],
      ["Investor profile", deal.capitalRaise.investorProfile],
    ];
  }

  return [
    ["Instrument", deal.type === "primary" ? "Primary private-market allocation" : "Eligible secondary transfer"],
    ["Target return", `${deal.apy}%`],
    ["Minimum ticket", formatCurrency(deal.minInvestment)],
    ["Market rail", deal.type === "primary" ? "Primary" : "Secondary"],
  ];
}
