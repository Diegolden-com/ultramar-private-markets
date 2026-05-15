import { AppShell } from "@/components/app-shell";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, seoImages, websiteJsonLd } from "@/lib/seo";
import { canonicalDomain, platform } from "@ultramar/product-model";
import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#07080a" },
  ],
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("ultramar-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (_) {}
})();
`;

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
        <Script
          id="ultramar-theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <JsonLd id="organization-json-ld" data={organizationJsonLd()} />
        <JsonLd id="website-json-ld" data={websiteJsonLd()} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
