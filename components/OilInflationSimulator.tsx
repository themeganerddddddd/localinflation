"use client";

import { useState } from "react";
import OilConceptExplainer from "@/components/OilConceptExplainer";
import OilEstimateRangeChart from "@/components/OilEstimateRangeChart";
import OilGbdtResults, { type OilGbdtPayload } from "@/components/OilGbdtResults";
import type { OilMacroMonthlyPoint } from "@/components/OilHistoricalRelationshipChart";
import type { OilLocalProjectionPayload } from "@/components/OilLocalProjectionResults";
import OilVarResults, { type OilVarPayload } from "@/components/OilVarResults";
import OilResultCards from "@/components/OilResultCards";
import OilScenarioForm from "@/components/OilScenarioForm";
import { calculateOilDurationImpact } from "@/lib/oilDurationModel";
import {
  calculateDirectGasolineCpiEffect,
  calculateExpandedEnergyEffect,
  calculateStressScenarioTotalCpiPressure,
  componentCpiEffects,
  DEFAULT_GASOLINE_CPI_WEIGHT,
  getPassThroughValue,
  oilHorizonFromMonths,
  type OilCpiComponent,
  type PassThroughSetting
} from "@/lib/oilCalculations";
import type { Metro } from "@/lib/types";
import oilComponents from "@/data/config/oil_cpi_components.json";

type OilInflationSimulatorProps = {
  metros: Metro[];
  oilMacroMonthly?: OilMacroMonthlyPoint[];
  localProjection?: OilLocalProjectionPayload;
  varModel?: OilVarPayload;
  gbdtModel?: OilGbdtPayload;
};

function average(values: number[]): number | undefined {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;
}

export default function OilInflationSimulator({ metros, oilMacroMonthly = [], localProjection, varModel, gbdtModel }: OilInflationSimulatorProps) {
  const [location, setLocation] = useState("united-states");
  const [currentOilPrice, setCurrentOilPrice] = useState(75);
  const [scenarioOilPrice, setScenarioOilPrice] = useState(90);
  const [horizon, setHorizon] = useState(12);
  const [passThrough, setPassThrough] = useState<PassThroughSetting>("baseline");
  const selectedMetro = metros.find((metro) => metro.slug === location);
  const localOilExposureMultiplier = selectedMetro?.oil_exposure?.overall_oil_exposure_multiplier ?? 1;
  const horizonKey = oilHorizonFromMonths(horizon);
  const directGasoline = calculateDirectGasolineCpiEffect({
    currentOilPrice,
    scenarioOilPrice,
    oilToGasPassThrough: getPassThroughValue(passThrough),
    gasolineCpiWeight: DEFAULT_GASOLINE_CPI_WEIGHT
  });
  const oilChange = directGasoline.oilChangePct;
  const gasolineEffect = directGasoline.gasolineChangePct;
  const directEffect = directGasoline.directGasolineCpiEffectPp;
  const componentEffects = componentCpiEffects(oilChange, oilComponents as OilCpiComponent[], passThrough);
  const expandedEnergy = calculateExpandedEnergyEffect({
    directGasolineCpiEffectPp: directEffect,
    componentEffects
  });
  const stressScenario = calculateStressScenarioTotalCpiPressure({
    directGasolineCpiEffectPp: directEffect,
    expandedEnergyLow: expandedEnergy.expandedEnergyLow,
    expandedEnergyHigh: expandedEnergy.expandedEnergyHigh,
    componentEffects,
    oilChangePct: oilChange,
    horizon: horizonKey,
    passThroughSetting: passThrough,
    localOilExposureMultiplier
  });
  const recentCpiMomentum = average(oilMacroMonthly.slice(-12).map((point) => point.cpi_all_items_pct_change ?? point.cpi_mom_pct).filter((value): value is number => typeof value === "number"));
  const recentOilMoves = oilMacroMonthly.slice(-12).map((point) => Math.abs(point.wti_oil_price_pct_change ?? point.wti_mom_pct ?? 0));
  const recentOilVolatility = average(recentOilMoves);
  const durationImpact = calculateOilDurationImpact({
    oilChangePct: oilChange,
    gasolineChangePct: gasolineEffect,
    directGasolineContributionPp: directEffect,
    expandedEnergyLowPp: expandedEnergy.expandedEnergyLow,
    expandedEnergyHighPp: expandedEnergy.expandedEnergyHigh,
    durationMonths: horizon,
    horizon: horizonKey,
    passThroughSetting: passThrough,
    localOilExposureMultiplier,
    cpiMomentumPct: recentCpiMomentum === undefined ? undefined : recentCpiMomentum * 12,
    oilVolatilityPct: recentOilVolatility
  });

  const localProjectionEstimate = localProjection?.status === "trained" || localProjection?.status === "estimated"
    ? localProjection.responses.find((response) => response.horizon_months === horizon) ?? localProjection.responses.at(-1)
    : undefined;
  const varEstimate = varModel?.status === "trained" || varModel?.status === "estimated"
    ? varModel.responses.find((response) => response.horizon_months === horizon) ?? varModel.responses.at(-1)
    : undefined;
  const gbdtEstimate = gbdtModel?.status === "trained"
    ? gbdtModel.scenario_estimates?.find((estimate) => estimate.oil_shock_pct === 100 && estimate.horizon_months === horizon) ?? gbdtModel.scenario_estimates?.at(-1)
    : undefined;
  const rangeItems = [
    { model: "Direct gasoline", low: directEffect, high: directEffect, status: "transparent" },
    { model: "Stress/component", low: stressScenario.stressLow, high: stressScenario.stressHigh, status: "scenario" },
    { model: "Duration", low: durationImpact.cumulativePressureLowPct, high: durationImpact.cumulativePressureHighPct, status: "scenario" },
    ...(localProjectionEstimate ? [{ model: "Local projection", low: localProjectionEstimate.cpi_effect_pp, high: localProjectionEstimate.cpi_effect_pp, status: "historical" }] : []),
    ...(varEstimate ? [{ model: "VAR", low: varEstimate.cpi_effect_pp, high: varEstimate.cpi_effect_pp, status: "historical" }] : []),
    ...(gbdtEstimate ? [{ model: "GBDT", low: gbdtEstimate.low, high: gbdtEstimate.high, status: "trained" }] : [])
  ];

  return (
    <section className="grid gap-6">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
        <OilScenarioForm
          metros={metros}
          location={location}
          setLocation={setLocation}
          currentOilPrice={currentOilPrice}
          setCurrentOilPrice={setCurrentOilPrice}
          scenarioOilPrice={scenarioOilPrice}
          setScenarioOilPrice={setScenarioOilPrice}
          horizon={horizon}
          setHorizon={setHorizon}
          passThrough={passThrough}
          setPassThrough={setPassThrough}
        />
        <p className="mt-4 break-words text-sm leading-6 text-slate-500">Assumptions: gasoline CPI weight {DEFAULT_GASOLINE_CPI_WEIGHT * 100}%, {passThrough} pass-through, {horizon}-month scenario horizon. Results are scenario estimates based on historical pass-through, not predictions.</p>
      </div>

      <OilResultCards
        oilChangePct={oilChange}
        shockClass={stressScenario.shockClass}
        gasolineEffectPct={gasolineEffect}
        directGasolineCpiEffectPp={directEffect}
        expandedEnergy={expandedEnergy}
        stressScenario={stressScenario}
        durationImpact={durationImpact}
        localProjection={localProjection}
      />

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-black text-slate-950">Why the models differ</h2>
        <p className="mt-3 leading-7 text-slate-600">Direct gasoline contribution is narrow and immediate. It only measures gasoline's direct contribution to all-items CPI. The stress scenario adds possible indirect pressure from related channels. The calibrated duration model estimates cumulative pressure while oil remains elevated. The local projection model estimates historical CPI responses after oil shocks. The experimental tree-based model adds nonlinear scenario assumptions using CPI momentum, oil volatility, regional sensitivity, and duration. These are different model views, not contradictions.</p>
      </section>

      <OilEstimateRangeChart items={rangeItems} />
      <div className="grid gap-6 lg:grid-cols-2">
        <OilVarResults payload={varModel} />
        <OilGbdtResults payload={gbdtModel} />
      </div>

      <details className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:p-5">
        <summary className="cursor-pointer text-lg font-black text-slate-950">Assumptions and direct-channel explanation</summary>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <OilConceptExplainer />
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              <p><span className="font-bold text-slate-900">Current oil price:</span> ${currentOilPrice.toFixed(2)}</p>
              <p><span className="font-bold text-slate-900">Scenario oil price:</span> ${scenarioOilPrice.toFixed(2)}</p>
              <p><span className="font-bold text-slate-900">Oil price change:</span> {(oilChange * 100).toFixed(1)}%</p>
              <p><span className="font-bold text-slate-900">Oil-to-gasoline pass-through:</span> {(getPassThroughValue(passThrough) * 100).toFixed(0)}%</p>
              <p><span className="font-bold text-slate-900">Estimated gasoline price increase:</span> {(gasolineEffect * 100).toFixed(1)}%</p>
              <p><span className="font-bold text-slate-900">Gasoline CPI weight:</span> {(DEFAULT_GASOLINE_CPI_WEIGHT * 100).toFixed(1)}%</p>
              <p><span className="font-bold text-slate-900">Shock classification:</span> {stressScenario.shockClass}</p>
              <p><span className="font-bold text-slate-900">Duration:</span> {horizon} months</p>
              <p><span className="font-bold text-slate-900">Stress multiplier:</span> {stressScenario.stressMultiplier.toFixed(2)}x</p>
              <p><span className="font-bold text-slate-900">Local oil exposure:</span> {stressScenario.localOilExposureMultiplier.toFixed(2)}x</p>
              <p><span className="font-bold text-slate-900">Local projection status:</span> {localProjection?.status ?? "placeholder"}</p>
            </div>
            <p className="mt-4 leading-6 text-slate-500">The nonlinear stress floor is not a claim that CPI must rise by this much. It is a stress-scenario guardrail used to avoid understating possible inflationary pressure during severe or extreme oil shocks.</p>
          </div>
        </div>
      </details>
    </section>
  );
}
