import { PageShell } from "@/components/page-layout";
import type { ReactNode } from "react";

export default function ResearchLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
