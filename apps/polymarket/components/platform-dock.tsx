"use client";

import { Gauge, Home, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dockLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Signals", icon: Gauge },
  { href: "/auth/login", label: "Login", icon: LogIn },
  { href: "/auth/sign-up", label: "Join", icon: UserPlus },
];

export function PlatformDock() {
  const pathname = usePathname();

  return (
    <nav className="dock dock-sm z-50 border-t border-border bg-background/95 text-muted-foreground shadow-[0_-8px_24px_rgba(0,0,0,0.18)] backdrop-blur md:hidden">
      {dockLinks.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "dock-active text-foreground" : undefined}
            aria-label={item.label}
          >
            <Icon className="h-4 w-4" />
            <span className="dock-label text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
