import { OracleConsole } from "@/components/oracle-console";
import { SectionHeader } from "@/components/section-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Equities Oracle",
  description: "Issuer accounting oracle and solvency proof workflow.",
  alternates: {
    canonical: "/private-equities/oracle",
  },
};

export default function OraclePage() {
  return (
    <main>
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Private Equities"
            title="Oracle"
            description="A bridge between issuer operating data and investor-facing private-market confidence."
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <OracleConsole />
      </section>
    </main>
  );
}
