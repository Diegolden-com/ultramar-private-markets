import { BrandName } from "@/components/brand-name";
import { AssetExplorer } from "@/components/asset-explorer";
import { JsonLd } from "@/components/json-ld";
import { ProductTabs } from "@/components/product-tabs";
import { deals, getDealListingMetrics } from "@/lib/deals";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const assetsPath = "/private-equities/assets";
const description =
  "Browse primary and secondary tokenized private-market assets with issuer context, eligibility boundaries, valuation data, and oracle-ready diligence.";

const assetFaqs = [
  {
    question: "What appears on the Ultramar Private Equities asset marketplace?",
    answer:
      "The marketplace organizes primary issuer rounds and eligible secondary-transfer opportunities with asset narrative, valuation context, minimum tickets, compliance score, and deeper diligence links.",
  },
  {
    question: "Are these private-market assets freely tradable?",
    answer:
      "No. Production participation requires investor eligibility checks, issuer documents, legal review, and transfer restrictions.",
  },
  {
    question: "How does issuer operating data support asset discovery?",
    answer:
      "The issuer oracle can connect operating data to solvency, liquidity, and data-recency context so assets are not evaluated only from static token metadata.",
  },
];

export const metadata = createSeoMetadata({
  title: "Private Equities Assets",
  description,
  path: assetsPath,
  image: seoImages.privateEquities,
  keywords: [
    "private equity assets",
    "RWA marketplace",
    "tokenized assets",
    "private-market asset marketplace",
    "issuer diligence",
  ],
});

export default function AssetsPage() {
  const featuredDeal = deals[0];
  const primaryCount = deals.filter((deal) => deal.type === "primary").length;
  const secondaryCount = deals.filter((deal) => deal.type === "secondary").length;
  const disclosedComplianceScores = deals.flatMap((deal) =>
    deal.complianceScore === undefined ? [] : [deal.complianceScore],
  );
  const complianceRange = disclosedComplianceScores.length
    ? `${Math.min(...disclosedComplianceScores)}-${Math.max(...disclosedComplianceScores)}`
    : "—";
  const featuredMetrics = getDealListingMetrics(featuredDeal).slice(0, 3);

  return (
    <>
      <JsonLd
        id="private-equities-assets-json-ld"
        data={[
          webPageJsonLd({
            path: assetsPath,
            name: "Ultramar Private Equities Assets",
            description,
          }),
          itemListJsonLd({
    path: assetsPath,
    name: "Ultramar Private Equities asset marketplace",
    description:
      "Primary and secondary tokenized private-market assets available through Ultramar Private Equities.",
            items: deals.map((deal) => ({
              name: `${deal.name} (${deal.ticker})`,
              url: `/private-equities/assets/${deal.ticker}`,
              description: deal.description,
            })),
          }),
          faqJsonLd(assetFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Assets", path: assetsPath },
          ]),
        ]}
      />

      <section className="card card-border relative overflow-hidden bg-surface p-5 sm:p-7 lg:p-8">
        <div className="hatch-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                <BrandName /> / Private Equities
              </p>
              <h1 className="mt-6 max-w-[18ch] break-words text-balance font-serif text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-[3.5rem]">
                Asset index for controlled private-market access.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                Filter assets and open their diligence view.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-px border border-border-muted bg-border-muted sm:grid-cols-3">
              <AssetIndexFact label="Assets" value={`${deals.length}`} />
              <AssetIndexFact
                label="Primary / Secondary"
                value={`${primaryCount} / ${secondaryCount}`}
              />
              <AssetIndexFact label="Compliance" value={complianceRange} />
            </div>
          </div>

          <aside className="card card-border grid overflow-hidden bg-surface-ink">
            <Link
              href={`/private-equities/assets/${featuredDeal.ticker}`}
              className="group relative min-h-[300px] overflow-hidden sm:min-h-[360px] lg:min-h-[420px]"
            >
              <Image
                src={featuredDeal.image}
                alt={featuredDeal.name}
                fill
                priority
                sizes="(min-width: 1024px) 47vw, 100vw"
                className="image-blackwork object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-surface-ink/45" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="border border-border-muted bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {featuredDeal.ticker}
                </span>
                <span className={`border bg-surface px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${featuredDeal.secondarySale ? "border-destructive text-destructive" : "border-status-signal text-status-signal"}`}>
                  {featuredDeal.secondarySale ? "Secondary review · Not live" : "Featured asset"}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-border-muted bg-surface-ink/90 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                      {featuredDeal.sector}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
                      {featuredDeal.name}
                    </h2>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-status-signal transition group-hover:translate-x-1" />
                </div>
                <div className="mt-5 grid grid-cols-3 border-t border-border-muted pt-5">
                  {featuredMetrics.map((metric) => (
                    <AssetHeroStat key={metric.label} {...metric} />
                  ))}
                </div>
              </div>
            </Link>
          </aside>
        </div>
      </section>

      <ProductTabs product="private-equities" active="assets" />

      <section className="card card-border bg-surface p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Available assets
            </p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">Browse assets</h2>
          </div>
          <Link
            href="/private-equities/deals"
            className="btn btn-ghost btn-sm group font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-status-signal"
          >
            Review deal terms
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <AssetExplorer />
      </section>

      <section className="alert alert-warning card card-border bg-surface p-5 text-on-surface-variant">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <ShieldCheck className="h-5 w-5 shrink-0 text-status-warning" />
          Participation requires eligibility, issuer documents, and transfer controls.
        </div>
      </section>
    </>
  );
}

function AssetIndexFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat min-w-0 bg-surface p-4 last:col-span-2 sm:last:col-span-1">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="stat-value mt-2 break-words font-mono text-base font-semibold leading-tight text-on-surface sm:text-lg">{value}</p>
    </div>
  );
}

function AssetHeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-border-muted pr-3 last:border-r-0">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 truncate font-mono text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}
