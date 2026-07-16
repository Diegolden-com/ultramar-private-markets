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
const overviewStats = [
  ["Listed Assets", deals.length.toString()],
  ["Issuer Rounds", primaryDeals.length.toString()],
  ["Secondary Views", secondaryDeals.length.toString()],
  [
    "Minimum Ticket",
    formatCurrency(Math.min(...deals.map((deal) => deal.minInvestment))),
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

      <section className="relative overflow-hidden border border-border-muted bg-surface">
        <div className="hatch-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                {product.eyebrow} / Access model
              </p>
              <h1 className="mt-4 max-w-4xl break-words font-serif text-4xl font-bold leading-[1.1] text-on-surface [overflow-wrap:anywhere] md:text-5xl">
                Private Equities is a controlled rail for private-market assets.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
                Review assets, issuer rounds, operating data, and eligible transfers.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-4">
              {overviewStats.map(([label, value]) => (
                <OverviewStat key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <aside className="relative min-h-[360px] overflow-hidden border border-border-muted bg-surface-ink">
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
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Example asset in the rail
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-on-surface">
                {featuredDeal.name}
              </h2>
            </div>
          </aside>
        </div>
      </section>

      <ProductTabs product="private-equities" active="overview" />

      <section className="grid gap-1 bg-border-muted lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-surface p-6 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
            Product role
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
            Choose a workflow.
          </h2>
        </div>

        <div className="grid gap-1 bg-border-muted md:grid-cols-2">
          {workflowItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-surface p-5 transition-colors hover:bg-surface-container"
            >
              <div className="flex items-start justify-between gap-4">
                <item.icon className="h-5 w-5 text-status-signal" />
                <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-1 group-hover:text-status-signal" />
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.title}
              </h3>
              <span className="mt-5 inline-flex font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-border-muted bg-surface p-5">
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
    <div className="bg-surface p-4">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-on-surface">{value}</p>
    </div>
  );
}
