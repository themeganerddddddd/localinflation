import type { MetadataRoute } from "next";
import { getAllMetros } from "@/lib/data";
import { buildCanonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/inflation-calculator",
    "/inflation-calculator/united-states",
    "/oil-price-inflation-simulator",
    "/wage-vs-inflation",
    "/future-costs",
    "/cities",
    "/rankings",
    "/rankings/highest-inflation",
    "/rankings/wages-vs-inflation",
    "/compare",
    "/methodology",
    "/about",
    "/privacy",
    "/terms",
    "/salary-inflation-calculator",
    "/city-inflation-calculator",
    "/future-cost-calculator"
  ];
  const metroRoutes = getAllMetros().flatMap((metro) => [
    `/inflation-calculator/${metro.slug}`,
    `/wage-vs-inflation/${metro.slug}`,
    `/future-costs/${metro.slug}`
  ]);
  return Array.from(new Set([...staticRoutes, ...metroRoutes])).map((route) => ({
    url: buildCanonicalUrl(route),
    lastModified: new Date()
  }));
}
