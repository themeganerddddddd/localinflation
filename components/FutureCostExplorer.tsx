"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AmountInput from "@/components/AmountInput";
import FutureCostIndex from "@/components/FutureCostIndex";
import MetroSelector from "@/components/MetroSelector";
import YearSelector from "@/components/YearSelector";
import { buildFutureScenarios, getAvailableYears } from "@/lib/calculations";
import { formatDollar } from "@/lib/formatters";
import type { CpiPoint, Metro } from "@/lib/types";

type FutureCostExplorerProps = {
  metros: Metro[];
  cpiBySlug: Record<string, CpiPoint[]>;
  initialSlug?: string;
};

export default function FutureCostExplorer({ metros, cpiBySlug, initialSlug = "united-states" }: FutureCostExplorerProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [amount, setAmount] = useState(100);
  const cpiValues = cpiBySlug[slug] ?? [];
  const years = useMemo(() => getAvailableYears(cpiValues), [cpiValues]);
  const latestYear = years.at(-1) ?? 2026;
  const [currentYear, setCurrentYear] = useState(latestYear);
  const [targetYear, setTargetYear] = useState(2035);
  const futureYears = Array.from({ length: 21 }, (_, index) => latestYear + index).filter((year) => year > latestYear);
  const chartData = futureYears
    .filter((year) => year <= Math.max(targetYear, latestYear + 1))
    .map((year) => {
      const scenarios = buildFutureScenarios(cpiValues, amount, currentYear, year);
      return {
        year,
        Low: scenarios.find((scenario) => scenario.label === "Low")?.value ?? amount,
        Baseline: scenarios.find((scenario) => scenario.label === "Baseline")?.value ?? amount,
        High: scenarios.find((scenario) => scenario.label === "High")?.value ?? amount
      };
    });
  const scenarioValues = chartData.flatMap((point) => [point.Low, point.Baseline, point.High]);
  const minScenario = Math.min(amount, ...scenarioValues);
  const maxScenario = Math.max(amount, ...scenarioValues);
  const padding = Math.max(1, (maxScenario - minScenario) * 0.08);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetroSelector metros={metros} value={slug} onChange={setSlug} />
        <AmountInput value={amount} onChange={setAmount} label="Enter current amount" />
        <YearSelector label="Current year" years={years} value={currentYear} onChange={setCurrentYear} />
        <YearSelector label="Target future year" years={futureYears} value={targetYear} onChange={setTargetYear} />
      </div>

      <div className="mt-6">
        <FutureCostIndex cpiValues={cpiValues} amount={amount} currentYear={currentYear} targetYear={targetYear} />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Future cost range</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Low, baseline, and high scenario paths</h2>
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                domain={[Math.max(0, Math.floor(minScenario - padding)), Math.ceil(maxScenario + padding)]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${Math.round(Number(value))}`}
                width={76}
              />
              <Tooltip formatter={(value) => [formatDollar(Number(value)), "Scenario"]} />
              <Legend />
              <Line type="monotone" dataKey="Low" stroke="#0f766e" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Baseline" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="High" stroke="#dc2626" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
