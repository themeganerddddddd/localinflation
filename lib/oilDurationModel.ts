import type { OilHorizon, PassThroughSetting } from "@/lib/oilCalculations";

export type OilDurationModelInput = {
  oilChangePct: number;
  gasolineChangePct: number;
  directGasolineContributionPp: number;
  expandedEnergyLowPp: number;
  expandedEnergyHighPp: number;
  durationMonths: number;
  horizon: OilHorizon;
  passThroughSetting: PassThroughSetting;
  localOilExposureMultiplier: number;
  cpiMomentumPct?: number;
  oilVolatilityPct?: number;
};

export type OilDurationModelOutput = {
  monthlyPressureLowPct: number;
  monthlyPressureHighPct: number;
  cumulativePressureLowPct: number;
  cumulativePressureHighPct: number;
  energyChannelContributionPp: number;
  indirectChannelContributionPp: number;
  durationMultiplier: number;
  shockPersistenceMultiplier: number;
  passThroughMultiplier: number;
  cpiMomentumMultiplier: number;
  volatilityMultiplier: number;
  localOilExposureMultiplier: number;
  explanation: string;
};

export const DURATION_PASS_THROUGH_MULTIPLIER: Record<PassThroughSetting, number> = {
  conservative: 0.85,
  baseline: 1,
  high: 1.2
};

export function durationMultiplier(durationMonths: number): number {
  if (durationMonths <= 1) return 0.25;
  if (durationMonths <= 3) return 0.55;
  if (durationMonths <= 6) return 0.85;
  if (durationMonths <= 12) return 1;
  if (durationMonths <= 24) return 1.15;
  return 1.3;
}

export function shockPersistenceMultiplier(oilChangePct: number, durationMonths: number): number {
  const absShock = Math.abs(oilChangePct);

  const shockFactor = absShock < 0.25 ? 1 : absShock < 0.5 ? 1.15 : absShock < 1 ? 1.35 : 1.6;
  const durationFactor = durationMonths <= 3 ? 0.75 : durationMonths <= 12 ? 1 : 1.2;

  return shockFactor * durationFactor;
}

export function calculateOilDurationImpact(input: OilDurationModelInput): OilDurationModelOutput {
  const dMult = durationMultiplier(input.durationMonths);
  const persistenceMult = shockPersistenceMultiplier(input.oilChangePct, input.durationMonths);
  const passMult = DURATION_PASS_THROUGH_MULTIPLIER[input.passThroughSetting];

  const cpiMomentumMult =
    input.cpiMomentumPct === undefined ? 1 : input.cpiMomentumPct < 2 ? 0.9 : input.cpiMomentumPct < 4 ? 1 : input.cpiMomentumPct < 6 ? 1.1 : 1.2;

  const volatilityMult =
    input.oilVolatilityPct === undefined ? 1 : input.oilVolatilityPct < 15 ? 0.95 : input.oilVolatilityPct < 35 ? 1 : 1.15;

  const energyChannelLow =
    input.expandedEnergyLowPp * dMult * persistenceMult * passMult * input.localOilExposureMultiplier;

  const energyChannelHigh =
    input.expandedEnergyHighPp * dMult * persistenceMult * passMult * input.localOilExposureMultiplier;

  const indirectBase = Math.max(0, energyChannelHigh - input.directGasolineContributionPp);
  const indirectLow = indirectBase * 0.5 * cpiMomentumMult * volatilityMult;
  const indirectHigh = indirectBase * 1.25 * cpiMomentumMult * volatilityMult;

  const cumulativePressureLowPct = Math.max(input.directGasolineContributionPp, energyChannelLow + indirectLow);
  const cumulativePressureHighPct = Math.max(cumulativePressureLowPct, energyChannelHigh + indirectHigh);

  const monthlyPressureLowPct = cumulativePressureLowPct / Math.max(1, input.durationMonths);
  const monthlyPressureHighPct = cumulativePressureHighPct / Math.max(1, input.durationMonths);

  return {
    monthlyPressureLowPct,
    monthlyPressureHighPct,
    cumulativePressureLowPct,
    cumulativePressureHighPct,
    energyChannelContributionPp: energyChannelHigh,
    indirectChannelContributionPp: indirectHigh,
    durationMultiplier: dMult,
    shockPersistenceMultiplier: persistenceMult,
    passThroughMultiplier: passMult,
    cpiMomentumMultiplier: cpiMomentumMult,
    volatilityMultiplier: volatilityMult,
    localOilExposureMultiplier: input.localOilExposureMultiplier,
    explanation:
      "This model estimates cumulative CPI pressure while oil remains elevated. It starts with the direct gasoline contribution, expands to energy-related CPI channels, then adjusts for duration, shock persistence, pass-through assumptions, local exposure, CPI momentum, and oil volatility."
  };
}
