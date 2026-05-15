"use client";

export type OilGbdtScenarioEstimate = {
  oil_shock_pct: number;
  horizon_months: number;
  low: number;
  mid: number;
  high: number;
  unit: string;
};

export type OilGbdtPayload = {
  model: "GBDT" | string;
  status: "trained" | "placeholder" | "experimental";
  description?: string;
  scenario_estimates?: OilGbdtScenarioEstimate[];
  metrics?: Record<string, { mae: number; rmse?: number; baseline_mae?: number; n_train?: number; n_test?: number }>;
};

export default function OilGbdtResults({ payload }: { payload?: OilGbdtPayload }) {
  if (!payload || payload.status !== "trained" || !payload.scenario_estimates?.length) {
    return (
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Trained GBDT model not available yet</h2>
        <p className="mt-3 leading-7 text-slate-600">GBDT model not trained yet. The experimental tree-based scenario estimate remains available as a fallback prototype.</p>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Trained GBDT scenario estimate</h2>
      <p className="mt-3 leading-7 text-slate-600">{payload.description ?? "Trained nonlinear scenario model using historical oil, gasoline, CPI, and macro data."}</p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Oil shock</th>
              <th className="px-4 py-3">Horizon</th>
              <th className="px-4 py-3">Low</th>
              <th className="px-4 py-3">Mid</th>
              <th className="px-4 py-3">High</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payload.scenario_estimates.map((estimate) => (
              <tr key={`${estimate.oil_shock_pct}-${estimate.horizon_months}`}>
                <td className="px-4 py-3 font-semibold">+{estimate.oil_shock_pct}%</td>
                <td className="px-4 py-3">{estimate.horizon_months} months</td>
                <td className="px-4 py-3">{estimate.low.toFixed(2)}</td>
                <td className="px-4 py-3">{estimate.mid.toFixed(2)}</td>
                <td className="px-4 py-3">{estimate.high.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
