"use client";

import OilComponentBreakdown from "@/components/OilComponentBreakdown";
import OilHistoricalRelationshipChart, { type OilMacroMonthlyPoint } from "@/components/OilHistoricalRelationshipChart";
import OilLocalProjectionResults, { type OilLocalProjectionPayload } from "@/components/OilLocalProjectionResults";
import OilPassThroughChart from "@/components/OilPassThroughChart";
import OilResearchNote from "@/components/OilResearchNote";
import { formatPercent } from "@/lib/formatters";
import type { OilComponentEffect, OilShockClass } from "@/lib/oilCalculations";
import type { OilDurationModelOutput } from "@/lib/oilDurationModel";
import type { OilModelView } from "@/components/OilScenarioForm";
import type { Metro } from "@/lib/types";

type OilMethodologyTabsProps = {
  view: OilModelView;
  oilChangePct: number;
  gasolineEffectPct: number;
  directEffectPp: number;
  expandedEnergy: { expandedEnergyLow: number; expandedEnergyHigh: number };
  stressScenario: {
    shockClass: OilShockClass;
    stressLow: number;
    stressHigh: number;
    stressMultiplier: number;
    horizonMultiplier: number;
    passThroughRiskMultiplier: number;
    localOilExposureMultiplier: number;
  };
  durationImpact: OilDurationModelOutput;
  componentEffects: OilComponentEffect[];
  oilMacroMonthly?: OilMacroMonthlyPoint[];
  localProjection?: OilLocalProjectionPayload;
  selectedMetro?: Metro;
};

function shockExplanation(shockClass: OilShockClass): string {
  if (shockClass === "small" || shockClass === "moderate") {
    return "The direct gasoline channel is likely the clearest near-term effect. Broader indirect effects are usually smaller and more uncertain.";
  }
  if (shockClass === "large") {
    return "This is a large oil-price shock. Broader inflation pressure may extend beyond gasoline into airfares, freight, heating fuel, and producer prices.";
  }
  return "This is a severe oil-price shock. The direct gasoline calculation may understate broader inflation pressure because large oil shocks can affect diesel, airfares, freight, producer prices, import prices, food distribution, and inflation expectations.";
}

export default function OilMethodologyTabs({ view, oilChangePct, gasolineEffectPct, directEffectPp, expandedEnergy, stressScenario, durationImpact, componentEffects, oilMacroMonthly = [], localProjection, selectedMetro }: OilMethodologyTabsProps) {
  if (view === "component") {
    return <OilComponentBreakdown effects={componentEffects} metro={selectedMetro} />;
  }

  if (view === "duration") {
    return (
      <section className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-950">Calibrated duration model</h2>
          <p className="mt-3 leading-7 text-slate-600">Estimates cumulative CPI pressure while oil remains elevated. This sits between the narrow direct gasoline calculation and the experimental tree-based sustained-impact model.</p>
          <p className="mt-3 leading-7 text-slate-600">The direct gasoline channel is a one-time basket-weight contribution. The duration model asks a different question: if oil remains elevated for several months, how much cumulative inflation pressure could build across energy and indirect channels?</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4"><p className="text-sm font-bold text-blue-700">Cumulative CPI pressure range</p><p className="mt-2 text-2xl font-black text-blue-950">+{durationImpact.cumulativePressureLowPct.toFixed(2)}% to +{durationImpact.cumulativePressureHighPct.toFixed(2)}%</p></div>
          <div className="rounded-xl bg-green-50 p-4"><p className="text-sm font-bold text-green-700">Average monthly pressure range</p><p className="mt-2 text-2xl font-black text-green-950">+{durationImpact.monthlyPressureLowPct.toFixed(2)}% to +{durationImpact.monthlyPressureHighPct.toFixed(2)}%</p></div>
          <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold text-slate-700">Energy channel contribution</p><p className="mt-2 text-2xl font-black text-slate-950">+{durationImpact.energyChannelContributionPp.toFixed(2)}%</p></div>
          <div className="rounded-xl bg-amber-50 p-4"><p className="text-sm font-bold text-amber-700">Indirect channel contribution</p><p className="mt-2 text-2xl font-black text-amber-950">+{durationImpact.indirectChannelContributionPp.toFixed(2)}%</p></div>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="font-bold">Duration multiplier:</span> {durationImpact.durationMultiplier.toFixed(2)}x</p>
          <p><span className="font-bold">Persistence multiplier:</span> {durationImpact.shockPersistenceMultiplier.toFixed(2)}x</p>
          <p><span className="font-bold">Pass-through multiplier:</span> {durationImpact.passThroughMultiplier.toFixed(2)}x</p>
          <p><span className="font-bold">Local exposure multiplier:</span> {durationImpact.localOilExposureMultiplier.toFixed(2)}x</p>
          <p><span className="font-bold">CPI momentum multiplier:</span> {durationImpact.cpiMomentumMultiplier.toFixed(2)}x</p>
          <p><span className="font-bold">Oil volatility multiplier:</span> {durationImpact.volatilityMultiplier.toFixed(2)}x</p>
        </div>
        <p className="text-sm leading-6 text-slate-500">{durationImpact.explanation}</p>
      </section>
    );
  }

  if (view === "localProjection") {
    return <OilLocalProjectionResults payload={localProjection} />;
  }

  if (view === "econometric") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Econometric model</h2>
        <p className="mt-3 leading-7 text-slate-600">Econometric model not yet trained. This section is designed for VAR/SVAR and local projection estimates using historical public data.</p>
        <p className="mt-3 leading-7 text-slate-600">The VAR/SVAR model estimates how CPI historically responded after oil-price shocks while controlling for other macroeconomic variables. This provides a time-path estimate instead of a single static pass-through number.</p>
      </div>
    );
  }

  if (view === "ml") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">ML experimental</h2>
        <p className="mt-3 leading-7 text-slate-600">Experimental ML model not yet trained. This section is designed for GBDT-based scenario estimates using oil prices, gasoline prices, CPI, PPI, labor-market indicators, interest rates, and lagged inflation.</p>
        <p className="mt-3 leading-7 text-slate-600">The experimental machine-learning model estimates inflation outcomes using historical relationships among oil prices, gasoline prices, energy CPI, producer prices, interest rates, unemployment, industrial production, and lagged inflation. It should be interpreted as a scenario model, not a causal estimate.</p>
      </div>
    );
  }

  if (view === "simple") {
    return (
      <div className="grid gap-6">
        <section className="rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-black text-blue-950">Plain-English explanation</h2>
          <p className="mt-3 leading-7 text-blue-950">If oil changes by {formatPercent(oilChangePct * 100)}, the {formatPercent(gasolineEffectPct * 100)} gasoline channel effect is the first direct consumer-price channel. With gasoline at about 3% of the CPI basket, the direct gasoline contribution to all-items CPI is about {directEffectPp.toFixed(2)}% before broader indirect effects.</p>
          <p className="mt-2 leading-7 text-blue-900">{shockExplanation(stressScenario.shockClass)}</p>
          <p className="mt-2 leading-7 text-blue-900">Expanded energy CPI effect is shown as {expandedEnergy.expandedEnergyLow.toFixed(2)}% to {expandedEnergy.expandedEnergyHigh.toFixed(2)}%. Stress scenario total CPI pressure is shown as {stressScenario.stressLow.toFixed(2)}% to {stressScenario.stressHigh.toFixed(2)}%, because transportation, production, food distribution, producer-price, import-price, and expectations channels are uncertain.</p>
        </section>
        <OilPassThroughChart data={[
          { name: "Oil", value: oilChangePct * 100 },
          { name: "Gasoline", value: gasolineEffectPct * 100 },
          { name: "Direct gasoline CPI", value: directEffectPp },
          { name: "Expanded energy high", value: expandedEnergy.expandedEnergyHigh },
          { name: "Stress high", value: stressScenario.stressHigh }
        ]} />
        <OilHistoricalRelationshipChart data={oilMacroMonthly} />
      </div>
    );
  }

  return <OilResearchNote />;
}
