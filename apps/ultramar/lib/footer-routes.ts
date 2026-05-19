export const footerRouteItems = [
  { key: "compliance", label: "Compliance", href: "/compliance", changeFrequency: "yearly", priority: 0.45 },
  { key: "legal", label: "Legal", href: "/legal", changeFrequency: "yearly", priority: 0.4 },
  { key: "sitemap", label: "Sitemap", href: "/sitemap", changeFrequency: "monthly", priority: 0.35 },
  { key: "api", label: "API", href: "/api", changeFrequency: "monthly", priority: 0.35 },
  {
    key: "system-status",
    label: "System Status",
    href: "/system-status",
    changeFrequency: "daily",
    priority: 0.45,
  },
] as const;

export const footerLinks = footerRouteItems.map(({ label, href }) => ({ label, href }));

export const footerSitemapRoutes = footerRouteItems.map(({ href, changeFrequency, priority }) => ({
  path: href,
  changeFrequency,
  priority,
}));
