import type { MetadataRoute } from "next";
import { getAllMetros } from "@/lib/data";
import { buildCanonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/inflation-calculator", "/oil-price-inflation-simulator", "/wage-vs-inflation", "/future-costs", "/cities", "/rankings", "/rankings/highest-inflation", "/rankings/wages-vs-inflation", "/compare", "/methodology", "/about", "/privacy", "/terms"];
  const metroRoutes = getAllMetros().flatMap((metro) => [
    `/inflation-calculator/${metro.slug}`,
    `/wage-vs-inflation/${metro.slug}`,
    `/future-costs/${metro.slug}`
  ]);
  return [...staticRoutes, ...metroRoutes].map((route) => ({
    url: buildCanonicalUrl(route),
    lastModified: new Date()
  }));
}
