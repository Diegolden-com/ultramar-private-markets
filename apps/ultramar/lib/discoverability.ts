import { deals } from "@/lib/deals";
import { pressArticles } from "@/lib/press";
import { researchArticles } from "@/lib/research";
import {
  platformRouteGroup,
  productOverviewRouteGroup,
  productRouteGroups,
  type SiteNavLink,
  type SiteRouteGroup,
} from "@/lib/site-navigation";

export const lastSignificantUpdate = new Date("2026-05-28T00:00:00.000Z");

const platformIndexableKeys = new Set(["home", "research", "press", "compliance", "legal", "sitemap"]);
const privateEquitiesExcludedKeys = new Set(["overview", "portfolio"]);
const arbitrageExcludedKeys = new Set(["overview"]);

function routeToSitemapPath(route: SiteNavLink) {
  return route.href === "/" ? "" : route.href;
}

export const platformIndexableRoutes = platformRouteGroup.links.filter((route) =>
  platformIndexableKeys.has(route.key),
);

export const privateEquitiesIndexableRoutes = productRouteGroups["private-equities"].links.filter(
  (route) => !privateEquitiesExcludedKeys.has(route.key),
);

export const arbitrageIndexableRoutes = productRouteGroups["arbitrage-hedge-fund"].links.filter(
  (route) => !arbitrageExcludedKeys.has(route.key),
);

export const assetIndexableRoutes: SiteNavLink[] = deals.map((deal) => ({
  key: `asset-${deal.ticker}`,
  label: `${deal.name} (${deal.ticker})`,
  href: `/private-equities/assets/${deal.ticker}`,
  description: `Private-market asset route for ${deal.name}.`,
  changeFrequency: "weekly",
  priority: 0.7,
}));

export const researchIndexableRoutes: SiteNavLink[] = researchArticles.map((article) => ({
  key: `research-${article.slug}`,
  label: article.title,
  href: `/research/${article.slug}`,
  description: article.description,
  changeFrequency: "monthly",
  priority: 0.78,
}));

export const pressIndexableRoutes: SiteNavLink[] = pressArticles.map((article) => ({
  key: `press-${article.slug}`,
  label: article.title,
  href: `/press/${article.slug}`,
  description: article.description,
  changeFrequency: "monthly",
  priority: 0.8,
}));

export const indexableRouteGroups: SiteRouteGroup[] = [
  {
    title: platformRouteGroup.title,
    links: platformIndexableRoutes,
  },
  productOverviewRouteGroup,
  {
    title: productRouteGroups["private-equities"].title,
    links: [...privateEquitiesIndexableRoutes, ...assetIndexableRoutes],
  },
  {
    title: productRouteGroups["arbitrage-hedge-fund"].title,
    links: arbitrageIndexableRoutes,
  },
  {
    title: "Research Memos",
    links: researchIndexableRoutes,
  },
  {
    title: "Press Articles",
    links: pressIndexableRoutes,
  },
];

export const indexableSitemapRoutes = indexableRouteGroups.flatMap((group) =>
  group.links.map((route) => ({
    path: routeToSitemapPath(route),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  })),
);
