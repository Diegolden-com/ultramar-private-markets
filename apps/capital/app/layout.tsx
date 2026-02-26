import type React from "react"
import type { Metadata } from "next"
import { Space_Mono, Inter, Playfair_Display } from 'next/font/google'
// </CHANGE>
import { Analytics } from "@vercel/analytics/next"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})
// </CHANGE>

export const metadata: Metadata = {
  title: "Ultramar Capital - DeFi Investment Strategies",
  description: "Invest in DeFi strategies with Ultramar Capital",
  generator: "v0.app",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.jpg" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="theme-color" content="#0c4a6e" />
      </head>
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans antialiased pb-16 md:pb-0`}>
      {/* </CHANGE> */}
        <ThemeProvider>
          {children}
          <BottomNavigation />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
