import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { ProductTabs } from "@/components/product-tabs";
import { deals, formatCurrency } from "@/lib/deals";
import { productRouteGroups } from "@/lib/site-navigation";
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
  FileText,
  Landmark,
  LockKeyhole,
  Repeat2,
  ShieldCheck,
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

const routeCards = productRouteGroups["private-equities"].links.filter(
  (route) => route.key !== "overview",
);

const workflowItems = [
  {
    icon: Landmark,
    title: "Issuer and asset intake",
    body: "The rail starts by explaining what the private asset is, who the issuer is, what the round or transfer path represents, and what diligence is available.",
    href: "/private-equities/assets",
    cta: "Browse assets",
  },
  {
    icon: BadgeDollarSign,
    title: "Capital raise mechanics",
    body: "Primary issuer rounds are separated from general asset discovery so investors can inspect target raise, instrument, use of funds, and closing readiness.",
    href: "/private-equities/deals",
    cta: "Review deals",
  },
  {
    icon: DatabaseZap,
    title: "Operating data bridge",
    body: "The oracle shows how issuer accounting and operating data can become repeatable investor-facing proof instead of static token metadata.",
    href: "/private-equities/oracle",
    cta: "Open oracle",
  },
  {
    icon: Repeat2,
    title: "Eligible transfer context",
    body: "Secondary transfer views stay distinct from issuer rounds, with restrictions visible before any action.",
    href: "/private-equities/market",
    cta: "View market",
  },
] as const;

const boundaryItems = [
  "No public material accepts money, subscriptions, or binding commitments.",
  "Eligibility, KYC/KYB, jurisdiction, suitability, and transfer restrictions sit before production access.",
  "Issuer documents, legal wrapper, data-room status, and counsel-approved language determine when an opportunity can progress.",
] as const;

const primaryDeals = deals.filter((deal) => deal.type === "primary");
const secondaryDeals = deals.filter((deal) => deal.type === "secondary");
const featuredDeal = deals[0];
const featuredRaise = featuredDeal.capitalRaise;
const overviewStats = [
  ["Listed Assets", deals.length.toString(), "Primary and secondary private-market views"],
  ["Issuer Rounds", primaryDeals.length.toString(), "Capital raise processes"],
  ["Secondary Views", secondaryDeals.length.toString(), "Eligible transfer context"],
  [
    "Minimum Ticket",
    formatCurrency(Math.min(...deals.map((deal) => deal.minInvestment))),
    "Smallest displayed minimum for eligible review",
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
            items: routeCards.map((route) => ({
              name: route.label,
              url: route.href,
              description: route.description ?? "",
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
                Private Equities organizes issuer rounds, asset diligence, oracle-backed operating
                context, secondary-transfer visibility, and legal gating into one controlled process.
              </p>
            </div>

            <div className="mt-10 grid gap-1 bg-border-muted md:grid-cols-4">
              {overviewStats.map(([label, value, body]) => (
                <OverviewStat key={label} label={label} value={value} body={body} />
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
              <p className="mt-3 text-sm leading-5 text-on-surface-variant">
                {featuredDeal.description}
              </p>
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
            Make private-market access understandable before it becomes transactional.
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            Investors, issuers, and reviewers can see how diligence, operating data, deal terms,
            and access controls fit together before any subscription or transfer process begins.
          </p>
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
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.body}</p>
              <span className="mt-5 inline-flex font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-1 bg-border-muted lg:grid-cols-[1fr_1fr]">
        <div className="bg-surface">
          <div className="border-b border-border-muted p-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Investor questions
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
              Move from asset discovery to controlled access.
            </h2>
          </div>
          <div className="grid">
            {routeCards.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group grid gap-3 border-b border-border-muted p-4 transition-colors last:border-b-0 hover:bg-surface-container md:grid-cols-[120px_1fr_auto]"
              >
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                  {route.label}
                </span>
                <span className="text-sm leading-5 text-on-surface-variant">
                  {route.description}
                </span>
                <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-1 group-hover:text-status-signal" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-surface-paper p-6 text-surface-ink md:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-variant">
                Representative round
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">
                {featuredDeal.name}
              </h2>
            </div>
            <FileText className="h-5 w-5 text-surface-variant" />
          </div>

          <p className="mt-5 text-sm leading-6 text-surface-variant">
            One issuer should not carry the whole product story. This example shows how an asset
            can move forward once its data room, offering path, and investor process are ready.
          </p>

          <div className="mt-6 grid gap-1 bg-border-muted sm:grid-cols-2">
            <PaperStat label="Valuation" value={formatCurrency(featuredDeal.valuation)} />
            <PaperStat
              label="Target raise"
              value={featuredRaise ? formatCurrency(featuredRaise.targetRaise) : "Pending"}
            />
            <PaperStat label="Minimum" value={formatCurrency(featuredDeal.minInvestment)} />
            <PaperStat label="Compliance" value={`${featuredDeal.complianceScore}/100`} />
          </div>

          {featuredRaise ? (
            <div className="mt-6 border-t border-border-muted pt-6">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Current readiness
              </p>
              <p className="mt-2 text-sm leading-6 text-surface-variant">
                {featuredRaise.summary}
              </p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/private-equities/assets/${featuredDeal.ticker}`}
              className="btn btn-outline justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
            >
              View asset
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/private-equities/deals"
              className="btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
            >
              Deal terms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-surface p-6 md:p-8">
          <ShieldCheck className="h-5 w-5 text-status-warning" />
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-on-surface">
            Access is intentionally gated.
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            Clear public information should reduce confusion without turning Ultramar into an
            unrestricted exchange or subscription portal.
          </p>
        </div>
        <div className="grid gap-1 bg-border-muted md:grid-cols-3">
          {boundaryItems.map((item) => (
            <div key={item} className="bg-surface p-5">
              <LockKeyhole className="h-5 w-5 text-status-warning" />
              <p className="mt-5 text-sm leading-6 text-on-surface-variant">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border-muted bg-surface p-5">
        <div className="flex items-start gap-3">
          <FileCheck2 className="mt-1 h-5 w-5 shrink-0 text-status-warning" />
          <p className="text-sm leading-6 text-on-surface-variant">
            Production participation requires legal review, KYC/KYB, accreditation or suitability
            checks where applicable, custody setup, transfer controls, and issuer-specific offering
            documents.
          </p>
        </div>
      </section>

      <FaqSection
        eyebrow="Private Equities FAQ"
        title="How investors should read Private Equities"
        description="A plain-language guide to what is visible publicly and what requires controlled access."
        items={privateEquitiesFaqs}
      />

      <ProductCrosslink current="private-equities" />
    </>
  );
}

function OverviewStat({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="bg-surface p-4">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-on-surface">{value}</p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{body}</p>
    </div>
  );
}

function PaperStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm font-semibold text-surface-ink">{value}</p>
    </div>
  );
}
