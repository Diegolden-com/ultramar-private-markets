import { AppShell } from "@/components/app-shell";
import { canonicalDomain, platform } from "@ultramar/product-model";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalDomain),
  title: {
    default: "Ultramar.capital | Private Equities and Arbitrage Hedge Fund",
    template: "%s | Ultramar.capital",
  },
  description: platform.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ultramar.capital",
    description: platform.description,
    url: canonicalDomain,
    siteName: "Ultramar.capital",
    type: "website",
  },
  icons: {
    icon: "/icon-192.jpg",
    apple: "/icon-192.jpg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f7f2e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
