import { JsonLd } from "@/components/json-ld";
import { ApiMockupPanel } from "@/components/daisyui-route-widgets";
import {
  FeatureCard,
  PageHeader,
  PageShell,
  SurfaceGrid,
} from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { Database, Gauge, RadioTower, ShieldCheck } from "lucide-react";
import Link from "next/link";

const apiPath = "/api";
const description =
  "Developer reference for read-only Ultramar data examples covering arbitrage signals, positions, private-equities portfolio snapshots, and issuer oracle scores.";

const endpoints = [
  {
    method: "GET",
    path: "/api/arbitrage/signals",
    title: "Arbitrage signals",
    body: "Illustrative Polymarket-first signal feed with implied probability, model probability, spread, confidence, and status fields.",
  },
  {
    method: "GET",
    path: "/api/arbitrage/positions",
    title: "Arbitrage positions",
    body: "Illustrative read-only position inventory for allocator exposure and hedge review.",
  },
  {
    method: "GET",
    path: "/api/private-equities/portfolio",
    title: "Private-equities portfolio",
    body: "Illustrative portfolio summary for tokenized private-market asset balances, prices, values, and day-change data.",
  },
  {
    method: "GET",
    path: "/api/private-equities/oracle/score",
    title: "Oracle score",
    body: "Sandbox issuer oracle score for solvency, liquidity, and operating-data freshness checks.",
  },
] as const;

const principles = [
  {
    icon: ShieldCheck,
    title: "Read-only by default",
    body: "The listed endpoints expose non-transactional data only. Investor, issuer, and admin actions require controlled access.",
  },
  {
    icon: Gauge,
    title: "Product-specific data",
    body: "Endpoint paths are separated by product line so integrations can distinguish arbitrage data from private-market data.",
  },
  {
    icon: RadioTower,
    title: "Operational status",
    body: "Data availability should be reviewed alongside system status instead of inferred from one screen.",
  },
] as const;

export const metadata = createSeoMetadata({
  title: "API",
  description,
  path: apiPath,
  image: seoImages.platform,
  keywords: ["Ultramar API", "capital platform API", "Polymarket signals API", "issuer oracle API"],
  noIndex: true,
});

export default function ApiPage() {
  return (
    <PageShell>
      <JsonLd
        id="api-json-ld"
        data={[
          webPageJsonLd({ path: apiPath, name: "Ultramar.capital API", description }),
          itemListJsonLd({
            path: apiPath,
            name: "Ultramar.capital public API endpoints",
            description,
            items: endpoints.map((endpoint) => ({
              name: endpoint.title,
              url: endpoint.path,
              description: endpoint.body,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "API", path: apiPath },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Developer data"
        title="Read-only data examples"
        description="The API index groups Ultramar's non-transactional reference feeds for developers, reviewers, and internal operators."
      >
        <Database className="h-5 w-5 text-status-signal" />
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">
          These endpoints are public read-only references. Production integrations should expect authentication,
          rate limits, contractual terms, and product-specific permissions.
        </p>
      </PageHeader>

      <SurfaceGrid bordered>
        {endpoints.map((endpoint) => (
          <Link
            key={endpoint.path}
            href={endpoint.path}
            className="card card-border grid gap-4 bg-surface p-5 transition-colors hover:bg-surface-container md:grid-cols-[160px_1fr_auto] md:items-center"
          >
            <div>
              <span className="badge badge-outline badge-success px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                {endpoint.method}
              </span>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                {endpoint.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{endpoint.body}</p>
            </div>
            <code className="font-mono text-[11px] font-medium text-on-surface-variant">
              {endpoint.path}
            </code>
          </Link>
        ))}
      </SurfaceGrid>

      <ApiMockupPanel />

      <SurfaceGrid columns="md:grid-cols-3">
        {principles.map((principle) => (
          <FeatureCard
            key={principle.title}
            icon={principle.icon}
            title={principle.title}
            body={principle.body}
          />
        ))}
      </SurfaceGrid>
    </PageShell>
  );
}
