import { JsonLd } from "@/components/json-ld";
import {
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
        title="Read-only API"
        description="Reference feeds; no transaction endpoints."
      />

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
            </div>
            <code className="font-mono text-[11px] font-medium text-on-surface-variant">
              {endpoint.path}
            </code>
          </Link>
        ))}
      </SurfaceGrid>
    </PageShell>
  );
}
