import metros from "@/data/metros.json";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";
import { getAvailableYears } from "@/lib/calculations";
import type { CpiPoint, Metro, WagePoint } from "@/lib/types";

const metroList = metros as Metro[];
const cpiSeries = cpi as Record<string, CpiPoint[]>;
const wageSeries = wages as Record<string, WagePoint[]>;

export function getAllMetros(): Metro[] {
  return metroList;
}

export function getMetroBySlug(slug: string): Metro | undefined {
  return metroList.find((metro) => metro.slug === slug);
}

export function getCpiSeries(slug: string): CpiPoint[] {
  return cpiSeries[slug] ?? [];
}

export function getWageSeries(slug: string): WagePoint[] {
  return wageSeries[slug] ?? [];
}

export function getAvailableYearsForMetro(slug: string): number[] {
  return getAvailableYears(getCpiSeries(slug));
}

export function getMetroSummary(slug: string) {
  const metro = getMetroBySlug(slug);
  if (!metro) return null;
  const years = getAvailableYearsForMetro(slug);
  return {
    metro,
    firstYear: years[0],
    latestYear: years[years.length - 1],
    dataCoverage: metro.data_coverage
  };
}

export function getNearbyMetros(slug: string): Metro[] {
  const metro = getMetroBySlug(slug);
  return metro?.nearby.map((nearbySlug) => getMetroBySlug(nearbySlug)).filter(Boolean) as Metro[] ?? [];
}

export function getPointByYear<T extends { year: number }>(series: T[], year: number): T | undefined {
  return series.find((point) => point.year === year);
}
