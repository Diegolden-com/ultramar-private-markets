import { PageShell } from "@/components/page-layout";
import type { ReactNode } from "react";

export default function PrivateEquitiesLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
