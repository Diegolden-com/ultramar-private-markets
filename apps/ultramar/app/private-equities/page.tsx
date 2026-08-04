import { JsonLd } from "@/components/json-ld";
import { ProductTabs } from "@/components/product-tabs";
import { deals, formatCurrency } from "@/lib/deals";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { productBySlug } from "@ultramar/product-model";
import {
  ArrowRight,
  BadgeDollarSign,
  DatabaseZap,
  FileCheck2,
  Landmark,
  Repeat2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["private-equities"];
const description =
  "Controlled private-market access for issuer onboarding, asset diligence, oracle-backed operating data, eligible secondary views, and gated investor participation.";

const privateEquitiesFaqs = [
  {
    question: "What does Private Equities help investors evaluate?",
    answer:
      "Private Equities helps investors evaluate issuer rounds, asset diligence, operating data, eligible secondary transfers, and legal access requirements in one controlled environment.",
  },
  {
    question: "Is Ultramar Private Equities a public exchange?",
    answer:
      "No. Participation requires investor eligibility checks, legal review, issuer documents, and jurisdiction-specific transfer controls.",
  },
  {
    question: "Why does the product include an issuer oracle?",
    answer:
      "The issuer oracle turns operating data into investor-facing solvency, liquidity, and data-recency context so private-market assets can be evaluated with more consistent information.",
  },
];

const workflowItems = [
  {
    icon: Landmark,
    title: "Issuer and asset intake",
    href: "/private-equities/assets",
    cta: "Browse assets",
  },
  {
    icon: BadgeDollarSign,
    title: "Capital raise mechanics",
    href: "/private-equities/deals",
    cta: "Review deals",
  },
  {
    icon: DatabaseZap,
    title: "Operating data bridge",
    href: "/private-equities/oracle",
    cta: "Open oracle",
  },
  {
    icon: Repeat2,
    title: "Eligible transfer context",
    href: "/private-equities/market",
    cta: "View market",
  },
] as const;

const primaryDeals = deals.filter((deal) => deal.type === "primary");
const secondaryDeals = deals.filter((deal) => deal.type === "secondary");
const featuredDeal = deals[0];
const disclosedMinimumTickets = deals.flatMap((deal) =>
  deal.minInvestment === undefined ? [] : [deal.minInvestment],
);
const overviewStats = [
  ["Listed Assets", deals.length.toString()],
  ["Issuer Rounds", primaryDeals.length.toString()],
  ["Secondary Views", secondaryDeals.length.toString()],
  [
    "Minimum Ticket",
    disclosedMinimumTickets.length ? formatCurrency(Math.min(...disclosedMinimumTickets)) : "Not disclosed",
  ],
] as const;

export const metadata = createSeoMetadata({
  title: "Private Equities Overview",
  description,
  path: product.href,
  image: seoImages.privateEquities,
  keywords: ["tokenized private equity", "private market assets", "issuer oracle", "RWA platform"],
});

export default function PrivateEquitiesPage() {
  return (
    <>
      <JsonLd
        id="private-equities-json-ld"
        data={[
          webPageJsonLd({ path: product.href, name: "Ultramar Private Equities", description }),
          serviceJsonLd({ product, serviceType: "Private-market investing platform" }),
          itemListJsonLd({
            path: product.href,
            name: "Ultramar Private Equities areas",
            description: "The core Private Equities areas investors and issuers can review.",
            items: workflowItems.map((item) => ({
              name: item.title,
              url: item.href,
              description: item.cta,
            })),
          }),
          faqJsonLd(privateEquitiesFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: product.href },
          ]),
        ]}
      />

      <section className="card card-border relative overflow-hidden bg-surface">
        <div className="hatch-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:p-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="badge badge-outline badge-accent h-auto min-h-6 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]">
                {product.eyebrow} / Access model
              </p>
              <h1 className="mt-6 max-w-[18ch] break-words text-balance font-serif text-4xl font-bold leading-[1.02] text-on-surface [overflow-wrap:anywhere] sm:text-5xl lg:text-[3.5rem]">
                Private Equities is a controlled rail for private-market assets.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                Review assets, issuer rounds, operating data, and eligible transfers.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-px border border-border-muted bg-border-muted xl:grid-cols-4">
              {overviewStats.map(([label, value]) => (
                <OverviewStat key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <aside className="card card-border relative min-h-[280px] overflow-hidden bg-surface-ink sm:min-h-[360px] lg:min-h-[420px]">
            <Image
              src="/solarpunk-laundromat.png"
              alt="Representative private-market operating asset"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="image-blackwork object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-surface-ink/35" />
            <div className="absolute inset-x-0 bottom-0 border-t border-border-muted bg-surface-ink/90 p-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
                {featuredDeal.secondarySale ? "Potential secondary transfer · not live" : "Example asset in the rail"}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-on-surface">
                {featuredDeal.name}
              </h2>
            </div>
          </aside>
        </div>
      </section>

      <ProductTabs product="private-equities" active="overview" />

      <section className="grid gap-3 lg:grid-cols-[0.72fr_1.28fr] md:gap-4">
        <div className="card card-border bg-surface p-6 sm:p-7 lg:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
            Product role
          </p>
          <h2 className="mt-4 max-w-[12ch] font-serif text-3xl font-semibold leading-[1.08] text-on-surface sm:text-4xl">
            Choose a workflow.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
          {workflowItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card card-border group min-h-[210px] bg-surface p-6 transition-colors hover:border-accent hover:bg-surface-container-low"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center border border-border-muted bg-surface-container-low">
                  <item.icon className="h-5 w-5 text-accent" />
                </span>
                <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:text-accent" />
              </div>
              <h3 className="mt-6 max-w-[16ch] font-serif text-2xl font-semibold leading-[1.12] text-on-surface">
                {item.title}
              </h3>
              <span className="mt-auto inline-flex pt-6 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-accent sm:text-[11px]">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="alert alert-warning card card-border items-start bg-surface p-5 text-on-surface-variant">
        <div className="flex items-start gap-3">
          <FileCheck2 className="mt-1 h-5 w-5 shrink-0 text-status-warning" />
          <p className="text-sm leading-6 text-on-surface-variant">
            Participation requires eligibility checks, legal review, transfer controls, and issuer documents.
          </p>
        </div>
      </section>
    </>
  );
}

function OverviewStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat min-w-0 bg-surface p-4 sm:p-5">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="stat-value mt-2 break-words font-mono text-lg font-semibold leading-tight text-on-surface sm:text-xl">{value}</p>
    </div>
  );
}
