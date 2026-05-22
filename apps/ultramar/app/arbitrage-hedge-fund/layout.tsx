import { PageShell } from "@/components/page-layout";
import type { ReactNode } from "react";

export default function ArbitrageHedgeFundLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell maxWidth="wide" className="terminal-grid">
      {children}
    </PageShell>
  );
}
