import { BrandName } from "@/components/brand-name";
import { ProductExperiencePanels } from "@/components/daisyui-route-widgets";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ParticleWaveHero } from "@/components/particle-wave-hero";
import { indexableSitemapRoutes } from "@/lib/discoverability";
import { productRouteGroups } from "@/lib/site-navigation";
import {
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { products } from "@ultramar/product-model";
import {
  ArrowRight,
  DatabaseZap,
  Landmark,
  LineChart,
  LockKeyhole,
  Route,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const homeDescription =
  "Ultramar.capital brings controlled private-market access and Polymarket-first arbitrage under one institutional capital brand.";

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
      "Ultramar.capital is the home of two institutional capital products: Ultramar Private Equities and the Ultramar Arbitrage Hedge Fund.",
  },
  {
    question: "Which product should I open first?",
    answer:
      "Open Private Equities if you are evaluating issuer rounds, tokenized private-market assets, oracle-backed diligence, or eligible secondary transfers. Open the Arbitrage Hedge Fund if you are evaluating Polymarket-first signals, exposure, sizing, and risk controls.",
  },
  {
    question: "Can I invest or trade directly here?",
    answer:
      "No. Investment access, private-market participation, and fund allocation require eligibility checks, issuer documents, and product-specific review.",
  },
];

const platformPrinciples = [
  {
    icon: Route,
    title: "Two products, separate jobs",
    body: "Private Equities serves issuers and eligible investors in private assets. The Arbitrage Hedge Fund serves allocators reviewing event-market signal and risk discipline.",
  },
  {
    icon: DatabaseZap,
    title: "Context before action",
    body: "Each product starts with the business case, the decision points, and the access limits before users inspect assets, signals, or risk controls.",
  },
  {
    icon: LockKeyhole,
    title: "Public explanation, gated action",
    body: "Ultramar can describe each product clearly without implying public exchange access, binding commitments, or automatic trade execution.",
  },
] as const;

const productNarratives = {
  "private-equities": {
    icon: Landmark,
    label: "Private-market rail",
    headline: "For issuers and eligible investors evaluating private assets.",
    routes: ["Assets", "Deals", "Oracle", "Market", "Portfolio", "Legal Gate"],
    nextStep: "Start with the thesis, then inspect assets and issuer diligence.",
  },
  "arbitrage-hedge-fund": {
    icon: LineChart,
    label: "Polymarket-first fund",
    headline: "For allocators evaluating event-market signals and controls.",
    routes: ["Dashboard", "Signals", "Risk", "Research"],
    nextStep: "Start with the thesis, then inspect signal logic and risk controls.",
  },
} as const;

const productRouteCount = Object.values(productRouteGroups).reduce(
  (count, group) => count + group.links.length,
  0,
);

const platformStats = [
  ["Products", products.length.toString().padStart(2, "0"), "Private assets and event markets"],
  ["Product Areas", productRouteCount.toString(), "Assets, signals, risk, research, and access controls"],
  ["Research & Disclosures", indexableSitemapRoutes.length.toString(), "Public materials for diligence and review"],
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
            description: "The institutional capital products available through Ultramar.capital.",
            items: products.map((product) => ({
              name: product.name,
              url: product.href,
              description: product.description,
            })),
          }),
          faqJsonLd(homeFaqs),
        ]}
      />

      <header className="hero relative min-h-[560px] overflow-hidden border-b border-border-muted bg-surface px-4 py-10 md:px-12">
        <ParticleWaveHero />
        <div className="hero-overlay bg-surface-ink/75" />
        <div className="hero-content relative z-10 flex w-full max-w-[1600px] flex-col items-start gap-10 p-0">
          <div className="max-w-5xl">
            <div className="badge badge-outline badge-success gap-2 bg-surface-ink/80 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
              <span className="status status-success" />
              Capital products
            </div>
            <h1 className="mt-4 max-w-5xl break-words font-serif text-3xl font-bold leading-[1.05] text-on-surface [overflow-wrap:anywhere] md:text-6xl">
              <BrandName /> gives private markets and event-market arbitrage a controlled home.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Private Equities organizes issuer diligence, investor eligibility, and transfer controls.
              The Arbitrage Hedge Fund turns Polymarket dislocations into reviewable allocator signals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities"
                className="btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-64"
              >
                Private Equities
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/arbitrage-hedge-fund"
                className="btn btn-outline btn-info justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-64"
              >
                Arbitrage Hedge Fund
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid w-full gap-1 bg-border-muted md:grid-cols-3">
            {platformStats.map(([label, value, detail]) => (
              <div key={label} className="bg-surface/95 p-5">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {label}
                </p>
                <p className="mt-3 font-mono text-3xl font-semibold text-on-surface">{value}</p>
                <p className="mt-2 text-sm leading-5 text-on-surface-variant">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <ProductExperiencePanels />

      <section className="grid gap-1 border-b border-border-muted bg-border-muted md:grid-cols-3">
        {platformPrinciples.map((item) => (
          <div key={item.title} className="bg-surface p-6 md:p-8">
            <item.icon className="h-5 w-5 text-status-signal" />
            <h2 className="mt-6 font-serif text-2xl font-semibold leading-tight text-on-surface">
              {item.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-1 border-b border-border-muted bg-border-muted lg:grid-cols-2">
        {products.map((product) => {
          const narrative = productNarratives[product.slug];
          const Icon = narrative.icon;

          return (
            <article key={product.slug} className="flex min-h-full flex-col bg-surface p-6 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                    {narrative.label}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-on-surface">
                    {product.name}
                  </h2>
                </div>
                <Icon className="h-6 w-6 shrink-0 text-on-surface-variant" />
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-7 text-on-surface">
                {narrative.headline}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
                {product.description}
              </p>

              <dl className="mt-8 grid gap-1 border-y border-border-muted py-1">
                <ProductFact label="Audience" value={product.audience} />
                <ProductFact label="Problem" value={product.problem} />
                <ProductFact label="Next step" value={narrative.nextStep} />
              </dl>

              <div className="mt-8">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  What to inspect
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {narrative.routes.map((route) => (
                    <span
                      key={route}
                      className="border border-border-muted bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant"
                    >
                      {route}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
                <Link
                  href={product.href}
                  className="btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                >
                  Product overview
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={product.primaryHref}
                  className="btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary"
                >
                  {product.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="border-b border-border-muted bg-surface-ink px-4 py-10 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                Product navigation
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
                Each section answers a different investor question.
              </h2>
            </div>
            <ShieldCheck className="hidden h-6 w-6 text-status-signal md:block" />
          </div>

          <div className="grid gap-1 bg-border-muted lg:grid-cols-2">
            {products.map((product) => (
              <div key={product.slug} className="bg-surface">
                <div className="border-b border-border-muted p-5">
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    {productRouteGroups[product.slug].description}
                  </p>
                </div>
                <div className="grid">
                  {productRouteGroups[product.slug].links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group grid gap-3 border-b border-border-muted p-4 transition-colors last:border-b-0 hover:bg-surface-container md:grid-cols-[140px_1fr_auto]"
                    >
                      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                        {link.label}
                      </span>
                      <span className="text-sm leading-5 text-on-surface-variant">
                        {link.description}
                      </span>
                      <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-1 group-hover:text-status-signal" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        eyebrow="Platform FAQ"
        title="How to read the public platform"
        description="A quick orientation for investors, issuers, allocators, and reviewers."
        items={homeFaqs}
      />
    </main>
  );
}

function ProductFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-border-muted py-3 last:border-b-0 sm:grid-cols-[120px_1fr]">
      <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-on-surface">{value}</dd>
    </div>
  );
}
