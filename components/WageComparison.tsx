"use client";

import ResultCard from "@/components/ResultCard";
import { percentChange } from "@/lib/calculations";
import { formatPercent } from "@/lib/formatters";
import type { CpiPoint, WagePoint } from "@/lib/types";

type WageComparisonProps = {
  cpiStart: CpiPoint;
  cpiEnd: CpiPoint;
  wageStart?: WagePoint;
  wageEnd?: WagePoint;
};

export default function WageComparison({ cpiStart, cpiEnd, wageStart, wageEnd }: WageComparisonProps) {
  if (!wageStart || !wageEnd) {
    return <ResultCard title="Wage comparison" value="Wage data unavailable" detail="Add wage data for this location to compare pay growth with inflation." />;
  }

  const prices = percentChange(cpiStart.index, cpiEnd.index);
  const wages = percentChange(wageStart.wage, wageEnd.wage);
  const gap = wages - prices;
  const tone = gap > 1 ? "green" : gap < -1 ? "red" : "blue";
  const status = gap > 1 ? "Wages beat inflation" : gap < -1 ? "Wages trailed inflation" : "Wages roughly kept pace";

  return (
    <ResultCard
      eyebrow={status}
      title="Wage vs inflation"
      value={`Wage gap ${formatPercent(gap)}`}
      detail={`Average wages rose ${formatPercent(wages)} while prices rose ${formatPercent(prices)}. The gap compares wage growth directly against inflation growth.`}
      tone={tone}
    />
  );
}
