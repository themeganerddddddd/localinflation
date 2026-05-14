"use client";

export type OilVarResponse = {
  horizon_months: number;
  cpi_effect_pp: number;
  core_cpi_effect_pp?: number;
  energy_cpi_effect_pp?: number;
};

export type OilVarPayload = {
  model: "VAR" | string;
  status: "trained" | "estimated" | "placeholder";
  shock: string;
  description?: string;
  lag_order?: number;
  responses: OilVarResponse[];
};

export default function OilVarResults({ payload }: { payload?: OilVarPayload }) {
  if (!payload || payload.status === "placeholder" || !payload.responses?.length) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">VAR impulse-response model not trained yet</h2>
        <p className="mt-3 leading-7 text-slate-600">This section is designed to estimate historical dynamic responses across oil, gasoline, energy CPI, all-items CPI, and core CPI.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">VAR impulse-response estimate</h2>
      <p className="mt-3 leading-7 text-slate-600">{payload.description ?? "VAR impulse response of CPI variables after WTI oil price shock."}</p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Horizon</th>
              <th className="px-4 py-3">All-items CPI</th>
              <th className="px-4 py-3">Core CPI</th>
              <th className="px-4 py-3">Energy CPI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payload.responses.map((response) => (
              <tr key={response.horizon_months}>
                <td className="px-4 py-3 font-semibold">{response.horizon_months} months</td>
                <td className="px-4 py-3">{response.cpi_effect_pp.toFixed(2)}%</td>
                <td className="px-4 py-3">{response.core_cpi_effect_pp?.toFixed(2) ?? "n/a"}%</td>
                <td className="px-4 py-3">{response.energy_cpi_effect_pp?.toFixed(2) ?? "n/a"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
