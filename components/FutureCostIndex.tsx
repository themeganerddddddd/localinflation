"use client";

import { buildFutureScenarios } from "@/lib/calculations";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { CpiPoint } from "@/lib/types";

type FutureCostIndexProps = {
  cpiValues: CpiPoint[];
  amount: number;
  currentYear: number;
  targetYear: number;
};

export default function FutureCostIndex({ cpiValues, amount, currentYear, targetYear }: FutureCostIndexProps) {
  const scenarios = buildFutureScenarios(cpiValues, amount, currentYear, targetYear);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Future Cost Index</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Scenario estimate through {targetYear}</h2>
        </div>
        <p className="text-sm text-slate-500">{targetYear - currentYear} years forward</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {scenarios.map((scenario) => (
          <div key={scenario.label} className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-600">{scenario.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{formatDollar(scenario.value)}</p>
            <p className="mt-1 text-xs text-slate-500">{formatPercent(scenario.annualRate * 100)} annual scenario</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        Future Cost Index is a scenario estimate based on historical public data. It is not financial, investment, employment, or legal advice.
      </p>
    </section>
  );
}
