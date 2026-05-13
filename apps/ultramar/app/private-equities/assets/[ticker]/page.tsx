import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { findDeal, formatCurrency, deals } from "@/lib/deals";
import { breadcrumbJsonLd, createSeoMetadata, webPageJsonLd } from "@/lib/seo";
import {
  ArrowLeft,
  CheckCircle2,
  DatabaseZap,
  FileText,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <Link
            href="/private-equities/assets"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to assets
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
            <Image
              src={deal.image}
              alt={deal.name}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {deal.ticker} / {deal.sector}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {deal.name}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              {deal.description}
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Compliance Score
                </p>
                <p className="mt-2 font-mono text-4xl font-semibold text-accent">
                  {deal.complianceScore}
                </p>
              </div>
              <ShieldCheck className="h-10 w-10 text-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AssetMetric label="Valuation" value={formatCurrency(deal.valuation)} />
            <AssetMetric label="Target APY" value={`${deal.apy}%`} />
            <AssetMetric label="Equity" value={`${deal.equityForSale}%`} />
            <AssetMetric label="Minimum" value={formatCurrency(deal.minInvestment)} />
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <Globe2 className="h-4 w-4 text-accent" />
              Location
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{deal.location}</p>
          </div>
        </aside>
      </section>

      <section className="border-t border-border bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Offering context",
              body: "The asset profile consolidates valuation, minimum tickets, target yield, and issuer narrative.",
            },
            {
              icon: DatabaseZap,
              title: "Oracle bridge",
              body: "Issuer operating data can feed solvency and liquidity proofs used by the marketplace.",
            },
            {
              icon: CheckCircle2,
              title: "Controlled access",
              body: "Production securities workflows require KYC, suitability, legal wrapper, and transfer restrictions.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-5">
              <item.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductCrosslink current="private-equities" />
    </main>
  );
}

function AssetMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold">{value}</p>
    </div>
  );
}
