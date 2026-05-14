"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CpiPoint } from "@/lib/types";

export default function CostChart({ data }: { data: CpiPoint[] }) {
  const indexes = data.map((point) => point.index);
  const minIndex = Math.min(...indexes);
  const maxIndex = Math.max(...indexes);
  const padding = Math.max(1, (maxIndex - minIndex) * 0.08);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Inflation over time</p>
      <h2 className="mt-1 text-xl font-bold text-slate-950">Consumer Price Index (CPI) history</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">CPI is the Consumer Price Index, a public measure of how prices change over time for a basket of goods and services.</p>
      <div className="mt-5 h-80 overflow-x-auto pb-2">
        <div className="h-full min-w-[760px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} minTickGap={24} />
              <YAxis domain={[Math.floor(minIndex - padding), Math.ceil(maxIndex + padding)]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={46} />
              <Tooltip formatter={(value) => [Number(value).toFixed(1), "CPI"]} />
              <Line type="monotone" dataKey="index" stroke="#1d4ed8" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
