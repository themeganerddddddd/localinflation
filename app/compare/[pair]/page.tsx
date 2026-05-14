import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import { adjustForInflation, percentChange } from "@/lib/calculations";
import { getCpiSeries, getMetroBySlug, getPointByYear, getWageSeries } from "@/lib/data";
import { formatDollar, formatPercent } from "@/lib/formatters";
import { pageMetadata } from "@/lib/seo";

function parsePair(pair: string) {
  const [a, b] = pair.split("-vs-");
  return { a, b };
}

export function generateMetadata({ params }: { params: { pair: string } }): Metadata {
  const { a, b } = parsePair(params.pair);
  const metroA = getMetroBySlug(a);
  const metroB = getMetroBySlug(b);
  if (!metroA || !metroB) return {};
  return pageMetadata(`${metroA.display_name} vs ${metroB.display_name} Inflation Comparison`, `Compare inflation and wages in ${metroA.display_name} and ${metroB.display_name}.`, `/compare/${params.pair}`);
}

export default function ComparePairPage({ params }: { params: { pair: string } }) {
  const { a, b } = parsePair(params.pair);
  const metroA = getMetroBySlug(a);
  const metroB = getMetroBySlug(b);
  if (!metroA || !metroB) notFound();

  const amount = 100;
  const baseYear = 2010;
  const comparisonYear = 2026;
  const aCpi = getCpiSeries(a);
  const bCpi = getCpiSeries(b);
  const aStart = getPointByYear(aCpi, baseYear)!;
  const aEnd = getPointByYear(aCpi, comparisonYear)!;
  const bStart = getPointByYear(bCpi, baseYear)!;
  const bEnd = getPointByYear(bCpi, comparisonYear)!;
  const aWages = getWageSeries(a);
  const bWages = getWageSeries(b);
  const aWageGrowth = percentChange(getPointByYear(aWages, baseYear)!.wage, getPointByYear(aWages, comparisonYear)!.wage);
  const bWageGrowth = percentChange(getPointByYear(bWages, baseYear)!.wage, getPointByYear(bWages, comparisonYear)!.wage);
  const aInflation = percentChange(aStart.index, aEnd.index);
  const bInflation = percentChange(bStart.index, bEnd.index);
  const aGap = aWageGrowth - aInflation;
  const bGap = bWageGrowth - bInflation;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">{metroA.display_name} vs {metroB.display_name}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">A starter comparison for {formatDollar(amount)} from {baseYear} to {comparisonYear}. Full user-controlled comparisons can build on this route.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <ResultCard title={`${metroA.display_name} adjusted amount`} value={formatDollar(adjustForInflation(amount, aStart.index, aEnd.index))} />
        <ResultCard title={`${metroB.display_name} adjusted amount`} value={formatDollar(adjustForInflation(amount, bStart.index, bEnd.index))} />
        <ResultCard title="Price growth difference" value={formatPercent(aInflation - bInflation)} />
        <ResultCard title="Wage growth difference" value={formatPercent(aWageGrowth - bWageGrowth)} />
        <ResultCard title="Wage-inflation gap" value={`${metroA.display_name}: ${formatPercent(aGap)}`} detail={`${metroB.display_name}: ${formatPercent(bGap)}`} />
      </div>
    </main>
  );
}
