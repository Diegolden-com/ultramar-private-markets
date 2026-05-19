"use client";

import { LogIn, Menu, Monitor, X } from "lucide-react";
import { footerLinks } from "@/lib/footer-routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Equities", href: "/private-equities" },
  { label: "Arbitrage", href: "/arbitrage-hedge-fund" },
  { label: "Data Room", href: "/private-equities/assets/lcx" },
  { label: "Governance", href: "/arbitrage-hedge-fund/risk" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const authActive = pathname.startsWith("/auth");

  return (
    <div className="min-h-screen bg-surface-ink text-on-surface">
      <header className="sticky top-0 z-50 border-b border-border-muted bg-surface">
        <div className="navbar min-h-12 justify-between px-4 py-0 md:px-12">
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
              className="btn btn-outline btn-success btn-sm gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
            >
              <Monitor className="h-4 w-4" aria-hidden="true" />
              Terminal
            </Link>
            <Link
              href="/auth/login"
              aria-current={authActive ? "page" : undefined}
              className={`btn btn-sm gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
                authActive
                  ? "btn-success"
                  : "btn-ghost text-on-surface-variant hover:text-status-signal"
              }`}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign in
            </Link>
          </div>

          <button
            className="btn btn-square btn-ghost btn-sm border border-border-muted bg-surface-ink text-on-surface md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <nav className="border-t border-border-muted bg-surface md:hidden" aria-label="Mobile navigation">
            <ul className="menu grid p-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={mobileNavClass(isActiveNav(pathname, item.label))}
                    aria-current={isActiveNav(pathname, item.label) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/auth/login"
                  className={mobileNavClass(authActive)}
                  aria-current={authActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      {children}

      <footer className="footer border-t border-border-muted bg-surface-container-lowest px-4 py-8 md:px-12">
        <div className="flex w-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-xl font-bold text-on-surface">ULTRAMAR.CAPITAL</p>
            <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              (c)2024 Ultramar Capital Group. All rights reserved. Disclosures and controls.
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

function mobileNavClass(active: boolean) {
  return `rounded-none border-b border-border-muted px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] last:border-b-0 ${
    active
      ? "active !bg-status-signal !text-surface-ink"
      : "text-on-surface-variant hover:text-status-signal"
  }`;
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
          : "border-transparent text-on-surface-variant hover:text-status-signal"
      }`}
    >
      {label}
    </Link>
  );
}
