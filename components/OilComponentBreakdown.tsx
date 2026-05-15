import { formatPercent } from "@/lib/formatters";
import { splitDirectIndirectEffects, totalComponentEffectPp, type OilComponentEffect } from "@/lib/oilCalculations";
import type { Metro } from "@/lib/types";

export default function OilComponentBreakdown({ effects, metro }: { effects: OilComponentEffect[]; metro?: Metro }) {
  const total = totalComponentEffectPp(effects);
  const split = splitDirectIndirectEffects(effects);
  const exposure = metro?.oil_exposure;
  const localMultiplier = exposure?.overall_oil_exposure_multiplier ?? 1;
  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Direct channels</p>
          <p className="mt-2 break-words text-2xl font-black leading-tight text-blue-950">{split.direct.toFixed(2)}%</p>
        </div>
        <div className="min-w-0 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Indirect channels</p>
          <p className="mt-2 break-words text-2xl font-black leading-tight text-amber-950">{split.indirect.toFixed(2)}%</p>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total component estimate</p>
          <p className="mt-2 break-words text-2xl font-black leading-tight text-slate-950">{split.total.toFixed(2)}%</p>
        </div>
        <div className="min-w-0 rounded-xl border border-teal-100 bg-teal-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Local exposure estimate</p>
          <p className="mt-2 break-words text-2xl font-black leading-tight text-teal-950">{(total * localMultiplier).toFixed(2)}%</p>
          <p className="mt-1 text-xs text-teal-900">Multiplier {localMultiplier.toFixed(2)}x</p>
        </div>
      </div>
      {exposure ? (
        <p className="rounded-xl border border-teal-100 bg-white p-4 text-sm leading-6 text-slate-600">
          <span className="font-bold text-slate-900">{metro?.display_name} oil exposure proxy:</span> driving {exposure.driving_multiplier.toFixed(2)}x, heating fuel {exposure.heating_fuel_multiplier.toFixed(2)}x, transit offset {exposure.transit_offset.toFixed(2)}. {exposure.note}
        </p>
      ) : null}

      <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <h2 className="break-words text-lg font-black leading-7 text-slate-950 sm:text-xl">Component-weight CPI model</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Component weights and sensitivities are assumptions until replaced with verified CPI relative-importance data and validated pass-through estimates. Treat this as a scenario estimate of possible inflationary effect, not a forecast.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">CPI weight</th>
                <th className="px-4 py-3">Oil sensitivity</th>
                <th className="px-4 py-3">Component price effect</th>
                <th className="px-4 py-3">CPI contribution</th>
                <th className="px-4 py-3">Timing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {effects.map((effect) => (
                <tr key={effect.slug}>
                  <td className="px-4 py-4 font-semibold text-slate-900">{effect.component}</td>
                  <td className="px-4 py-4 capitalize text-slate-600">{effect.channel}</td>
                  <td className="px-4 py-4">{formatPercent(effect.cpiWeight * 100)}</td>
                  <td className="px-4 py-4">{formatPercent(effect.oilSensitivity * 100)}</td>
                  <td className="px-4 py-4">{formatPercent(effect.componentPriceChangePct * 100)}</td>
                  <td className="px-4 py-4">{effect.cpiContributionPp.toFixed(2)}%</td>
                  <td className="px-4 py-4">{effect.timingMonths} months</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-blue-50 font-bold text-blue-950">
              <tr>
                <td className="px-4 py-4" colSpan={5}>Total component effect</td>
                <td className="px-4 py-4">{total.toFixed(2)}%</td>
                <td className="px-4 py-4">Scenario estimate</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
