"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return <>{children}</>
}
