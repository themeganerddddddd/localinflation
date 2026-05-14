"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { percentChange } from "@/lib/calculations";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { CpiPoint, WagePoint } from "@/lib/types";

type WageChartsProps = {
  cpiValues: CpiPoint[];
  wageValues: WagePoint[];
  baseYear: number;
  comparisonYear: number;
};

export default function WageCharts({ cpiValues, wageValues, baseYear, comparisonYear }: WageChartsProps) {
  const wageByYear = new Map(wageValues.map((point) => [point.year, point.wage]));
  const wageData = cpiValues
    .filter((point) => wageByYear.has(point.year))
    .map((point) => {
      const firstCpi = cpiValues[0]?.index ?? point.index;
      const firstWage = wageValues[0]?.wage ?? wageByYear.get(point.year) ?? 1;
      return {
        year: point.year,
        cpi: point.index,
        wage: wageByYear.get(point.year),
        inflationIndexedWage: firstWage * (point.index / firstCpi)
      };
    });
  const yoyData = wageData.slice(1).map((point, index) => {
    const previousWage = wageData[index].wage ?? 0;
    const previousCpi = wageData[index].cpi ?? 0;
    const currentCpi = point.cpi ?? previousCpi;
    return {
      year: point.year,
      nominalWageGrowth: previousWage ? percentChange(previousWage, point.wage ?? previousWage) : 0,
      inflationRate: previousCpi ? percentChange(previousCpi, currentCpi) : 0
    };
  });
  const yoyValues = yoyData.flatMap((point) => [point.nominalWageGrowth, point.inflationRate]).filter(Number.isFinite);
  const yoyMin = Math.min(...yoyValues, 0);
  const yoyMax = Math.max(...yoyValues, 1);
  const yoyPadding = Math.max(2, (yoyMax - yoyMin) * 0.45);
  const yoyDomainMin = Math.floor(yoyMin - yoyPadding);
  const yoyDomainMax = Math.ceil(yoyMax + yoyPadding);
  const cpiStart = cpiValues.find((point) => point.year === baseYear);
  const cpiEnd = cpiValues.find((point) => point.year === comparisonYear);
  const wageStart = wageValues.find((point) => point.year === baseYear);
  const wageEnd = wageValues.find((point) => point.year === comparisonYear);
  const selectedPeriodSummary = cpiStart && cpiEnd && wageStart && wageEnd
    ? `Selected period: nominal wages rose ${formatPercent(percentChange(wageStart.wage, wageEnd.wage))} while prices rose ${formatPercent(percentChange(cpiStart.index, cpiEnd.index))}.`
    : "";

  return (
    <section className="grid gap-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Wage chart</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Wages with wage growth vs wages if kept at inflation</h2>
          </div>
        </div>
        <div className="mt-5 h-80 overflow-x-auto pb-2">
          <div className="h-full min-w-[820px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wageData} margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} minTickGap={24} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} width={60} />
                <Tooltip formatter={(value, name) => [formatDollar(Number(value)), String(name)]} />
                <Legend />
                <Line type="monotone" dataKey="wage" name="Wages with wage growth" stroke="#0f766e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="inflationIndexedWage" name="Wages if kept at inflation" stroke="#2563eb" strokeWidth={3} strokeDasharray="6 6" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">Data source note: CPI values use Bureau of Labor Statistics CPI series where available. Wage values are structured as generated placeholders until verified BLS/OEWS wage series are connected.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Year-over-year rates</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Nominal wage growth and inflation rate</h2>
        <div className="mt-5 h-80 overflow-x-auto pb-2">
          <div className="h-full min-w-[820px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yoyData} margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} minTickGap={24} />
                <YAxis domain={[yoyDomainMin, yoyDomainMax]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} width={50} />
                <Tooltip formatter={(value, name) => [formatPercent(Number(value)), String(name)]} />
                <Legend />
                <Line type="monotone" dataKey="nominalWageGrowth" name="Nominal wage growth" stroke="#0f766e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="inflationRate" name="Inflation rate" stroke="#dc2626" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">{selectedPeriodSummary} This chart shows year-over-year rates so users can see when wages and inflation move differently instead of only seeing the cumulative gap.</p>
      </div>
    </section>
  );
}
