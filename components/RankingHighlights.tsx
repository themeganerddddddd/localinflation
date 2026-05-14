import Link from "next/link";
import { formatPercent } from "@/lib/formatters";
import { inflationRankings, wageGapRankings } from "@/lib/rankings";

export default function RankingHighlights() {
  const inflation = inflationRankings(2019, 2026).slice(0, 5);
  const wageGaps = wageGapRankings(2019, 2026).slice(0, 5);

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-950">Highest inflation</h2>
          <Link className="text-sm font-bold text-blue-800" href="/rankings/highest-inflation">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {inflation.map((row) => (
            <Link key={row.slug} className="flex items-center justify-between py-3 text-sm hover:text-blue-800" href={`/inflation-calculator/${row.slug}`}>
              <span className="font-semibold">{row.rank}. {row.metro}</span>
              <span className="font-bold">{formatPercent(row.value)}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-950">Highest wage growth vs inflation</h2>
          <Link className="text-sm font-bold text-blue-800" href="/rankings/wages-vs-inflation">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {wageGaps.map((row) => (
            <Link key={row.slug} className="flex items-center justify-between py-3 text-sm hover:text-blue-800" href={`/inflation-calculator/${row.slug}`}>
              <span className="font-semibold">{row.rank}. {row.metro}</span>
              <span className="font-bold">{formatPercent(row.value)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
