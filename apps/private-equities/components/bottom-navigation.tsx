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
            href: "/equities",
            label: "EQUITIES",
            icon: LayoutGrid,
            isActive: pathname.startsWith("/equities"),
        },
        {
            href: "/portfolio",
            label: "PORTFOLIO",
            icon: BarChart3,
            isActive: pathname === "/portfolio",
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t-2 border-foreground z-50">
            <div className="grid grid-cols-4 h-14">
                {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleNavClick}
                            className={`flex flex-col items-center justify-center gap-0.5 font-mono text-xs transition-colors ${item.isActive ? "bg-foreground text-background" : "hover:bg-muted"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="tracking-wider">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
