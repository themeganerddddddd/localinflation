import { percentChange } from "@/lib/calculations";
import { getAllMetros, getCpiSeries, getWageSeries } from "@/lib/data";

export function inflationRankings(baseYear = 2019, comparisonYear = 2026) {
  return getAllMetros()
    .map((metro) => {
      const cpi = getCpiSeries(metro.slug);
      const start = cpi.find((point) => point.year === baseYear) ?? cpi[0];
      const end = cpi.find((point) => point.year === comparisonYear) ?? cpi.at(-1)!;
      return {
        slug: metro.slug,
        metro: metro.display_name,
        value: percentChange(start.index, end.index),
        coverage: metro.data_coverage
      };
    })
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function wageGapRankings(baseYear = 2019, comparisonYear = 2026) {
  return getAllMetros()
    .map((metro) => {
      const cpi = getCpiSeries(metro.slug);
      const wages = getWageSeries(metro.slug);
      const cpiStart = cpi.find((point) => point.year === baseYear) ?? cpi[0];
      const cpiEnd = cpi.find((point) => point.year === comparisonYear) ?? cpi.at(-1)!;
      const wageStart = wages.find((point) => point.year === baseYear) ?? wages[0];
      const wageEnd = wages.find((point) => point.year === comparisonYear) ?? wages.at(-1)!;
      return {
        slug: metro.slug,
        metro: metro.display_name,
        value: percentChange(wageStart.wage, wageEnd.wage) - percentChange(cpiStart.index, cpiEnd.index),
        coverage: metro.data_coverage
      };
    })
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}
