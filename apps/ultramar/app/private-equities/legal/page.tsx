import { SectionHeader } from "@/components/section-header";
import { BadgeCheck, FileWarning, LockKeyhole, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Equities Legal",
  description: "Legal and compliance overview for Ultramar Private Equities.",
  alternates: {
    canonical: "/private-equities/legal",
  },
};

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
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <item.icon className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
