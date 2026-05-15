"use client";

import { useMemo, useState } from "react";
import AmountInput from "@/components/AmountInput";
import CostChart from "@/components/CostChart";
import FutureCostIndex from "@/components/FutureCostIndex";
import MetroSelector from "@/components/MetroSelector";
import PlainEnglishExplanation from "@/components/PlainEnglishExplanation";
import QuickExamples from "@/components/QuickExamples";
import ResultCard from "@/components/ResultCard";
import WageComparison from "@/components/WageComparison";
import WageCharts from "@/components/WageCharts";
import YearSelector from "@/components/YearSelector";
import { adjustForInflation, buildFutureScenarios, getAvailableYears, getNearestAvailableYear, percentChange } from "@/lib/calculations";
import { formatDollar, formatPercent } from "@/lib/formatters";
import { inflationRankings, wageGapRankings } from "@/lib/rankings";
import type { CpiPoint, Metro, WagePoint } from "@/lib/types";

type CalculatorProps = {
  metros: Metro[];
  initialSlug: string;
  cpiBySlug: Record<string, CpiPoint[]>;
  wagesBySlug: Record<string, WagePoint[]>;
  showLocationSelector?: boolean;
};

export default function Calculator({ metros, initialSlug, cpiBySlug, wagesBySlug, showLocationSelector = true }: CalculatorProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [amount, setAmount] = useState(100);
  const cpiValues = cpiBySlug[slug] ?? [];
  const wageValues = wagesBySlug[slug] ?? [];
  const availableYears = useMemo(() => getAvailableYears(cpiValues), [cpiValues]);
  const latestYear = availableYears[availableYears.length - 1] ?? 2026;
  const defaultStartYear = availableYears.includes(2010) ? 2010 : availableYears[0] ?? 2010;
  const [baseYear, setBaseYear] = useState(defaultStartYear);
  const [comparisonYear, setComparisonYear] = useState(latestYear);

  const safeBaseYear = availableYears.includes(baseYear) ? baseYear : getNearestAvailableYear(baseYear, availableYears);
  const safeComparisonYear = availableYears.includes(comparisonYear) ? comparisonYear : getNearestAvailableYear(comparisonYear, availableYears);
  const cpiStart = cpiValues.find((point) => point.year === safeBaseYear);
  const cpiEnd = cpiValues.find((point) => point.year === safeComparisonYear);
  const wageStart = wageValues.find((point) => point.year === safeBaseYear);
  const wageEnd = wageValues.find((point) => point.year === safeComparisonYear);
  const selectedMetro = metros.find((metro) => metro.slug === slug);

  if (!cpiStart || !cpiEnd || !availableYears.length) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950">
        CPI data for this location is not available yet.
      </div>
    );
  }

  const adjusted = adjustForInflation(amount, cpiStart.index, cpiEnd.index);
  const priceChange = percentChange(cpiStart.index, cpiEnd.index);
  const inflationRank = inflationRankings(safeBaseYear, safeComparisonYear).find((row) => row.slug === slug);
  const wageRank = wageGapRankings(safeBaseYear, safeComparisonYear).find((row) => row.slug === slug);
  const futureTarget = latestYear >= 2030 ? latestYear + 5 : 2030;
  const futureBaseline = buildFutureScenarios(cpiValues, amount, latestYear, futureTarget).find((scenario) => scenario.label === "Baseline");

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-200/60 ring-1 ring-white sm:p-6">
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Inflation calculator</p>
          <h2 className="break-words text-2xl font-black text-slate-950">Enter your information</h2>
        </div>
        <p className="text-sm text-slate-500">Any available year to any available year</p>
      </div>
      <>
          <div className="grid gap-4 md:grid-cols-4">
            {showLocationSelector ? <MetroSelector metros={metros} value={slug} onChange={setSlug} /> : null}
            <AmountInput value={amount} onChange={setAmount} />
            <YearSelector label="Base year" years={availableYears} value={safeBaseYear} onChange={setBaseYear} />
            <YearSelector label="Comparison year" years={availableYears} value={safeComparisonYear} onChange={setComparisonYear} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            CPI data for {selectedMetro?.display_name ?? "this location"} is available from {availableYears[0]} to {latestYear}. Reverse comparisons are supported.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <ResultCard
              title={`${formatDollar(amount)} in ${safeBaseYear} equals`}
              value={`${formatDollar(adjusted)} in ${safeComparisonYear}`}
              detail={`That means prices ${priceChange >= 0 ? "rose" : "fell"} about ${formatPercent(Math.abs(priceChange))} over this period.`}
              tone="blue"
            />
            <ResultCard title="Inflation" value={formatPercent(priceChange)} detail={`Based on CPI values ${cpiStart.index.toFixed(1)} and ${cpiEnd.index.toFixed(1)}.`} />
            <WageComparison cpiStart={cpiStart} cpiEnd={cpiEnd} wageStart={wageStart} wageEnd={wageEnd} />
            <ResultCard title="Future estimate" value={futureBaseline ? formatDollar(futureBaseline.value) : "Unavailable"} detail={`${formatDollar(amount)} today may need this amount by ${futureTarget} under the baseline scenario.`} tone="amber" />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ResultCard title="Cost growth rank" value={inflationRank ? `#${inflationRank.rank} of ${metros.length}` : "Unavailable"} detail="Ranked against the LocalInflation location list for the selected years." />
            <ResultCard title="Wage gap rank" value={wageRank ? `#${wageRank.rank} of ${metros.length}` : "Unavailable"} detail="Higher rank means wage growth outpaced inflation by more." />
          </div>

          <div className="mt-6">
            <CostChart data={cpiValues} />
          </div>

          <div className="mt-6">
            <WageCharts cpiValues={cpiValues} wageValues={wageValues} baseYear={safeBaseYear} comparisonYear={safeComparisonYear} />
          </div>

          <div className="mt-6">
            <PlainEnglishExplanation amount={amount} adjusted={adjusted} startYear={safeBaseYear} endYear={safeComparisonYear} priceChange={priceChange} />
          </div>

          <div className="mt-6 grid gap-6">
            <QuickExamples cpiStart={cpiStart.index} cpiEnd={cpiEnd.index} endYear={safeComparisonYear} />
            <FutureCostIndex cpiValues={cpiValues} amount={amount} currentYear={latestYear} targetYear={futureTarget} />
          </div>
      </>
    </div>
  );
}
