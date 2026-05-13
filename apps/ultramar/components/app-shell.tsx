"use client";

import { primaryNav, products } from "@ultramar/product-model";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-foreground bg-foreground text-xs font-semibold text-background">
              U
            </span>
            <span className="truncate font-serif text-lg font-semibold tracking-tight">
              Ultramar.capital
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/private-equities/assets"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
            >
              Explore
            </Link>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-md border border-border md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            <div className="grid gap-2">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-semibold">Ultramar.capital</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-background/70">
              One capital platform, two product lines: private-market access and
              Polymarket-first arbitrage fund infrastructure.
            </p>
          </div>
          {products.map((product) => (
            <div key={product.slug}>
              <Link href={product.href} className="font-semibold hover:text-accent">
                {product.name}
              </Link>
              <p className="mt-2 text-sm leading-6 text-background/65">
                {product.shortDescription}
              </p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
