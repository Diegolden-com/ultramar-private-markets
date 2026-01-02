import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { RegisterServiceWorker } from "./register-sw";

import { Navigation } from "@/components/navigation";
import { BottomNavigation } from "@/components/bottom-navigation";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
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
        className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          <Navigation />
          {children}
          <BottomNavigation />
          <RegisterServiceWorker />
        </Providers>
      </body>
    </html>
  );
}
