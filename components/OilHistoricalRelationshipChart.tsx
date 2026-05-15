"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPercent } from "@/lib/formatters";

export type OilMacroMonthlyPoint = {
  date: string;
  wti_oil_price?: number | null;
  wti?: number | null;
  gasoline_price?: number | null;
  gasoline?: number | null;
  cpi_all_items?: number | null;
  cpi_energy?: number | null;
  core_cpi?: number | null;
  cpi_core?: number | null;
  wti_oil_price_pct_change?: number | null;
  wti_mom_pct?: number | null;
  gasoline_price_pct_change?: number | null;
  gasoline_mom_pct?: number | null;
  cpi_all_items_pct_change?: number | null;
  cpi_mom_pct?: number | null;
  cpi_energy_pct_change?: number | null;
  core_cpi_pct_change?: number | null;
};

type OilHistoricalRelationshipChartProps = {
  data?: OilMacroMonthlyPoint[];
};

const series = [
  { key: "wti_oil_price_pct_change", name: "WTI oil", color: "#0f766e" },
  { key: "gasoline_price_pct_change", name: "Gasoline", color: "#2563eb" },
  { key: "cpi_energy_pct_change", name: "CPI energy", color: "#d97706" },
  { key: "cpi_all_items_pct_change", name: "CPI all-items", color: "#475569" },
  { key: "core_cpi_pct_change", name: "Core CPI", color: "#7c3aed" }
];

export default function OilHistoricalRelationshipChart({ data = [] }: OilHistoricalRelationshipChartProps) {
  const chartData = data.filter((point) => point.date).slice(-120);

  if (!chartData.length) {
    return (
      <section className="min-w-0 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-6">
        <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Historical oil, gasoline, and CPI relationship</h2>
        <p className="mt-3 leading-7 text-slate-600">Historical monthly oil macro data is not available yet. Run the oil macro update script to generate the validation chart.</p>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Historical validation</p>
        <h2 className="mt-1 break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Monthly oil, gasoline, and CPI changes</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">This chart compares monthly percent changes. It helps show historical pass-through patterns, but it does not prove a forecast for any single oil-price scenario.</p>
      </div>
      <div className="h-72 overflow-hidden sm:h-80">
        <div className="h-full min-w-0 sm:min-w-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" minTickGap={34} interval="preserveStartEnd" tick={{ fontSize: 11 }} />
            <YAxis width={40} tick={{ fontSize: 11 }} tickFormatter={(value) => `${Number(value).toFixed(1)}%`} />
            <Tooltip formatter={(value, name) => [formatPercent(Number(value)), String(name)]} labelFormatter={(label) => `Month: ${label}`} />
            <Legend />
            {series.map((item) => (
              <Line key={item.key} type="monotone" dataKey={item.key} name={item.name} stroke={item.color} strokeWidth={2} dot={false} />
            ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
