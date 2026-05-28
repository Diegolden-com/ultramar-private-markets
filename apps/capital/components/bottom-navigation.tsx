"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, BarChart3, Info } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "HOME",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/app",
      label: "APP",
      icon: LayoutGrid,
      isActive: pathname.startsWith("/app"),
    },
    {
      href: "/dashboard",
      label: "DASHBOARD",
      icon: BarChart3,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/info",
      label: "INFO",
      icon: Info,
      isActive: pathname.startsWith("/info"),
    },
  ]

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <nav className="dock dock-sm md:hidden border-t-2 border-foreground bg-background">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className={`font-mono text-xs ${item.isActive ? "dock-active text-accent" : ""}`}
          >
            <Icon className="w-5 h-5" />
            <span className="dock-label tracking-wider">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
