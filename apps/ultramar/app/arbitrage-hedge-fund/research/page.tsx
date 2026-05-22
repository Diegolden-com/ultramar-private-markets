import { JsonLd } from "@/components/json-ld";
import { FeatureCard, ProductRouteHeader, SurfaceGrid } from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { BookOpenText, FlaskConical, Lock, Radar } from "lucide-react";

const researchPath = "/arbitrage-hedge-fund/research";
const description = "Research backlog for future arbitrage strategies at Ultramar.capital.";
const strategyItems = [
  {
    icon: Radar,
    title: "Polymarket arbitrage",
    body: "Active v1 scope. Signal research supports live probability dislocation monitoring.",
    status: "Active product",
  },
  {
    icon: FlaskConical,
    title: "Lending markets",
    body: "Research-only in this release. Useful as a future yield and capital efficiency module.",
    status: "Research only",
  },
  {
    icon: BookOpenText,
    title: "Derivative arbitrage",
    body: "Research-only in this release. Derivatives inform probability models and hedging assumptions.",
    status: "Research only",
  },
  {
    icon: Lock,
    title: "Graduation rule",
    body: "A strategy only becomes product surface after data quality, risk limits, and allocator language are complete.",
    status: "Governance",
  },
] as const;

export const metadata = createSeoMetadata({
  title: "Arbitrage Hedge Fund Research",
  description,
  path: researchPath,
  image: seoImages.arbitrage,
  keywords: ["arbitrage research", "Polymarket research", "derivative arbitrage research"],
});

export default function ResearchPage() {
  return (
    <>
      <JsonLd
        id="arbitrage-research-json-ld"
        data={[
          webPageJsonLd({
            path: researchPath,
            name: "Ultramar Arbitrage Hedge Fund Research",
            description,
          }),
          itemListJsonLd({
            path: researchPath,
            name: "Arbitrage strategy research backlog",
            description,
            items: strategyItems.map((item) => ({
              name: item.title,
              url: researchPath,
              description: item.body,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Arbitrage Hedge Fund", path: "/arbitrage-hedge-fund" },
            { name: "Research", path: researchPath },
          ]),
        ]}
      />

      <ProductRouteHeader
        product="arbitrage-hedge-fund"
        active="research"
        eyebrow="Arbitrage Hedge Fund / Research Gate"
        title="Research, not product"
        description="This route preserves strategy context without presenting lending markets or derivative arbitrage as active commercial products."
      />
      <SurfaceGrid columns="md:grid-cols-2">
        {strategyItems.map((item) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            body={item.body}
            className="flex flex-col"
            titleClassName="mt-4"
          >
            <div className="-order-1 flex items-start justify-between gap-4">
              <item.icon className="h-5 w-5 text-status-signal" />
              <span className="badge badge-outline bg-surface-ink px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                {item.status}
              </span>
            </div>
          </FeatureCard>
        ))}
      </SurfaceGrid>
    </>
  );
}
