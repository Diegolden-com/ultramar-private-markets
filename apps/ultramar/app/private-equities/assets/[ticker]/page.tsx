import { JsonLd } from "@/components/json-ld";
import { ProductTabs } from "@/components/product-tabs";
import { deals, findDeal, formatCurrency, type Deal, type SecondarySale } from "@/lib/deals";
import { getLcxDataRoomCta } from "@/lib/data-room/server";
import type { DataRoomCtaState } from "@/lib/data-room/types";
import { breadcrumbJsonLd, createSeoMetadata, webPageJsonLd } from "@/lib/seo";
import { AlertTriangle, ArrowLeft, ArrowRight, FileLock2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const statusLabels = {
  preparing: "Preparing",
  active: "Active",
  closing_soon: "Closing soon",
  funded: "Funded",
} as const;

const diligenceSteps = [
  ["KYC Clearance", "complete"],
  ["NDA Execution", "complete"],
  ["Memo Review", "active"],
  ["Data Room Access", "pending"],
  ["Allocation Review", "idle"],
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
    title: deal.secondarySale ? `${deal.name} Secondary Transfer Review` : `${deal.name} Private Equity`,
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

  const isLcx = deal.ticker === "lcx";
  const dataRoomCta = isLcx ? await getLcxDataRoomCta() : null;

  if (deal.secondarySale) {
    return (
      <>
        <JsonLd
          id={`${deal.ticker.toLowerCase()}-asset-json-ld`}
          data={[
            webPageJsonLd({
              path: `/private-equities/assets/${deal.ticker}`,
              name: `${deal.name} secondary transfer review`,
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

        <ProductTabs product="private-equities" active="assets" />
        <SecondarySaleReview deal={deal} sale={deal.secondarySale} dataRoomCta={dataRoomCta} />
      </>
    );
  }

  const targetRaise = deal.capitalRaise?.targetRaise ?? deal.valuation ?? 0;
  const fundingProgress = deal.capitalRaise ? 60 : deal.equityForSale ?? 0;
  const committed = targetRaise * (fundingProgress / 100);
  const useOfFunds = getUseOfFunds(deal);
  const offeringTerms = getOfferingTerms(deal);

  return (
    <>
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

      <ProductTabs product="private-equities" active="assets" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
      <div className="flex min-w-0 flex-col gap-3 md:col-span-8 md:gap-4 lg:col-span-9">
        <nav aria-label="Asset navigation">
          <Link
            href="/private-equities/assets"
            className="btn btn-ghost btn-sm w-fit bg-surface-ink font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to assets
          </Link>
        </nav>

        <section className="card card-border bg-surface p-6 sm:p-7 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Asset
              </p>
              <h1 className="max-w-[16ch] text-balance font-serif text-4xl font-bold leading-[1.02] text-on-surface sm:text-5xl">
                {deal.name}
              </h1>
            </div>
            <div className="min-w-0 sm:text-right">
              <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Sector
              </p>
              <span className="badge badge-outline max-w-full break-words bg-surface-dim px-2 py-1 font-mono text-sm font-medium uppercase text-on-surface">
                {deal.sector}
              </span>
            </div>
          </div>

          <div className="border-t border-border-muted pt-6">
            <div className="mb-2 flex justify-between">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Funding status
              </span>
              <span className="font-mono text-sm font-medium text-status-signal">
                {fundingProgress}%
              </span>
            </div>
            <progress
              className="progress progress-success h-2 w-full bg-surface-dim"
              value={fundingProgress}
              max={100}
            />
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
                  Target raise
                </p>
                <p className="font-mono text-xl font-semibold text-on-surface">
                  {formatCurrency(targetRaise)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <article className="card card-border bg-surface p-6 text-lg leading-relaxed text-on-surface sm:p-8 lg:p-10">
          <h2 className="mb-4 font-serif text-2xl font-medium">Use of Funds</h2>
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
          <div className="mb-8 overflow-x-auto border border-border-muted">
            <table className="table table-sm min-w-full">
              <thead className="border-b border-border-muted bg-surface-dim">
                <tr>
                  <th className="p-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    Parameter
                  </th>
                  <th className="p-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    Specification
                  </th>
                </tr>
              </thead>
              <tbody>
                {offeringTerms.map(([label, value]) => (
                  <tr key={label} className="border-b border-border-muted last:border-b-0">
                    <th
                      scope="row"
                      className="p-3 font-mono text-sm font-medium uppercase text-on-surface"
                    >
                      {label}
                    </th>
                    <td className="p-3 font-mono text-sm font-medium uppercase text-on-surface">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              ]).slice(0, 1).map((risk) => (
                <li key={risk} className="border-l-2 border-border-muted pl-4">
                  {risk}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>

      <aside className="flex min-w-0 flex-col gap-3 md:col-span-4 md:gap-4 lg:col-span-3">
        <section className="card card-border bg-surface p-6">
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

        <section className="card card-border bg-surface p-6">
          <h2 className="mb-4 border-b border-border-muted pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Data Room Status
          </h2>
          {isLcx ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className={`h-4 w-4 border ${dataRoomCta?.status === "approved" ? "border-status-signal bg-status-signal" : dataRoomCta?.status === "revoked" ? "border-destructive bg-destructive" : "hatch-pattern border-primary"}`} />
                <span className={`font-mono text-sm font-medium uppercase ${dataRoomCta?.status === "approved" ? "text-status-signal" : dataRoomCta?.status === "revoked" ? "text-destructive" : "text-primary"}`}>
                  {dataRoomCta?.status === "approved" ? "Authorized" : dataRoomCta?.status === "pending" ? "Request pending" : dataRoomCta?.status === "revoked" ? "Access revoked" : "Restricted"}
                </span>
              </div>
              {dataRoomCta ? (
                <Link href={dataRoomCta.href} className="btn btn-primary w-full font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                  {dataRoomCta.label}
                </Link>
              ) : (
                <button className="btn btn-outline w-full" type="button" disabled>Data room unavailable</button>
              )}
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-4 w-4 border border-status-signal hatch-pattern-blue" />
                <span className="font-mono text-sm font-medium uppercase text-status-signal">
                  Pending Authorization
                </span>
              </div>
              <button className="btn btn-outline btn-success w-full font-mono text-[11px] font-medium uppercase tracking-[0.08em]" type="button">
                Request Unlock
              </button>
            </>
          )}
        </section>

        <section className="card card-border mt-auto bg-surface p-6">
          <button
            className={`btn w-full font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${isLcx ? "btn-primary" : "btn-success"}`}
            type="button"
          >
            Request Allocation Review
          </button>
          <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Status: {statusLabels[deal.status]} / {deal.location}
          </p>
        </section>
      </aside>
      </div>
    </>
  );
}

function SecondarySaleReview({
  deal,
  sale,
  dataRoomCta,
}: {
  deal: Deal;
  sale: SecondarySale;
  dataRoomCta: DataRoomCtaState | null;
}) {
  return (
    <section
      data-testid="lcx-secondary-sale-review"
      className="overflow-hidden border border-[#11130f] bg-[#f8f7f2] text-[#11130f]"
    >
      <header className="grid border-b border-[#11130f] lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.72fr)]">
        <div className="p-6 sm:p-9 lg:p-12">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">
            Private Equities / LCX / Potential secondary transfer
          </p>
          <h1 className="mt-10 max-w-[11ch] font-sans text-[clamp(3.15rem,7.5vw,7.25rem)] font-black uppercase leading-[0.83] tracking-[-0.075em] text-[#11130f]">
            Existing equity.
            <br />
            No new capital.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-7 text-[#11130f]/78 sm:text-lg sm:leading-8">
            {deal.description}
          </p>
        </div>

        <div className="flex min-h-64 flex-col justify-between bg-[#dfeee5] p-6 sm:p-9 lg:p-10">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">
              Transfer review
            </p>
            <p className="mt-5 font-sans text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-5xl">
              Buildout
            </p>
          </div>
          <div className="border-t border-[#11130f]/25 pt-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">No SPV</p>
            <p className="mt-2 text-sm leading-6 text-[#11130f]/76">{sale.status}</p>
          </div>
        </div>
      </header>

      <div className="border-b border-[#11130f] bg-[#e85140] px-6 py-5 sm:px-9 lg:px-12">
        <div className="flex max-w-5xl items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold leading-6 sm:text-base">
            NOT A LIVE OFFER. Ultramar is not accepting allocations, subscriptions, funds, or transfer instructions for LCX.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <main className="min-w-0 p-6 sm:p-9 lg:p-12">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">
            What is under review
          </p>
          <p className="mt-5 max-w-3xl font-serif text-3xl leading-[1.08] sm:text-4xl">
            {sale.summary}
          </p>

          <dl className="mt-10 divide-y divide-[#11130f]/25 border-y border-[#11130f]">
            <TransferDefinition label="Structure" value={sale.structure} />
            <TransferDefinition label="Equity pathway" value={sale.equityPathway} />
            <TransferDefinition label="Terms" value={sale.termsStatus} />
            <TransferDefinition label="Eligible review" value={sale.investorProfile} />
          </dl>

          <section className="mt-12">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">
              Diligence focus
            </p>
            <ol className="mt-5 divide-y divide-[#11130f]/25 border-t border-[#11130f]">
              {sale.diligenceFocus.map((item, index) => (
                <li key={item} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                  <span className="font-mono text-xs font-semibold text-[#11130f]/60">0{index + 1}</span>
                  <span className="max-w-2xl text-sm leading-6 sm:text-base">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12 border-t border-[#11130f] pt-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e85140]">
              Critical review risk
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 sm:text-base">{sale.risks[0]}</p>
          </section>
        </main>

        <aside className="flex min-w-0 flex-col bg-[#11130f] p-6 text-[#f8f7f2] sm:p-9 lg:p-10">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#dfeee5]">
              What must happen first
            </p>
            <h2 className="mt-5 max-w-[12ch] font-sans text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-5xl">
              Terms come last.
            </h2>
            <p className="mt-6 text-sm leading-6 text-[#f8f7f2]/72">{sale.diligenceStatus}</p>
          </div>

          <ol className="mt-10 divide-y divide-[#f8f7f2]/20 border-y border-[#f8f7f2]/25">
            {sale.transferProcess.map((step, index) => (
              <li key={step.label} className="py-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#dfeee5]">
                  0{index + 1} / {step.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#f8f7f2]/76">{step.body}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <section className="grid border-t border-[#11130f] bg-[#f8f7f2] lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.72fr)]">
        <div className="p-6 sm:p-9 lg:p-12">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">
            Before any transfer can be considered
          </p>
          <ul className="mt-5 grid gap-3 text-sm leading-6 sm:text-base">
            {sale.missingBeforeReview.map((item) => (
              <li key={item} className="border-l-2 border-[#e85140] pl-4">{item}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[#11130f] bg-[#dfeee5] p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
          <FileLock2 className="h-6 w-6" aria-hidden="true" />
          <p className="mt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">
            Controlled data room
          </p>
          <p className="mt-4 text-lg font-semibold leading-7">Ownership, operating, and legal evidence are released only after access is approved.</p>
          {dataRoomCta ? (
            <Link
              href={dataRoomCta.href}
              className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#11130f] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f8f7f2] transition hover:bg-[#2a2c28] focus-visible:outline-[#11130f]"
            >
              {dataRoomCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <p className="mt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">Data room unavailable</p>
          )}
        </div>
      </section>
    </section>
  );
}

function TransferDefinition({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#11130f]/65">{label}</dt>
      <dd className="max-w-2xl text-sm leading-6 sm:text-base">{value}</dd>
    </div>
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
      percent: deal.equityForSale === undefined ? "Not disclosed" : `${deal.equityForSale}%`,
      amount:
        deal.valuation === undefined || deal.equityForSale === undefined
          ? "Not disclosed"
          : formatCurrency(deal.valuation * (deal.equityForSale / 100)),
    },
    {
      label: "Minimum ticket",
      percent: "Entry",
      amount: formatCurrency(deal.minInvestment),
    },
    {
      label: "Target return",
      percent: deal.apy === undefined ? "Not disclosed" : `${deal.apy}%`,
      amount: deal.type === "primary" ? "Primary market" : "Secondary market",
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
    ["Target return", deal.apy === undefined ? "Not disclosed" : `${deal.apy}%`],
    ["Minimum ticket", formatCurrency(deal.minInvestment)],
    ["Market type", deal.type === "primary" ? "Primary" : "Secondary"],
  ];
}
