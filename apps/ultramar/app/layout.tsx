import { AppShell } from "@/components/app-shell";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, seoImages, websiteJsonLd } from "@/lib/seo";
import { canonicalDomain, platform } from "@ultramar/product-model";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
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
    images: [seoImages.platform],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultramar.capital",
    description: platform.description,
    images: [seoImages.platform.url],
  },
  icons: {
    icon: "/icon-192.jpg",
    apple: "/icon-192.jpg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="ultramar">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <JsonLd id="organization-json-ld" data={organizationJsonLd()} />
        <JsonLd id="website-json-ld" data={websiteJsonLd()} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
