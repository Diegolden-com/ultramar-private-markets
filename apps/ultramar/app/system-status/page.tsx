import { BrandText } from "@/components/brand-name";
import { StatusToastPanel } from "@/components/daisyui-route-widgets";
import { JsonLd } from "@/components/json-ld";
import { PageHeader, PageShell, StatTile, SurfaceGrid, SurfacePanel } from "@/components/page-layout";
import { averageAbsoluteSpread, samplePositions, sampleSignals, totalExposure } from "@/lib/arbitrage";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { Activity, CircuitBoard, DatabaseZap, Radar, ShieldCheck } from "lucide-react";
import Link from "next/link";

const statusPath = "/system-status";
const description =
  "System status for Ultramar.capital availability, read-only reference feeds, arbitrage examples, private-equities data, and disclosures.";

const avgSpread = averageAbsoluteSpread(sampleSignals);
const exposure = totalExposure(samplePositions);

const statusItems = [
  {
    icon: Activity,
    name: "Website availability",
    status: "Operational",
    detail: "Product areas, research, disclosures, and public navigation are responding normally.",
    href: "/sitemap",
  },
  {
    icon: Radar,
    name: "Arbitrage signals",
    status: "Operational",
    detail: `${sampleSignals.length} reference signals available with an average absolute spread of ${avgSpread.toFixed(3)}.`,
    href: "/arbitrage-hedge-fund/signals",
  },
  {
    icon: DatabaseZap,
    name: "Portfolio data",
    status: "Operational",
    detail: `Read-only reference position data is available with modeled exposure of $${exposure.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}.`,
    href: "/api/private-equities/portfolio",
  },
  {
    icon: ShieldCheck,
    name: "Compliance materials",
    status: "Operational",
    detail: "Legal, compliance, and sitemap materials are available for reviewer reference.",
    href: "/compliance",
  },
] as const;

const incidents = [
  ["Open Incidents", "0"],
  ["Data Feeds", "4"],
  ["Disclosure Links", "3"],
  ["Status Mode", "Read-only"],
] as const;

export const metadata = createSeoMetadata({
  title: "System Status",
  description,
  path: statusPath,
  image: seoImages.platform,
  keywords: ["Ultramar system status", "capital platform uptime", "API status"],
  noIndex: true,
});

export default function SystemStatusPage() {
  return (
    <PageShell>
      <JsonLd
        id="system-status-json-ld"
        data={[
          webPageJsonLd({ path: statusPath, name: "Ultramar.capital System Status", description }),
          itemListJsonLd({
            path: statusPath,
            name: "Ultramar.capital status checks",
            description,
            items: statusItems.map((item) => ({
              name: item.name,
              url: item.href,
              description: item.detail,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "System Status", path: statusPath },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="System monitor"
        title="Availability and data status"
        description="A compact operating view for Ultramar availability, read-only data feeds, and disclosure access."
        asidePadded={false}
        asideClassName="grid grid-cols-1 gap-1 bg-border-muted sm:grid-cols-2"
      >
        {incidents.map(([label, value]) => (
          <StatTile key={label} label={label} value={value} tone="signal" />
        ))}
      </PageHeader>

      <SurfaceGrid bordered>
        {statusItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="card card-border grid gap-4 bg-surface p-5 transition-colors hover:bg-surface-container md:grid-cols-[48px_1fr_auto] md:items-center"
          >
            <item.icon className="h-5 w-5 text-status-signal" />
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.detail}</p>
            </div>
            <span className="badge badge-outline badge-success gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              <span className="status status-success" />
              {item.status}
            </span>
          </Link>
        ))}
      </SurfaceGrid>

      <StatusToastPanel />

      <SurfacePanel padded={false} className="p-6">
        <CircuitBoard className="h-5 w-5 text-status-signal" />
        <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface">
          Status scope
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-on-surface-variant">
          <BrandText>
            {
              "This status view reports availability for Ultramar.capital and its read-only data feeds. It is not a broker-dealer, custodian, bank, exchange, or production incident-management portal."
            }
          </BrandText>
        </p>
      </SurfacePanel>
    </PageShell>
  );
}
