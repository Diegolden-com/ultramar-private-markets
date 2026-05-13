import { AssetExplorer } from "@/components/asset-explorer";
import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { deals, formatCurrency } from "@/lib/deals";
import { researchArticles } from "@/lib/research";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { ArrowRight, DatabaseZap, FileText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const assetsPath = "/private-equities/assets";
const description =
  "Browse primary and secondary tokenized private-market assets with issuer context, eligibility boundaries, valuation data, and oracle-ready diligence.";

const assetFaqs = [
  {
    question: "What appears on the Ultramar Private Equities asset marketplace?",
    answer:
      "The marketplace organizes primary issuer rounds and eligible secondary-transfer opportunities with asset narrative, valuation context, minimum tickets, compliance score, and route-level links into detail pages.",
  },
  {
    question: "Are these private-market assets freely tradable?",
    answer:
      "No. The public asset page is a product and research surface. Production participation requires investor eligibility checks, issuer documents, legal review, and transfer restrictions.",
  },
  {
    question: "How does issuer operating data support asset discovery?",
    answer:
      "The issuer oracle can connect operating data to solvency, liquidity, and data-recency context so asset pages are not limited to static token metadata.",
  },
];

const marketplaceContext = [
  {
    icon: FileText,
    title: "Asset diligence",
    body: "Each listing points investors toward issuer narrative, valuation frame, minimum ticket, sector, location, and offering status before deeper review.",
  },
  {
    icon: DatabaseZap,
    title: "Oracle-ready context",
    body: "The asset rail is designed to absorb issuer operating data, so visibility can mature from profile metadata into investor-facing proofs.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled access",
    body: "The marketplace is not positioned as an unrestricted exchange; production flows depend on eligibility, legal wrappers, and transfer controls.",
  },
];

const relatedResearch = researchArticles.filter((article) =>
  ["tokenized-private-equity-primer", "issuer-oracle-operating-data"].includes(article.slug),
);

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
  const complianceRange = `${Math.min(...deals.map((deal) => deal.complianceScore))}-${Math.max(
    ...deals.map((deal) => deal.complianceScore),
  )}`;

  return (
    <main>
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
              "Primary and secondary tokenized private-market assets available in the Ultramar.capital private-equities workflow.",
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

      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="blackwork-hatch absolute inset-0 opacity-[0.08]" />
        <div className="financial-grid absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto grid min-h-[68vh] max-w-7xl gap-0 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-between border-x border-background/15 px-5 py-8 sm:px-8 lg:py-12 lg:pr-12">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-background/60">
                Ultramar.capital / Private Equities
              </p>
              <h1 className="mt-8 max-w-4xl break-words font-serif text-4xl font-bold leading-[0.9] [overflow-wrap:anywhere] sm:text-7xl lg:text-8xl">
                Asset index for controlled private-market access.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-background/75">
                A spare browsing surface for issuer rounds, secondary transfer
                paths, and asset-level operating context. The marketplace stays
                quiet so the diligence can stay visible.
              </p>
            </div>

            <div className="mt-12 grid gap-px bg-background/20 sm:grid-cols-3">
              <AssetIndexFact label="Assets" value={`${deals.length}`} />
              <AssetIndexFact
                label="Primary / Secondary"
                value={`${primaryCount} / ${secondaryCount}`}
              />
              <AssetIndexFact label="Compliance" value={complianceRange} />
            </div>
          </div>

          <aside className="grid border-x border-b border-background/15 lg:border-l-0 lg:border-y">
            <Link
              href={`/private-equities/assets/${featuredDeal.ticker}`}
              className="group relative min-h-[360px] overflow-hidden sm:min-h-[460px]"
            >
              <Image
                src={featuredDeal.image}
                alt={featuredDeal.name}
                fill
                priority
                sizes="(min-width: 1024px) 47vw, 100vw"
                className="image-blackwork object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-foreground/45" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  {featuredDeal.ticker}
                </span>
                <span className="border border-background/50 bg-foreground/55 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                  Featured asset
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-background/20 bg-foreground/80 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-background/50">
                      {featuredDeal.sector}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">
                      {featuredDeal.name}
                    </h2>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
                </div>
                <div className="mt-5 grid grid-cols-3 border-t border-background/20 pt-5">
                  <AssetHeroStat
                    label="Valuation"
                    value={formatCurrency(featuredDeal.valuation)}
                  />
                  <AssetHeroStat label="Target" value={`${featuredDeal.apy}%`} />
                  <AssetHeroStat
                    label="Minimum"
                    value={formatCurrency(featuredDeal.minInvestment)}
                  />
                </div>
              </div>
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {marketplaceContext.map((item, index) => (
              <div key={item.title} className="bg-background p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h2 className="mt-10 font-serif text-3xl font-bold leading-tight">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Available assets
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-none sm:text-6xl">
              Browse without marketplace noise.
            </h2>
          </div>
          <Link
            href="/private-equities/deals"
            className="group inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
          >
            Review deal terms
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <AssetExplorer />
      </section>

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-background/50">
              Research context
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none sm:text-6xl">
              More than a token list.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-background/65">
              The asset route closes the loop with Ultramar research on
              tokenized private equity and issuer operating data.
            </p>
          </div>
          <div className="grid gap-px bg-background/20 md:grid-cols-2">
            {relatedResearch.map((article) => (
              <Link
                key={article.slug}
                href={`/research/${article.slug}`}
                className="group bg-foreground p-5 transition hover:bg-background hover:text-foreground"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-background/50 group-hover:text-accent">
                  {article.eyebrow}
                </p>
                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">
                  {article.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-background/65 group-hover:text-muted-foreground">
                  {article.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-background group-hover:text-accent">
                  Read memo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Asset FAQ"
            title="How investors should read the index"
            description="Public pages explain the workflow; production access remains gated by eligibility, documents, and jurisdiction-specific review."
          />
          <div className="grid gap-px bg-border">
            {assetFaqs.map((item) => (
              <div key={item.question} className="bg-background p-5">
                <h2 className="font-serif text-2xl font-bold leading-tight">{item.question}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductCrosslink current="private-equities" />
    </main>
  );
}

function AssetIndexFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-foreground p-4">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold text-background">{value}</p>
    </div>
  );
}

function AssetHeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-background/20 pr-3 last:border-r-0">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-background/45">
        {label}
      </p>
      <p className="mt-2 truncate font-mono text-sm font-semibold text-background">{value}</p>
    </div>
  );
}
