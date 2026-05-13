import { JsonLd } from "@/components/json-ld";
import { MetricCard } from "@/components/metric-card";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  seoImages,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { productBySlug } from "@ultramar/product-model";
import { ArrowRight, BarChart3, Gauge, Radar, Shield, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const product = productBySlug["arbitrage-hedge-fund"];
const description =
  "Polymarket-first arbitrage hedge fund infrastructure with signal monitoring, position exposure, and risk controls.";

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund",
  description,
  path: product.href,
  image: seoImages.arbitrage,
  keywords: ["Polymarket arbitrage", "prediction market hedge fund", "event market signals"],
});

export default function ArbitrageHedgeFundPage() {
  return (
    <main>
      <JsonLd
        id="arbitrage-hedge-fund-json-ld"
        data={[
          webPageJsonLd({ path: product.href, name: "Ultramar Arbitrage Hedge Fund", description }),
          serviceJsonLd({ product, serviceType: "Polymarket-first arbitrage fund" }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: product.href },
          ]),
        ]}
      />
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          src="/abstract-financial-growth-chart-geometric-shapes.jpg"
          alt="Quantitative trading signal infrastructure"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/74" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl text-background">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              {product.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Arbitrage Hedge Fund built around Polymarket dislocations.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/78">
              The fund product normalizes Polymarket prices against
              derivatives-implied probabilities, then turns durable spreads into
              monitored signals with sizing, hedging, and risk controls.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/arbitrage-hedge-fund/signals"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Open Signals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/arbitrage-hedge-fund/risk"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background hover:bg-background hover:text-foreground"
              >
                Review Risk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="V1 scope"
            value="Polymarket"
            detail="No active lending or derivative arbitrage product in this release."
            icon={Target}
          />
          <MetricCard
            label="Signal model"
            value="Prob spread"
            detail="Prediction price versus derivatives-implied probability."
            icon={Radar}
          />
          <MetricCard
            label="Execution"
            value="Governed"
            detail="Sizing, exposure, and hedge controls before allocation."
            icon={Shield}
          />
        </div>
      </section>

      <section className="border-t border-border bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Fund system"
            title="A single product with explicit research boundaries"
            description="The commercial product is the Polymarket-first Arbitrage Hedge Fund. Other arbitrage ideas can live in research until they graduate."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: BarChart3,
                title: "Signals",
                body: "Live spread board for Polymarket markets, theoretical values, and signal confidence.",
                href: "/arbitrage-hedge-fund/signals",
              },
              {
                icon: Gauge,
                title: "Dashboard",
                body: "Allocator-facing overview of active signals, positions, exposure, and guardrails.",
                href: "/arbitrage-hedge-fund/dashboard",
              },
              {
                icon: Shield,
                title: "Risk",
                body: "Sizing controls, concentration limits, hedge policy, and failure modes.",
                href: "/arbitrage-hedge-fund/risk",
              },
              {
                icon: Radar,
                title: "Research",
                body: "Non-commercial notes for future strategies and model extensions.",
                href: "/arbitrage-hedge-fund/research",
              },
            ].map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className="rounded-lg border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
              >
                <item.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductCrosslink current="arbitrage-hedge-fund" />
    </main>
  );
}
