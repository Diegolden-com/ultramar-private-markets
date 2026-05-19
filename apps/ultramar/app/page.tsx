import { JsonLd } from "@/components/json-ld";
import {
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { products } from "@ultramar/product-model";
import { ArrowRight, Landmark, LineChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const homeDescription =
  "Ultramar.capital is the institutional surface for Private Equities and a Polymarket-first Arbitrage Hedge Fund.";

export const metadata = createSeoMetadata({
  title: "Ultramar.capital | Private Equities and Arbitrage Hedge Fund",
  description: homeDescription,
  path: "/",
  image: seoImages.platform,
  keywords: ["investment platform", "private market access", "prediction market arbitrage"],
});

const homeFaqs = [
  {
    question: "What is Ultramar.capital?",
    answer:
      "Ultramar.capital is the canonical platform brand for two capital products: Ultramar Private Equities and the Ultramar Arbitrage Hedge Fund.",
  },
  {
    question: "What does Ultramar Private Equities do?",
    answer:
      "Ultramar Private Equities organizes tokenized private-market workflows for issuer onboarding, asset discovery, compliance-aware investor flows, oracle-backed operating data, markets, and portfolio visibility.",
  },
  {
    question: "What is the Ultramar Arbitrage Hedge Fund?",
    answer:
      "The Ultramar Arbitrage Hedge Fund is a Polymarket-first arbitrage product that compares prediction-market prices with derivatives-implied probabilities and turns durable spreads into monitored signals.",
  },
];

const modules = [
  {
    module: "Module 01",
    title: "Private Equities",
    subtitle: "RWA Rail System",
    audience: "Issuers / Operators",
    problem:
      "Digitization and governance of real-world asset lifecycles, requiring strict regulatory compliance and auditable cap tables.",
    href: "/private-equities",
    cta: "Initialize Equities Rail",
    icon: Landmark,
    sequence: [
      { label: "01", title: "Asset Tokenization", active: true },
      { label: "02", title: "Cap Table Deployment", active: false },
      { label: "03", title: "Secondary Liquidity", active: false },
    ],
  },
  {
    module: "Module 02",
    title: "Arbitrage Fund",
    subtitle: "Quant Signal Protocol",
    audience: "Allocators / Quants",
    problem:
      "High-frequency signal extraction, algorithmic deployment, and automated execution across fragmented liquidity pools.",
    href: "/arbitrage-hedge-fund",
    cta: "Initialize Quant Protocol",
    icon: LineChart,
    sequence: [
      { label: "01", title: "Signal Extraction", active: true },
      { label: "02", title: "Algorithmic Deployment", active: true },
      { label: "03", title: "Automated Execution", active: false },
    ],
  },
] as const;

const platformStats = [
  ["Products", "02", "Private assets and event markets"],
  ["Routes", "42", "Indexed app surfaces"],
  ["Mode", "Live", "Institutional terminal"],
] as const;

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-48px)] flex-col bg-surface-ink text-on-surface">
      <JsonLd
        id="home-webpage-json-ld"
        data={[
          webPageJsonLd({
            path: "/",
            name: "Ultramar.capital",
            description: homeDescription,
          }),
          itemListJsonLd({
            path: "/",
            name: "Ultramar.capital products",
            description: "The canonical product surfaces available on Ultramar.capital.",
            items: products.map((product) => ({
              name: product.name,
              url: product.href,
              description: product.description,
            })),
          }),
          faqJsonLd(homeFaqs),
        ]}
      />

      <header className="hero relative min-h-[420px] overflow-hidden border-b border-border-muted bg-surface px-4 py-10 md:px-12">
        <Image
          src="/abstract-financial-growth-chart-geometric-shapes.jpg"
          alt=""
          fill
          className="image-blackwork object-cover opacity-45"
          priority
          sizes="100vw"
        />
        <div className="hero-overlay bg-surface-ink/75" />
        <div className="hero-content relative z-10 grid w-full max-w-none grid-cols-1 items-end gap-8 p-0 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="badge badge-outline badge-success gap-2 bg-surface-ink/80 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
              <span className="status status-success" />
              System initialization active
            </div>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.05] text-on-surface md:text-6xl">
              Ultramar.capital
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              Institutional control surface for private-market rails and Polymarket-first
              arbitrage. Select the operating environment for the workflow you need.
            </p>
          </div>

          <div className="stats stats-vertical border border-border-muted bg-surface/90 text-on-surface shadow-none sm:stats-horizontal lg:stats-vertical">
            {platformStats.map(([label, value, detail]) => (
              <div key={label} className="stat border-border-muted">
                <p className="stat-title font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {label}
                </p>
                <p className="stat-value mt-2 font-mono text-2xl font-semibold text-on-surface">
                  {value}
                </p>
                <p className="stat-desc mt-2 text-xs text-on-surface-variant">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="grid flex-1 grid-cols-1 md:grid-cols-2">
        {modules.map((module, index) => (
          <article
            key={module.title}
            className={`card group relative flex flex-col border-border-muted ${
              index === 0 ? "border-b md:border-b-0 md:border-r" : ""
            }`}
          >
            <div className="absolute inset-0 bg-surface-container opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
            <div className="relative z-10 flex h-full flex-col p-6 md:p-12">
              <div className="mb-8 flex items-center justify-between">
                <span className="badge badge-outline px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {module.module}
                </span>
                <module.icon className="h-5 w-5 text-border-muted transition-colors duration-300 group-hover:text-status-signal" />
              </div>

              <h2 className="font-serif text-3xl font-semibold leading-tight text-on-surface">
                {module.title}
              </h2>
              <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                {module.subtitle}
              </p>

              <dl className="mt-8 space-y-1">
                <div className="grid gap-3 border-b border-border-muted py-2 sm:grid-cols-[120px_1fr]">
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    Audience
                  </dt>
                  <dd className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                    {module.audience}
                  </dd>
                </div>
                <div className="grid gap-3 border-b border-border-muted py-2 sm:grid-cols-[120px_1fr]">
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    Problem
                  </dt>
                  <dd className="text-sm leading-normal text-on-surface">{module.problem}</dd>
                </div>
              </dl>

              <div className="mt-8 flex-1">
                <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  Workflow sequence
                </h3>
                <div className="steps steps-vertical w-full border border-border-muted bg-surface">
                  {module.sequence.map((step, stepIndex) => (
                    <div
                      key={step.label}
                      className={`step justify-start gap-4 px-4 py-3 ${
                        stepIndex === module.sequence.length - 1 ? "" : "border-b border-border-muted"
                      } ${step.active ? "step-success" : "hatch-pattern"}`}
                    >
                      <span
                        className={`font-mono text-sm font-medium ${
                          step.active ? "text-status-signal" : "text-border-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                          step.active ? "text-on-surface" : "text-on-surface-variant"
                        }`}
                      >
                        {step.title}
                        {step.active ? "" : " (Locked)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={module.href}
                className="btn btn-outline btn-success mt-12 flex w-full justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
              >
                <span>{module.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
