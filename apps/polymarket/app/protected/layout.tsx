import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-border h-14">
          <div className="w-full max-w-5xl flex justify-between items-center px-6 text-sm">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-[0.2em]"
              >
                Ultramar
              </Link>
              <span className="text-xs text-muted-foreground">/</span>
              <Link
                href="/dashboard"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl px-6 py-4 w-full">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t border-border mx-auto text-center text-xs gap-8 py-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Ultramar
          </p>
        </footer>
      </div>
    </main>
  );
}
