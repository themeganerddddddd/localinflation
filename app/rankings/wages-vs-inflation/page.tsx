import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import RankingTable from "@/components/RankingTable";
import { percentChange } from "@/lib/calculations";
import { getAllMetros, getCpiSeries, getWageSeries } from "@/lib/data";
import { formatPercent } from "@/lib/formatters";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Wages vs Inflation Rankings", "Rank cities by the gap between wage growth and inflation.", "/rankings/wages-vs-inflation");

export default function WagesRankingPage() {
  const rows = getAllMetros().map((metro) => {
    const cpi = getCpiSeries(metro.slug);
    const wages = getWageSeries(metro.slug);
    const cpiStart = cpi[0];
    const cpiEnd = cpi.at(-1)!;
    const wageStart = wages[0];
    const wageEnd = wages.at(-1)!;
    const wageGrowth = percentChange(wageStart.wage, wageEnd.wage);
    const inflation = percentChange(cpiStart.index, cpiEnd.index);
    const gap = wageGrowth - inflation;
    return {
      slug: metro.slug,
      metro: metro.display_name,
      wageGrowth,
      inflation,
      gap,
      coverage: metro.data_coverage.replaceAll("_", " ")
    };
  }).sort((a, b) => b.gap - a.gap).map((row, index) => ({ ...row, rank: index + 1 }));

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Wages vs inflation rankings</h1>
        <p className="mt-3 text-lg text-slate-600">Compare nominal wage growth against price growth using available generated data.</p>
      </div>
      <RankingTable rows={rows} columns={[
        { header: "Rank", render: (row) => row.rank },
        { header: "Metro", render: (row) => row.metro },
        { header: "Wage growth", render: (row) => formatPercent(row.wageGrowth) },
        { header: "Inflation", render: (row) => formatPercent(row.inflation) },
        { header: "Wage-inflation gap", render: (row) => formatPercent(row.gap) },
        { header: "Data coverage", render: (row) => row.coverage }
      ]} />
      <AdSlot slotName="wages-vs-inflation-lower-body" />
    </main>
  );
}
