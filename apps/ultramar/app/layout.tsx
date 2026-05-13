import { AppShell } from "@/components/app-shell";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
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
    images: [
      {
        url: "/abstract-financial-growth-chart-geometric-shapes.jpg",
        width: 1200,
        height: 630,
        alt: "Ultramar.capital institutional platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultramar.capital",
    description: platform.description,
    images: ["/abstract-financial-growth-chart-geometric-shapes.jpg"],
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
        <JsonLd id="organization-json-ld" data={organizationJsonLd()} />
        <JsonLd id="website-json-ld" data={websiteJsonLd()} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
