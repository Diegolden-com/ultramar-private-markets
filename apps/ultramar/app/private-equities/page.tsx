import { MetricCard } from "@/components/metric-card";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { productBySlug } from "@ultramar/product-model";
import { ArrowRight, Building2, DatabaseZap, FileCheck2, LineChart, WalletCards } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Private Equities",
  description:
    "Private-market and tokenized real-world asset workflows for Ultramar.capital.",
  alternates: {
    canonical: "/private-equities",
  },
};

const product = productBySlug["private-equities"];

export default function PrivateEquitiesPage() {
  return (
    <main>
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          src="/solarpunk-laundromat.png"
          alt="Private-market operating asset"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/68" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl text-background">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              {product.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Private Equities for tokenized real-world assets.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/78">
              Ultramar Private Equities gives issuers and investors a controlled
              workflow for private assets: deal discovery, compliance signals,
              oracle-backed operating data, market access, and portfolio tracking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities/assets"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Explore Assets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/private-equities/oracle"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background hover:bg-background hover:text-foreground"
              >
                View Oracle
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Deal rail"
            value="Primary"
            detail="Issuer-led rounds with structured investor context."
            icon={Building2}
          />
          <MetricCard
            label="Market rail"
            value="Secondary"
            detail="Transfer workflow for eligible tokenized positions."
            icon={LineChart}
          />
          <MetricCard
            label="Oracle"
            value="Solvency"
            detail="Accounting data condensed into signed operating proofs."
            icon={DatabaseZap}
          />
        </div>
      </section>

      <section className="border-t border-border bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Workflow"
            title="The product owns the full private-market path"
            description="This is not a generic landing page. It is the route into assets, deals, oracle data, market views, and portfolio state."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Building2,
                title: "Assets",
                body: "Browse primary and secondary private-market opportunities with standardized metrics.",
                href: "/private-equities/assets",
              },
              {
                icon: FileCheck2,
                title: "Deals",
                body: "Understand issuer rounds, minimum tickets, offering mechanics, and required diligence.",
                href: "/private-equities/deals",
              },
              {
                icon: DatabaseZap,
                title: "Oracle",
                body: "Connect operating data to solvency and liquidity signals used by the asset rail.",
                href: "/private-equities/oracle",
              },
              {
                icon: WalletCards,
                title: "Portfolio",
                body: "Track holdings, exposure, performance, and realized gains inside Ultramar.capital.",
                href: "/private-equities/portfolio",
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

      <ProductCrosslink current="private-equities" />
    </main>
  );
}
