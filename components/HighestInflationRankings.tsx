"use client";

import { useMemo, useState } from "react";
import RankingTable from "@/components/RankingTable";
import { percentChange } from "@/lib/calculations";
import { formatPercent } from "@/lib/formatters";
import type { CpiPoint, Metro } from "@/lib/types";

type HighestInflationRankingsProps = {
  metros: Metro[];
  cpiBySlug: Record<string, CpiPoint[]>;
};

export default function HighestInflationRankings({ metros, cpiBySlug }: HighestInflationRankingsProps) {
  const allYears = Array.from(new Set(Object.values(cpiBySlug).flatMap((series) => series.map((point) => point.year)))).sort((a, b) => a - b);
  const latestCommonYear = Math.max(...allYears);
  const [baseYear, setBaseYear] = useState(allYears.includes(2020) ? 2020 : allYears[0]);

  const rows = useMemo(() => metros.map((metro) => {
    const series = cpiBySlug[metro.slug] ?? [];
    const latest = series.at(-1);
    const since2019 = series.find((point) => point.year === 2019);
    const since2020 = series.find((point) => point.year === 2020);
    const selectedBase = series.find((point) => point.year === baseYear);
    return {
      slug: metro.slug,
      metro: metro.display_name,
      since2019: latest && since2019 ? percentChange(since2019.index, latest.index) : 0,
      since2020: latest && since2020 ? percentChange(since2020.index, latest.index) : 0,
      selected: latest && selectedBase ? percentChange(selectedBase.index, latest.index) : null,
      latestYear: latest?.year ?? latestCommonYear,
      coverage: metro.data_coverage.replaceAll("_", " ")
    };
  }).sort((a, b) => (b.selected ?? -Infinity) - (a.selected ?? -Infinity)).map((row, index) => ({ ...row, rank: index + 1 })), [baseYear, cpiBySlug, latestCommonYear, metros]);

  return (
    <section className="grid gap-4">
      <label className="max-w-xs text-sm font-semibold text-slate-800">
        Select base year
        <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={baseYear} onChange={(event) => setBaseYear(Number(event.target.value))}>
          {allYears.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </label>
      <RankingTable rows={rows} columns={[
        { header: "Rank", render: (row) => row.rank },
        { header: "Metro", render: (row) => row.metro },
        { header: "Inflation since 2019", render: (row) => formatPercent(row.since2019) },
        { header: "Inflation since 2020", render: (row) => formatPercent(row.since2020) },
        { header: `Inflation since ${baseYear}`, render: (row) => row.selected === null ? "Unavailable" : formatPercent(row.selected) },
        { header: "Latest CPI year", render: (row) => row.latestYear },
        { header: "Data coverage", render: (row) => row.coverage }
      ]} />
    </section>
  );
}
