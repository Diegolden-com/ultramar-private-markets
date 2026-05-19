export const footerLinks = [
  { label: "Compliance", href: "/compliance" },
  { label: "Legal", href: "/legal" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "API", href: "/api" },
  { label: "System Status", href: "/system-status" },
] as const;

export const footerSitemapRoutes = [
  { path: "/compliance", changeFrequency: "yearly", priority: 0.45 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.4 },
  { path: "/sitemap", changeFrequency: "monthly", priority: 0.35 },
  { path: "/api", changeFrequency: "monthly", priority: 0.35 },
  { path: "/system-status", changeFrequency: "daily", priority: 0.45 },
] as const;
