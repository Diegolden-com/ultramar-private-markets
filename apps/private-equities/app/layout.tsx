import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { RegisterServiceWorker } from "./register-sw";

import { Navigation } from "@/components/navigation";
import { BottomNavigation } from "@/components/bottom-navigation";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ultramar Private Equities",
  description: "Private Equity Management",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.jpg",
    apple: "/icon-192.jpg",
  },
};

export const viewport = {
  themeColor: "#0c4a6e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body
          className={`${dmSans.variable} ${jetBrainsMono.variable} ${playfair.variable} font-sans antialiased`}
        >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <div className="flex-1">
              {children}
            </div>
            <footer className="border-t border-foreground/10 py-8 text-center pb-24 md:pb-8">
              <p className="font-mono text-xs text-muted-foreground">
                ULTRAMAR PRIVATE EQUITIES © {new Date().getFullYear()}
              </p>
            </footer>
          </div>
          <BottomNavigation />
          <RegisterServiceWorker />
        </Providers>
      </body>
    </html>
  );
}
