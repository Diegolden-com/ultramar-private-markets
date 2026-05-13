import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { findDeal, formatCurrency, deals, type CapitalRaise, type DataRoomItem } from "@/lib/deals";
import { breadcrumbJsonLd, createSeoMetadata, webPageJsonLd } from "@/lib/seo";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  CircleDashed,
  DatabaseZap,
  FileCheck2,
  FileClock,
  FileText,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Target,
  type LucideIcon,
  WalletCards,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusLabels = {
  active: "Active",
  closing_soon: "Closing soon",
  funded: "Funded",
} as const;

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

  const statusLabel = statusLabels[deal.status];
  const marketRail = deal.type === "primary" ? "Primary" : "Secondary";
  const assetMetrics = [
    {
      label: "Valuation",
      value: formatCurrency(deal.valuation),
      detail: "Issuer valuation frame",
    },
    {
      label: "Minimum",
      value: formatCurrency(deal.minInvestment),
      detail: "Entry ticket shown before eligibility review",
    },
    {
      label: "Target return",
      value: `${deal.apy}%`,
      detail: "Illustrative target from the asset profile, subject to final documents",
    },
    {
      label: "Equity for sale",
      value: `${deal.equityForSale}%`,
      detail: "Available allocation in the current rail",
    },
    {
      label: "Compliance",
      value: `${deal.complianceScore}`,
      detail: "Internal review score displayed on the asset route",
    },
    {
      label: "Market rail",
      value: marketRail,
      detail: "Primary issuer round or eligible secondary transfer",
    },
  ];

  return (
    <main>
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

      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="blackwork-hatch absolute inset-0 opacity-[0.08]" />
        <div className="financial-grid absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-4 pt-5 sm:px-6">
          <Link
            href="/private-equities/assets"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-background/55 transition hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to assets
          </Link>
        </div>

        <div className="relative mx-auto grid min-h-[70vh] max-w-7xl gap-0 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="flex flex-col justify-between border-x border-background/15 px-5 py-8 sm:px-8 lg:py-12 lg:pr-12">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-background/60">
                {deal.ticker} / {deal.sector}
              </p>
              <h1 className="mt-8 max-w-4xl break-words font-serif text-4xl font-bold leading-[0.9] [overflow-wrap:anywhere] sm:text-7xl lg:text-8xl">
                {deal.name}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-background/75">
                {deal.description}
              </p>
            </div>

            <div className="mt-12 grid gap-px bg-background/20 sm:grid-cols-3">
              <AssetHeroFact label="Status" value={statusLabel} />
              <AssetHeroFact label="Market rail" value={marketRail} />
              <AssetHeroFact label="Location" value={deal.location} />
            </div>
          </div>

          <aside className="grid border-x border-b border-background/15 lg:border-l-0 lg:border-y">
            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[460px]">
              <Image
                src={deal.image}
                alt={deal.name}
                fill
                priority
                sizes="(min-width: 1024px) 47vw, 100vw"
                className="image-blackwork object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-foreground/40" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  {deal.ticker}
                </span>
                <span className="border border-background/50 bg-foreground/55 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                  {marketRail}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-background/20 bg-foreground/80 backdrop-blur-sm">
                <AssetImageStat label="Valuation" value={formatCurrency(deal.valuation)} />
                <AssetImageStat label="Target" value={`${deal.apy}%`} />
                <AssetImageStat label="Score" value={`${deal.complianceScore}`} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Asset memo
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none sm:text-6xl">
              Terms, context, and controls on one page.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
              The public profile keeps the asset narrative next to the same
              valuation, minimum, yield, equity, and compliance fields used by
              the index.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {deal.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2">
            {assetMetrics.map((metric) => (
              <AssetMetric key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </section>

      {deal.capitalRaise ? (
        <CapitalRaiseMemo dealName={deal.name} raise={deal.capitalRaise} />
      ) : null}

      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-px bg-background/20 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              label: "01",
              title: "Offering context",
              body: "The asset profile consolidates valuation, minimum tickets, target yield, issuer narrative, and route state.",
            },
            {
              icon: DatabaseZap,
              label: "02",
              title: "Oracle bridge",
              body: "Issuer operating data can feed solvency and liquidity proofs used by marketplace and portfolio surfaces.",
            },
            {
              icon: CheckCircle2,
              label: "03",
              title: "Controlled access",
              body: "Production securities workflows require KYC, suitability, legal wrapper, and transfer restrictions.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-foreground p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-background/50">
                  {item.label}
                </p>
                <item.icon className="h-5 w-5 text-background" />
              </div>
              <h2 className="mt-10 font-serif text-3xl font-bold leading-tight">{item.title}</h2>
              <p className="mt-4 text-sm leading-6 text-background/65">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Issuer frame
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none sm:text-6xl">
              Visible boundaries before allocation.
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {[
              { icon: Globe2, label: "Location", value: deal.location },
              { icon: ShieldCheck, label: "Status", value: statusLabel },
              { icon: FileText, label: "Tags", value: deal.tags.join(" / ") },
            ].map((item) => (
              <div key={item.label} className="bg-background p-5">
                <item.icon className="h-5 w-5 text-accent" />
                <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductCrosslink current="private-equities" />
    </main>
  );
}

function AssetHeroFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-foreground p-4">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">
        {label}
      </p>
      <p className="mt-2 break-words font-mono text-sm font-semibold text-background">{value}</p>
    </div>
  );
}

function AssetImageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-background/20 p-4 last:border-r-0">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">
        {label}
      </p>
      <p className="mt-2 truncate font-mono text-lg font-semibold text-background">{value}</p>
    </div>
  );
}

function AssetMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="bg-background p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 break-words font-mono text-2xl font-semibold">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

function CapitalRaiseMemo({ dealName, raise }: { dealName: string; raise: CapitalRaise }) {
  const raiseFacts = [
    {
      icon: BadgeDollarSign,
      label: "Target raise",
      value: formatCurrency(raise.targetRaise),
    },
    {
      icon: FileClock,
      label: "Closing window",
      value: raise.closingWindow,
    },
    {
      icon: FileCheck2,
      label: "Instrument",
      value: raise.instrument,
    },
    {
      icon: WalletCards,
      label: "Investor profile",
      value: raise.investorProfile,
    },
  ];

  return (
    <>
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Capital raise memo
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none sm:text-6xl">
              {raise.roundTitle}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
              {raise.summary}
            </p>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2">
            {raiseFacts.map((fact) => (
              <RaiseFact key={fact.label} {...fact} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  Use of funds
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">
                  Capital deployment by line item.
                </h3>
              </div>
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div className="grid gap-px bg-border">
              {raise.useOfFunds.map((item) => (
                <div key={item.label} className="bg-background p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                    <p className="font-mono text-lg font-semibold">{item.percent}%</p>
                  </div>
                  <div className="mt-4 h-1 bg-muted">
                    <div className="h-full bg-accent" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  Closing path
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">
                  Milestones before capital can move.
                </h3>
              </div>
              <CircleDashed className="h-5 w-5 text-accent" />
            </div>
            <div className="grid gap-px bg-border">
              {raise.milestones.map((item) => (
                <div key={item.label} className="grid gap-4 bg-background p-5 sm:grid-cols-[88px_1fr]">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.timing}
                  </p>
                  <div>
                    <h4 className="font-serif text-2xl font-bold leading-tight">{item.label}</h4>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-background/50">
              Data room
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none sm:text-6xl">
              {dealName} is not subscription-ready until these controls clear.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-background/65">
              {raise.diligenceStatus}. The public page can explain the round;
              private access still depends on documents, eligibility, and legal
              approval.
            </p>
          </div>
          <div className="grid gap-px bg-background/20 sm:grid-cols-2">
            {raise.dataRoom.map((item) => (
              <DataRoomItemCard key={item.label} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Investor process
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none sm:text-6xl">
              Public interest becomes private diligence.
            </h2>
          </div>
          <div className="grid gap-px bg-border">
            {raise.investorProcess.map((item, index) => (
              <div key={item.label} className="grid gap-5 bg-background p-5 sm:grid-cols-[88px_1fr]">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-serif text-2xl font-bold leading-tight">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <RiskList
            eyebrow="Risk factors"
            title="Risks that stay visible."
            icon={AlertTriangle}
            items={raise.risks}
          />
          <RiskList
            eyebrow="Before close"
            title="Missing before commitments."
            icon={LockKeyhole}
            items={raise.missingBeforeClose}
          />
        </div>
      </section>
    </>
  );
}

function RaiseFact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background p-5">
      <Icon className="h-5 w-5 text-accent" />
      <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold leading-6">{value}</p>
    </div>
  );
}

const dataRoomStatus = {
  ready: { label: "Ready", icon: CheckCircle2 },
  in_review: { label: "In review", icon: CircleDashed },
  missing: { label: "Missing", icon: AlertTriangle },
  gated: { label: "Gated", icon: LockKeyhole },
} as const;

function DataRoomItemCard({ item }: { item: DataRoomItem }) {
  const status = dataRoomStatus[item.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-foreground p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-background/50">
          {status.label}
        </p>
        <StatusIcon className="h-5 w-5 text-background" />
      </div>
      <h3 className="mt-8 font-serif text-2xl font-bold leading-tight">{item.label}</h3>
      <p className="mt-3 text-sm leading-6 text-background/65">{item.body}</p>
    </div>
  );
}

function RiskList({
  eyebrow,
  title,
  icon: Icon,
  items,
}: {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">{title}</h2>
        </div>
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div className="grid gap-px bg-border">
        {items.map((item) => (
          <p key={item} className="bg-background p-5 text-sm leading-6 text-muted-foreground">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
