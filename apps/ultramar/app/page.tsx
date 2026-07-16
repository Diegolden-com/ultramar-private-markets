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
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-64px)] scroll-mt-20 flex-col bg-surface-ink text-on-surface"
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

      <header className="hero overflow-hidden border-b border-border-muted bg-surface-ink px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
        <div className="hero-content mx-auto grid w-full max-w-[1440px] gap-px border border-border-muted bg-border-muted p-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="min-w-0 bg-surface p-6 sm:p-9 lg:p-12 xl:p-14">
            <div className="badge badge-outline badge-info h-auto min-h-6 bg-surface-ink px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]">
              Capital products
            </div>
            <h1 className="mt-7 max-w-[15ch] break-words text-balance font-serif text-[2.75rem] font-semibold leading-[0.96] text-on-surface [overflow-wrap:anywhere] sm:text-[3.7rem] lg:text-[4.35rem] xl:text-[4.8rem]">
              <BrandName /> gives private markets and event-market arbitrage a controlled home.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-on-surface-variant sm:text-lg">
              Private assets and Polymarket arbitrage, with explicit access and risk controls.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities"
                className={`btn btn-accent h-12 justify-between px-5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] sm:min-w-64 sm:text-[11px] ${focusVisibleClass}`}
              >
                Private Equities
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/arbitrage-hedge-fund"
                className={`btn btn-outline btn-info h-12 justify-between px-5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] sm:min-w-64 sm:text-[11px] ${focusVisibleClass}`}
              >
                Arbitrage Hedge Fund
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="relative min-h-[300px] overflow-hidden bg-surface-container-lowest sm:min-h-[360px] lg:min-h-full">
            <div className="terminal-grid-2d absolute inset-0 opacity-35" aria-hidden="true" />
            <ParticleWaveHero />
            <div className="absolute left-5 top-5 h-10 w-10 border-l border-t border-primary/70 sm:left-7 sm:top-7" aria-hidden="true" />
            <div className="absolute bottom-5 right-5 h-10 w-10 border-b border-r border-primary/70 sm:bottom-7 sm:right-7" aria-hidden="true" />
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-px border border-border-muted bg-border-muted sm:inset-x-6 sm:bottom-6">
              {platformStats.map(([label, value]) => (
                <div key={label} className="stat min-w-0 bg-surface/95 p-3.5 sm:p-4">
                  <p className="stat-title whitespace-normal font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-on-surface-variant sm:text-[9px]">
                    {label}
                  </p>
                  <p className="stat-value mt-2 break-words font-mono text-sm font-semibold leading-tight tabular-nums text-on-surface sm:text-lg">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </header>

      <section className="bg-surface-ink px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16 xl:px-12">
        <div className="mx-auto grid w-full max-w-[1440px] gap-4 lg:grid-cols-2">
        {products.map((product) => {
          const narrative = productNarratives[product.slug];
          const Icon = narrative.icon;
          const privateEquities = product.slug === "private-equities";

          return (
            <article
              key={product.slug}
              className={`card card-border flex min-h-[340px] flex-col bg-surface p-6 sm:p-8 lg:p-10 ${
                privateEquities ? "border-t-accent" : "border-t-primary"
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className={`font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px] ${privateEquities ? "text-accent" : "text-primary"}`}>
                    {narrative.label}
                  </p>
                  <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.05] text-on-surface sm:text-4xl">
                    {product.name}
                  </h2>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-border-muted bg-surface-container-low">
                  <Icon className={`h-5 w-5 ${privateEquities ? "text-accent" : "text-primary"}`} aria-hidden="true" />
                </span>
              </div>

              <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                {narrative.headline}
              </p>

              <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
                <Link
                  href={product.href}
                  className={`btn btn-outline h-12 justify-between px-5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] sm:text-[11px] ${privateEquities ? "btn-accent" : "btn-info"} ${focusVisibleClass}`}
                >
                  Product overview
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={product.primaryHref}
                  className={`btn btn-ghost h-12 justify-between px-5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-on-surface-variant hover:text-on-surface sm:text-[11px] ${focusVisibleClass}`}
                >
                  {product.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
        </div>
      </section>
    </main>
  );
}
