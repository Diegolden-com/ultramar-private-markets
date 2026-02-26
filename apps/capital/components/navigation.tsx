"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "./theme-provider"
import { OakLeafLogo } from "./oak-leaf-logo"

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const walletAddress = "0x1234...5678"
  const network = "Arbitrum"

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <OakLeafLogo className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
            <span className="text-xl md:text-2xl font-serif font-semibold tracking-wide">
              ULTRAMAR CAPITAL
            </span>
          </Link>
          {/* </CHANGE> */}

          <div className="hidden md:flex gap-8 items-center">
            <Link
              href="/"
              className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname === "/" ? "text-accent" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/app"
              className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname.startsWith("/app") ? "text-accent" : ""}`}
            >
              App
            </Link>
            <Link
              href="/dashboard"
              className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname === "/dashboard" ? "text-accent" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              href="/info"
              className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname.startsWith("/info") ? "text-accent" : ""}`}
            >
              Info
            </Link>
            <button
              onClick={toggleTheme}
              className="border border-border p-2 hover:bg-muted hover:border-accent transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="relative group/wallet">
              <button
                className="border border-border p-3 hover:bg-muted hover:border-accent transition-all flex items-center justify-center"
                aria-label="Wallet status"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 border border-border bg-card p-4 opacity-0 invisible group-hover/wallet:opacity-100 group-hover/wallet:visible transition-all duration-200 z-50 shadow-lg">
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
            <button
              onClick={toggleTheme}
              className="border border-border p-2 hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </button>
            <div className="relative group/wallet-mobile">
              <button
                className="border border-border p-2 hover:bg-muted transition-colors flex items-center justify-center active:bg-muted"
                aria-label="Wallet status"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 border border-border bg-card p-3 opacity-0 invisible group-hover/wallet-mobile:opacity-100 group-hover/wallet-mobile:visible group-active/wallet-mobile:opacity-100 group-active/wallet-mobile:visible transition-all duration-200 z-50 pointer-events-none shadow-lg">
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
      </div>
    </nav>
  )
}
