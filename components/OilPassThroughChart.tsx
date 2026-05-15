"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPercent } from "@/lib/formatters";

export default function OilPassThroughChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Pass-through view</p>
      <h2 className="mt-1 break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Oil shock to CPI channels</h2>
      <div className="mt-5 h-72 overflow-hidden">
        <div className="h-full min-w-0 sm:min-w-[640px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 4, top: 12, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} interval="preserveStartEnd" tick={{ fontSize: 10 }} />
            <YAxis width={38} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [formatPercent(Number(value)), "Effect"]} />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
