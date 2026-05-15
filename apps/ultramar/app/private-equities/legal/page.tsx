import { SectionHeader } from "@/components/section-header";
import { createSeoMetadata, seoImages } from "@/lib/seo";
import { BadgeCheck, ClipboardCheck, FileWarning, LockKeyhole, Scale, UserCheck } from "lucide-react";

export const metadata = createSeoMetadata({
  title: "Private Equities Legal",
  description: "Legal and compliance overview for Ultramar Private Equities.",
  path: "/private-equities/legal",
  image: seoImages.privateEquities,
  keywords: ["private equity compliance", "RWA legal", "investor eligibility"],
});

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow="Private Equities"
        title="Legal and compliance boundaries"
        description="The public product explains the intended operating model without implying unrestricted securities availability."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          {
            icon: Scale,
            title: "Regulated offering wrappers",
            body: "Production offerings require issuer-specific documents, appropriate exemptions or registrations, and legal review.",
          },
          {
            icon: BadgeCheck,
            title: "Investor eligibility",
            body: "Investor participation must be gated by KYC, accreditation or suitability, and jurisdictional transfer rules.",
          },
          {
            icon: LockKeyhole,
            title: "Transfer controls",
            body: "Private-market tokens need permissioning, lockups, whitelists, and custody controls before secondary trading.",
          },
          {
            icon: FileWarning,
            title: "No public solicitation shortcut",
            body: "Marketing copy must describe the platform and product workflow without making unmanaged return promises.",
          },
          {
            icon: ClipboardCheck,
            title: "Closing readiness",
            body: "Before a real closing, each issuer needs a final data room, approved term sheet, subscription package, funds-flow memo, and reporting calendar.",
          },
          {
            icon: UserCheck,
            title: "Gated diligence",
            body: "Investor materials should move behind access controls once they include issuer-specific financials, non-public data, or subscription instructions.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <item.icon className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 border border-destructive/30 bg-destructive/5 p-5">
        <FileWarning className="h-5 w-5 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">Capital acceptance boundary</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Ultramar public pages should not collect funds, publish subscription
          instructions, or treat expressions of interest as binding commitments.
          Those steps belong in a counsel-approved, investor-gated workflow.
        </p>
      </div>
    </main>
  );
}
