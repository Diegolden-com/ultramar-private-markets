import { BrandText } from "@/components/brand-name";
import { CapitalIntakeForm, ComplianceModal } from "@/components/daisyui-route-widgets";
import { JsonLd } from "@/components/json-ld";
import {
  FeatureCard,
  PageHeader,
  PageShell,
  SplitPanel,
  StatTile,
  SurfaceGrid,
} from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { BadgeCheck, ClipboardCheck, FileCheck2, LockKeyhole, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";

const compliancePath = "/compliance";
const description =
  "Compliance operating boundaries for Ultramar.capital, including investor gating, issuer diligence, transfer controls, and public-site limitations.";

const controls = [
  {
    icon: BadgeCheck,
    title: "Investor eligibility",
    body: "Access to private-market workflows must be gated by KYC, KYB where relevant, suitability, jurisdiction, and offering-specific eligibility checks.",
  },
  {
    icon: FileCheck2,
    title: "Issuer diligence",
    body: "Issuer pages distinguish public product education from gated diligence files, subscription materials, financial data, and investor-only Q&A.",
  },
  {
    icon: LockKeyhole,
    title: "Transfer restrictions",
    body: "Permissioning, lockups, whitelists, custody policies, and jurisdiction controls remain part of the product boundary before any secondary activity.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit trail",
    body: "Product workflows should leave a reviewable record of disclosures, status changes, eligibility decisions, document updates, and investor communications.",
  },
  {
    icon: Scale,
    title: "Counsel review",
    body: "Offering structure, investor language, funds-flow instructions, and closing documents require issuer-specific legal review before use.",
  },
  {
    icon: ShieldCheck,
    title: "No public acceptance",
    body: "Public pages can describe workflows and asset readiness, but they should not accept funds or treat interest as a binding investment commitment.",
  },
] as const;

const metrics = [
  ["Public Funds Acceptance", "Disabled"],
  ["Investor Workflow", "Gated"],
  ["Issuer Materials", "Scoped"],
  ["Transfer Controls", "Required"],
] as const;

export const metadata = createSeoMetadata({
  title: "Compliance",
  description,
  path: compliancePath,
  image: seoImages.platform,
  keywords: ["Ultramar compliance", "private market compliance", "investor eligibility"],
});

export default function CompliancePage() {
  return (
    <PageShell>
      <JsonLd
        id="compliance-json-ld"
        data={[
          webPageJsonLd({ path: compliancePath, name: "Ultramar.capital Compliance", description }),
          itemListJsonLd({
            path: compliancePath,
            name: "Ultramar.capital compliance controls",
            description,
            items: controls.map((control) => ({
              name: control.title,
              url: compliancePath,
              description: control.body,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Compliance", path: compliancePath },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Compliance registry"
        title="Control surface for gated capital workflows"
        description="The public interface is intentionally constrained. Product pages can explain readiness, but regulated steps stay behind eligibility, counsel, and document controls."
        asidePadded={false}
        asideClassName="grid grid-cols-1 gap-1 bg-border-muted sm:grid-cols-2"
      >
        {metrics.map(([label, value]) => (
          <StatTile key={label} label={label} value={value} tone="signal" />
        ))}
      </PageHeader>

      <SurfaceGrid columns="md:grid-cols-2 xl:grid-cols-3">
        {controls.map((control) => (
          <FeatureCard
            key={control.title}
            icon={control.icon}
            title={control.title}
            body={control.body}
          />
        ))}
      </SurfaceGrid>

      <CapitalIntakeForm />

      <SplitPanel
        columns="lg:grid-cols-[0.9fr_1.1fr]"
        contentPadded={false}
        asidePadded={false}
        contentClassName="p-6"
        asideClassName="p-6"
        aside={
          <>
            <p className="text-sm leading-6 text-on-surface-variant">
              <BrandText>
                {
                  "Ultramar.capital separates public education from transaction mechanics. Any issuer-specific offer, investor allocation, closing instruction, subscription package, or transfer event belongs in a controlled workflow with legal review and access checks."
                }
              </BrandText>
            </p>
            <Link
              href="/private-equities/legal"
              className="btn btn-outline btn-success mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
            >
              View private-equities legal gate
            </Link>
          </>
        }
      >
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Product boundary
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
          Compliance is a workflow constraint, not a marketing claim.
        </h2>
      </SplitPanel>

      <ComplianceModal />
    </PageShell>
  );
}
