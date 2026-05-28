"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "./theme-provider"
import { BrandName } from "./brand-name"
import { OakLeafLogo } from "./oak-leaf-logo"
import { ultramarSuiteLinks } from "@/lib/ultramar-apps"

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const walletAddress = "0x1234...5678"
  const network = "Arbitrum"

  return (
    <nav className="navbar border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <OakLeafLogo className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
            <span className="text-xl md:text-2xl font-serif font-semibold tracking-wide">
              <BrandName />
            </span>
          </Link>
          {/* </CHANGE> */}

          <div className="hidden md:flex gap-3 items-center">
            <Link
              href="/"
              className={`btn btn-ghost btn-sm font-mono text-xs uppercase tracking-widest ${pathname === "/" ? "btn-active text-accent" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/app"
              className={`btn btn-ghost btn-sm font-mono text-xs uppercase tracking-widest ${pathname.startsWith("/app") ? "btn-active text-accent" : ""}`}
            >
              App
            </Link>
            <Link
              href="/dashboard"
              className={`btn btn-ghost btn-sm font-mono text-xs uppercase tracking-widest ${pathname === "/dashboard" ? "btn-active text-accent" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              href="/info"
              className={`btn btn-ghost btn-sm font-mono text-xs uppercase tracking-widest ${pathname.startsWith("/info") ? "btn-active text-accent" : ""}`}
            >
              Info
            </Link>
            <div className="h-5 w-px bg-border" />
            {ultramarSuiteLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="badge badge-outline font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <button onClick={toggleTheme} className="btn btn-square btn-ghost btn-sm border border-border" aria-label="Toggle dark mode">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="dropdown dropdown-end">
              <button
                className="indicator btn btn-square btn-ghost btn-sm border border-border"
                aria-label="Wallet status"
              >
                <span className="indicator-item status status-success" />
                <div className="status status-success" />
              </button>
              <div className="dropdown-content card card-border z-50 mt-2 w-64 bg-card p-4 shadow-lg">
                <p className="font-mono text-xs mb-2">
                  La Wallet <span className="font-semibold">{walletAddress}</span> está conectada correctamente
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Red: <span className="text-accent">{network}</span>
                </p>
              </div>
            </div>
            {/* </CHANGE> */}
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggleTheme} className="btn btn-square btn-ghost btn-sm border border-border" aria-label="Toggle dark mode">
              {theme === "light" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </button>
            <div className="dropdown dropdown-end">
              <button
                className="indicator btn btn-square btn-ghost btn-sm border border-border"
                aria-label="Wallet status"
              >
                <span className="indicator-item status status-success" />
                <div className="status status-success" />
              </button>
              <div className="dropdown-content card card-border z-50 mt-2 w-56 bg-card p-3 shadow-lg">
                <p className="font-mono text-xs mb-2">
                  La Wallet <span className="font-semibold">{walletAddress}</span> está conectada correctamente
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Red: <span className="text-accent">{network}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-4 overflow-x-auto md:hidden">
          {ultramarSuiteLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
