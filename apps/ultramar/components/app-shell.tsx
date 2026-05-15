"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Equities", href: "/private-equities" },
  { label: "Arbitrage", href: "/arbitrage-hedge-fund" },
  { label: "Data Room", href: "/private-equities/assets/lcx" },
  { label: "Governance", href: "/arbitrage-hedge-fund/risk" },
] as const;

const footerLinks = [
  { label: "Compliance", href: "/private-equities/legal" },
  { label: "Legal", href: "/private-equities/legal" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "API", href: "/api/arbitrage/signals" },
  { label: "System Status", href: "/arbitrage-hedge-fund/signals" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-ink text-on-surface">
      <header className="sticky top-0 z-50 border-b border-border-muted bg-surface">
        <div className="flex h-12 items-center justify-between px-4 md:px-12">
          <div className="flex min-w-0 items-center gap-6 md:gap-8">
            <Link
              href="/"
              className="truncate font-serif text-xl font-bold leading-none text-on-surface"
              onClick={() => setOpen(false)}
            >
              ULTRAMAR.CAPITAL
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <TerminalNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActiveNav(pathname, item.label)}
                />
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/private-equities/assets"
              className="border border-on-surface bg-surface-ink px-4 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface transition-colors hover:border-status-signal hover:bg-status-signal hover:text-white"
            >
              Terminal Access
            </Link>
            <Link
              href="/auth/login"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant transition-colors hover:text-primary"
            >
              Auth
            </Link>
          </div>

          <button
            className="grid h-9 w-9 place-items-center border border-border-muted bg-surface-ink text-on-surface md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <nav className="grid border-t border-border-muted bg-surface md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-border-muted px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant last:border-b-0"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="border-t border-border-muted px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface"
              onClick={() => setOpen(false)}
            >
              Auth
            </Link>
          </nav>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-border-muted bg-surface-container-lowest px-4 py-8 md:px-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-xl font-bold text-on-surface">ULTRAMAR.CAPITAL</p>
            <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              (c)2024 Ultramar Capital Group. All rights reserved. Regulated entity.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant underline transition-colors hover:text-status-signal"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function isActiveNav(pathname: string, label: (typeof navItems)[number]["label"]) {
  if (label === "Data Room") return pathname.startsWith("/private-equities/assets");
  if (label === "Governance") return pathname.startsWith("/arbitrage-hedge-fund/risk");
  if (label === "Equities") {
    return pathname.startsWith("/private-equities") && !pathname.startsWith("/private-equities/assets");
  }
  return pathname.startsWith("/arbitrage-hedge-fund") && !pathname.startsWith("/arbitrage-hedge-fund/risk");
}

function TerminalNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border-b-2 pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
        active
          ? "border-status-signal text-status-signal"
          : "border-transparent text-on-surface-variant hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}
