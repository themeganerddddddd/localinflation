"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type OilEstimateRangeItem = {
  model: string;
  low: number;
  high: number;
  status: string;
};

export default function OilEstimateRangeChart({ items }: { items: OilEstimateRangeItem[] }) {
  const data = items.filter((item) => Number.isFinite(item.low) && Number.isFinite(item.high));
  if (!data.length) return null;

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Oil estimate range comparison</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Models answer different questions. Direct and historical models show CPI contribution estimates; duration and GBDT models show cumulative pressure while oil remains elevated.</p>
      <div className="mt-5 h-72 overflow-hidden sm:h-80">
        <div className="h-full min-w-0 sm:min-w-[680px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 4, top: 12, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="model" tick={{ fontSize: 10 }} interval="preserveStartEnd" angle={-10} textAnchor="end" height={64} />
            <YAxis tick={{ fontSize: 11 }} width={36} tickFormatter={(value) => `${Number(value).toFixed(1)}`} />
            <Tooltip formatter={(value, name) => [`${Number(value).toFixed(2)}`, String(name)]} />
            <Bar dataKey="low" name="Low/mid estimate" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            <Bar dataKey="high" name="High estimate" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
