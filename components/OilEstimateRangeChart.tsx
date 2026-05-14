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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">Oil estimate range comparison</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Models answer different questions. Direct and historical models show CPI contribution estimates; duration and GBDT models show cumulative pressure while oil remains elevated.</p>
      <div className="mt-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="model" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={72} />
            <YAxis tickFormatter={(value) => `${Number(value).toFixed(1)}`} />
            <Tooltip formatter={(value, name) => [`${Number(value).toFixed(2)}`, String(name)]} />
            <Bar dataKey="low" name="Low/mid estimate" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            <Bar dataKey="high" name="High estimate" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
