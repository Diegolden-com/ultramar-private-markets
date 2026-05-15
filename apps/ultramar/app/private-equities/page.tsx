import { JsonLd } from "@/components/json-ld";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  faqJsonLd,
  seoImages,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { productBySlug } from "@ultramar/product-model";
import { ArrowRight, Check, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["private-equities"];
const description =
  "Private-market and tokenized real-world asset workflows for issuers, eligible investors, oracle proofs, markets, and portfolios.";

const privateEquitiesFaqs = [
  {
    question: "How does Ultramar Private Equities support tokenized private-market assets?",
    answer:
      "It connects issuer onboarding, asset discovery, compliance-aware investor flows, oracle-backed operating data, market views, and portfolio tracking into one private-market workflow.",
  },
  {
    question: "Is Ultramar Private Equities a public exchange?",
    answer:
      "No. The public site describes the product workflow. Production participation requires investor eligibility checks, legal review, issuer documents, and jurisdiction-specific transfer controls.",
  },
  {
    question: "Why does the private-equities product include an issuer oracle?",
    answer:
      "The issuer oracle turns operating data into investor-facing solvency and liquidity context so private-market assets can be evaluated with more consistent information.",
  },
];

const tabs = [
  { label: "Assets", href: "/private-equities/assets", active: false },
  { label: "Deals", href: "/private-equities", active: true },
  { label: "Oracle", href: "/private-equities/oracle", active: false },
  { label: "Market", href: "/private-equities/market", active: false },
  { label: "Portfolio", href: "/private-equities/portfolio", active: false },
  { label: "Legal", href: "/private-equities/legal", active: false },
] as const;

const dataRoomItems = [
  ["FINANCIALS_AUDITED.PDF", "ready"],
  ["LEGAL_RESTRUCTURE.PDF", "ready"],
  ["ENV_IMPACT_REPORT.PDF", "pending"],
] as const;

export const metadata = createSeoMetadata({
  title: "Private Equities, uncompromised",
  description,
  path: product.href,
  image: seoImages.privateEquities,
  keywords: ["tokenized private equity", "private market assets", "issuer oracle", "RWA platform"],
});

export default function PrivateEquitiesPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="private-equities-json-ld"
        data={[
          webPageJsonLd({ path: product.href, name: "Ultramar Private Equities", description }),
          serviceJsonLd({ product, serviceType: "Private-market investing platform" }),
          faqJsonLd(privateEquitiesFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: product.href },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border border-border-muted bg-surface p-6 md:p-8">
        <div className="hatch-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              Secure Enclave / T-0 Settlement
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold uppercase leading-[1.1] text-on-surface md:text-5xl">
              Controlled RWA Rail
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              Gated execution environment for tokenized real-world assets. Institutional-grade
              compliance verification embedded at the protocol level.
            </p>
          </div>
          <dl className="border-border-muted md:col-span-4 md:border-l md:pl-8">
            <TerminalFact label="Network Status" value="Online" signal />
            <TerminalFact label="24H Volume" value="$1.24B" />
            <TerminalFact label="Active Nodes" value="42/42" last />
          </dl>
        </div>
      </section>

      <nav className="flex overflow-x-auto border border-border-muted bg-surface">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`border-r border-border-muted px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors last:border-r-0 ${
              tab.active
                ? "border-b-2 border-b-status-signal bg-surface-container text-status-signal"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-12">
        <section className="flex flex-col bg-surface-paper text-surface-ink md:col-span-8">
          <header className="flex items-start justify-between gap-4 border-b border-border-muted p-6">
            <div>
              <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-surface-variant">
                Offering Memorandum / Confidential
              </p>
              <h2 className="font-serif text-3xl font-bold leading-tight">Lavanderias CX</h2>
              <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Series B / Latam Commercial Real Estate & Operations
              </p>
            </div>
            <Image
              src="/stitch-industrial-facility.png"
              alt="Grayscale industrial commercial facility"
              width={96}
              height={96}
              className="hidden border border-border-muted object-cover grayscale sm:block"
              priority
            />
          </header>

          <div className="flex flex-1 flex-col gap-6 bg-white p-6 md:p-8">
            <p className="text-lg leading-relaxed">
              Lavanderias CX operates a highly automated, sovereign-grade commercial laundry network
              across major LATAM urban centers. This raise aims to finance the acquisition of 14 key
              logistic nodes and integrate proprietary energy-arbitrage hardware to reduce
              operational OPEX by a projected 42% over the next fiscal cycle.
            </p>

            <section className="border-t border-border-muted pt-6">
              <h3 className="mb-4 font-serif text-2xl font-medium">Use of Funds</h3>
              <ul className="space-y-4">
                {[
                  ["55%", "Asset Acquisition", "Real estate purchase of identified tier-1 logistic hubs in SP, CDMX, and BOG."],
                  ["30%", "Capex (Automation)", "Deployment of localized micro-grid hardware and automated processing lines."],
                  ["15%", "Working Capital", "Buffer for regulatory clearance delays and initial integration phases."],
                ].map(([percent, label, body]) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="w-16 pt-1 font-mono text-sm font-medium">{percent}</span>
                    <div>
                      <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.08em]">
                        {label}
                      </span>
                      <span className="text-sm leading-normal text-surface-variant">{body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>

        <aside className="flex flex-col gap-1 md:col-span-4">
          <section className="border border-border-muted border-t-status-signal bg-surface p-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Target Raise
            </p>
            <p className="mt-4 font-mono text-4xl font-semibold text-on-surface">$45,000,000</p>
            <div className="mt-6 h-1 w-full bg-surface-variant">
              <div className="h-full w-[60%] bg-status-signal" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
              <span className="text-on-surface-variant">Committed: $27M</span>
              <span className="text-status-signal">60%</span>
            </div>
          </section>

          <section className="border border-border-muted bg-surface p-6">
            <div className="flex items-center justify-between border-b border-border-muted pb-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Data Room
              </p>
              <span className="flex items-center gap-2 border border-status-signal px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                <span className="h-2 w-2 bg-status-signal" />
                Ready
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {dataRoomItems.map(([label, status]) => (
                <div key={label} className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                      status === "ready" ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    {label}
                  </span>
                  {status === "ready" ? (
                    <Check className="h-4 w-4 text-status-signal" />
                  ) : (
                    <span className="h-4 w-4 border border-on-surface-variant hatch-pattern" />
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/private-equities/assets/lcx"
              className="mt-6 flex w-full items-center justify-between border border-border-muted bg-surface-ink px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface transition-colors hover:border-status-signal hover:bg-status-signal hover:text-white"
            >
              Access Room
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="flex flex-1 flex-col border border-border-muted bg-surface p-6">
            <p className="border-b border-border-muted pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Diligence Path
            </p>
            <div className="relative ml-2 mt-5 flex-1 space-y-6 border-l border-border-muted py-2">
              {[
                ["Phase 1: Initial Review", "Completed", true, true],
                ["Phase 2: Deep Dive", "Completed", true, true],
                ["Phase 3: Legal Clearance", "In Progress", false, false],
              ].map(([phase, state, filled]) => (
                <div key={phase as string} className="relative pl-6">
                  <span
                    className={`absolute left-[-5px] top-1 h-2 w-2 ${
                      filled ? "bg-status-signal" : "border border-status-signal bg-surface-ink"
                    }`}
                  />
                  <span
                    className={`block font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                      filled ? "text-status-signal" : "text-on-surface"
                    }`}
                  >
                    {phase}
                  </span>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-border-muted bg-surface p-6">
            <div className="flex items-start gap-3">
              <Square className="mt-1 h-3 w-3 text-status-signal" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                Investor packet remains gated until counsel approves the final offering path.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function TerminalFact({
  label,
  value,
  signal,
  last,
}: {
  label: string;
  value: string;
  signal?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${last ? "" : "border-b border-border-muted"}`}>
      <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </dt>
      <dd
        className={`font-mono text-sm font-medium uppercase ${
          signal ? "flex items-center gap-2 text-status-signal" : "text-on-surface"
        }`}
      >
        {signal ? <span className="h-2 w-2 bg-status-signal" /> : null}
        {value}
      </dd>
    </div>
  );
}
