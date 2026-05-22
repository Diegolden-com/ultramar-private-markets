export const footerRouteItems = [
  { key: "compliance", label: "Compliance", href: "/compliance", changeFrequency: "yearly", priority: 0.45 },
  { key: "legal", label: "Legal", href: "/legal", changeFrequency: "yearly", priority: 0.4 },
  { key: "sitemap", label: "Sitemap", href: "/sitemap", changeFrequency: "monthly", priority: 0.35 },
] as const;

export const footerLinks = footerRouteItems.map(({ label, href }) => ({ label, href }));
