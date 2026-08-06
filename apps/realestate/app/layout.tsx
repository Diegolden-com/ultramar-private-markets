import { siteDescription, siteDomain, siteName } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const themeInitializationScript = `
  (() => {
    const storageKey = "ultramar-real-estate-theme";
    const root = document.documentElement;

    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      const themeColor = theme === "light" ? "#eef2ea" : "#101512";
      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", themeColor));
    } catch {
      root.dataset.theme = "dark";
    }
  })();
`;

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteDomain),
  title: {
    default: `${siteName} | Propiedades seleccionadas`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#101512",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className={`${plexSans.variable} ${plexMono.variable} ${newsreader.variable}`}>
        {children}
      </body>
    </html>
  );
}
