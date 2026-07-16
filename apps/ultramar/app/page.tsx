import { BrandName } from "@/components/brand-name";
import { JsonLd } from "@/components/json-ld";
import { ParticleWaveHero } from "@/components/particle-wave-hero";
import {
  createSeoMetadata,
  faqJsonLd,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { products } from "@ultramar/product-model";
import { ArrowRight, Landmark, LineChart } from "lucide-react";
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

const productNarratives = {
  "private-equities": {
    icon: Landmark,
    label: "Private-market rail",
    headline: "Assets, issuer rounds, operating data, and controlled transfers.",
  },
  "arbitrage-hedge-fund": {
    icon: LineChart,
    label: "Polymarket-first fund",
    headline: "Event-market signals, exposure, and risk controls.",
  },
} as const;

const platformStats = [
  ["Products", products.length.toString().padStart(2, "0")],
  ["Access", "Gated"],
  ["Data", "Read-only"],
] as const;

const focusVisibleClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-signal";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-48px)] scroll-mt-16 flex-col bg-surface-ink text-on-surface"
    >
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

      <header className="hero relative min-h-[560px] overflow-hidden border-b border-border-muted bg-surface px-4 py-12 md:px-12 md:py-14">
        <ParticleWaveHero />
        <div className="hero-overlay bg-surface-ink/75" />
        <div className="hero-content relative z-10 flex w-full max-w-[1600px] flex-col items-start gap-10 p-0">
          <div className="max-w-5xl">
            <div className="badge badge-outline badge-success gap-2 bg-surface-ink/80 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
              <span className="status status-success" />
              Capital products
            </div>
            <h1 className="mt-4 max-w-5xl break-words text-balance font-serif text-4xl font-bold leading-[0.98] text-on-surface [overflow-wrap:anywhere] md:text-6xl xl:text-7xl">
              <BrandName /> gives private markets and event-market arbitrage a controlled home.
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Private assets and Polymarket arbitrage, with explicit access and risk controls.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities"
                className={`btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-64 ${focusVisibleClass}`}
              >
                Private Equities
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/arbitrage-hedge-fund"
                className={`btn btn-outline btn-info justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:min-w-64 ${focusVisibleClass}`}
              >
                Arbitrage Hedge Fund
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid w-full gap-1 bg-border-muted md:grid-cols-3">
            {platformStats.map(([label, value]) => (
              <div key={label} className="bg-surface/95 p-5 md:p-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                  {label}
                </p>
                <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-on-surface">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

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
                <Icon className="h-6 w-6 shrink-0 text-on-surface-variant" aria-hidden="true" />
              </div>

              <p className="mt-6 max-w-2xl text-pretty text-lg leading-7 text-on-surface-variant">
                {narrative.headline}
              </p>

              <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
                <Link
                  href={product.href}
                  className={`btn btn-outline btn-success justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${focusVisibleClass}`}
                >
                  Product overview
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={product.primaryHref}
                  className={`btn btn-ghost justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant hover:text-primary ${focusVisibleClass}`}
                >
                  {product.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
