"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type OilLocalProjectionResponse = {
  horizon_months: number;
  cpi_effect_pp: number;
  lower_ci?: number;
  upper_ci?: number;
};

export type OilLocalProjectionPayload = {
  model: string;
  status: "trained" | "estimated" | "placeholder";
  shock: string;
  description?: string;
  responses: OilLocalProjectionResponse[];
};

export default function OilLocalProjectionResults({ payload }: { payload?: OilLocalProjectionPayload }) {
  if (!payload || payload.status === "placeholder" || !payload.responses?.length) {
    return (
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Historical local projection model</h2>
        <p className="mt-3 leading-7 text-slate-600">Historical model not trained yet. This section is designed to estimate CPI responses after oil shocks using historical monthly oil and CPI data.</p>
        <p className="mt-3 text-sm font-semibold text-amber-700">Historical relationships can change across regimes. These estimates are not guaranteed forecasts.</p>
      </section>
    );
  }

  return (
    <section className="grid min-w-0 gap-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Historical local projection model</h2>
        <p className="mt-3 leading-7 text-slate-600">Local projections estimate the inflation response separately at each time horizon. This makes it easier to show how oil shocks historically affected CPI after 1 month, 3 months, 12 months, and beyond.</p>
        <p className="mt-3 text-sm font-semibold text-amber-700">Historical relationships can change across regimes. These estimates are not guaranteed forecasts.</p>
      </div>
      <div className="h-72 overflow-hidden">
        <div className="h-full min-w-0 sm:min-w-[620px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={payload.responses} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis tick={{ fontSize: 11 }} dataKey="horizon_months" tickFormatter={(value) => `${value}m`} />
            <YAxis width={42} tick={{ fontSize: 11 }} tickFormatter={(value) => `${Number(value).toFixed(2)}%`} />
            <Tooltip formatter={(value, name) => [`${Number(value).toFixed(2)}%`, String(name)]} labelFormatter={(label) => `${label} months`} />
            <Line type="monotone" dataKey="cpi_effect_pp" name="Estimated CPI effect" stroke="#2563eb" strokeWidth={3} />
            <Line type="monotone" dataKey="lower_ci" name="Lower CI" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
            <Line type="monotone" dataKey="upper_ci" name="Upper CI" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Horizon</th>
              <th className="px-4 py-3">Estimated CPI effect from 10% oil shock</th>
              <th className="px-4 py-3">Lower confidence interval</th>
              <th className="px-4 py-3">Upper confidence interval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payload.responses.map((response) => (
              <tr key={response.horizon_months}>
                <td className="px-4 py-3 font-semibold">{response.horizon_months} months</td>
                <td className="px-4 py-3">{response.cpi_effect_pp.toFixed(2)}%</td>
                <td className="px-4 py-3">{response.lower_ci?.toFixed(2) ?? "n/a"}</td>
                <td className="px-4 py-3">{response.upper_ci?.toFixed(2) ?? "n/a"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-6 text-slate-500">{payload.description ?? "Estimated historical CPI response to a 10% monthly WTI oil price shock."}</p>
    </section>
  );
}
