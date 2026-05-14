export type PassThroughSetting = "conservative" | "baseline" | "high";
export type OilShockClass = "small" | "moderate" | "large" | "severe" | "extreme";
export type OilHorizon = "1m" | "3m" | "6m" | "12m" | "36m";

export type OilCpiComponent = {
  component: string;
  slug: string;
  default_cpi_weight: number;
  oil_sensitivity_conservative: number;
  oil_sensitivity_baseline: number;
  oil_sensitivity_high: number;
  timing_months: number;
  channel: "direct" | "indirect";
};

export type OilComponentEffect = {
  component: string;
  slug: string;
  cpiWeight: number;
  oilSensitivity: number;
  componentPriceChangePct: number;
  componentCpiEffectPp: number;
  cpiContributionPp: number;
  timingMonths: number;
  channel: "direct" | "indirect";
};

export const OIL_TO_GAS_PASS_THROUGH: Record<PassThroughSetting, number> = {
  conservative: 0.35,
  baseline: 0.5,
  high: 0.65
};

export const DEFAULT_GASOLINE_CPI_WEIGHT = 0.03;

export const HORIZON_INDIRECT_MULTIPLIER: Record<OilHorizon, number> = {
  "1m": 0.25,
  "3m": 0.6,
  "6m": 0.85,
  "12m": 1,
  "36m": 1.2
};

export const PASS_THROUGH_RISK_MULTIPLIER: Record<PassThroughSetting, number> = {
  conservative: 0.85,
  baseline: 1,
  high: 1.2
};

export function oilPriceChangePct(currentOilPrice: number, scenarioOilPrice: number): number {
  if (currentOilPrice <= 0) return 0;
  return scenarioOilPrice / currentOilPrice - 1;
}

export function gasolinePriceEffectPct(oilChangePct: number, passThrough: number): number {
  return oilChangePct * passThrough;
}

export function directCpiEffectPp(gasolineChangePct: number, gasolineCpiWeight: number): number {
  return gasolineChangePct * gasolineCpiWeight * 100;
}

export function broaderCpiRange(directEffectPp: number, setting: PassThroughSetting): { low: number; high: number } {
  const highMultiplier = setting === "conservative" ? 1.5 : setting === "high" ? 2.8 : 2.2;
  return {
    low: directEffectPp,
    high: directEffectPp * highMultiplier
  };
}

export function getPassThroughValue(setting: PassThroughSetting): number {
  return OIL_TO_GAS_PASS_THROUGH[setting];
}

export function classifyOilShock(oilChangePct: number): OilShockClass {
  const absShock = Math.abs(oilChangePct);
  if (absShock < 0.1) return "small";
  if (absShock < 0.25) return "moderate";
  if (absShock < 0.5) return "large";
  if (absShock < 1) return "severe";
  return "extreme";
}

export function oilShockStressMultiplier(oilChangePct: number): number {
  const absShock = Math.abs(oilChangePct);
  if (absShock < 0.2) return 1;
  if (absShock < 0.4) return 1.15;
  if (absShock < 0.75) return 1.35;
  if (absShock < 1) return 1.65;
  return 2;
}

export function oilHorizonFromMonths(months: number): OilHorizon {
  if (months <= 1) return "1m";
  if (months <= 3) return "3m";
  if (months <= 6) return "6m";
  if (months <= 12) return "12m";
  return "36m";
}

export function calculateDirectGasolineCpiEffect({
  currentOilPrice,
  scenarioOilPrice,
  oilToGasPassThrough,
  gasolineCpiWeight
}: {
  currentOilPrice: number;
  scenarioOilPrice: number;
  oilToGasPassThrough: number;
  gasolineCpiWeight: number;
}) {
  const oilChangePct = currentOilPrice > 0 ? scenarioOilPrice / currentOilPrice - 1 : 0;
  const gasolineChangePct = oilChangePct * oilToGasPassThrough;
  const directGasolineCpiEffectPp = gasolineChangePct * gasolineCpiWeight * 100;

  return {
    oilChangePct,
    gasolineChangePct,
    directGasolineCpiEffectPp
  };
}

export function getComponentSensitivity(component: OilCpiComponent, setting: PassThroughSetting): number {
  if (setting === "conservative") return component.oil_sensitivity_conservative;
  if (setting === "high") return component.oil_sensitivity_high;
  return component.oil_sensitivity_baseline;
}

export function componentCpiEffects(
  oilChangePct: number,
  components: OilCpiComponent[],
  setting: PassThroughSetting
): OilComponentEffect[] {
  return components.map((component) => {
    const oilSensitivity = getComponentSensitivity(component, setting);
    const componentPriceChangePct = oilChangePct * oilSensitivity;
    const cpiContributionPp = componentPriceChangePct * component.default_cpi_weight * 100;
    return {
      component: component.component,
      slug: component.slug,
      cpiWeight: component.default_cpi_weight,
      oilSensitivity,
      componentPriceChangePct,
      componentCpiEffectPp: cpiContributionPp,
      cpiContributionPp,
      timingMonths: component.timing_months,
      channel: component.channel
    };
  });
}

export function totalComponentEffectPp(effects: OilComponentEffect[]): number {
  return effects.reduce((sum, effect) => sum + effect.cpiContributionPp, 0);
}

export function splitDirectIndirectEffects(effects: OilComponentEffect[]): { direct: number; indirect: number; total: number } {
  const direct = effects.filter((effect) => effect.channel === "direct").reduce((sum, effect) => sum + effect.cpiContributionPp, 0);
  const indirect = effects.filter((effect) => effect.channel === "indirect").reduce((sum, effect) => sum + effect.cpiContributionPp, 0);
  return {
    direct,
    indirect,
    total: direct + indirect
  };
}

export function calculateExpandedEnergyEffect({
  directGasolineCpiEffectPp,
  componentEffects
}: {
  directGasolineCpiEffectPp: number;
  componentEffects: OilComponentEffect[];
}) {
  const directEnergyComponents = componentEffects.filter((effect) =>
    ["gasoline", "fuel-oil", "household-energy", "electricity", "utilities"].includes(effect.slug)
  );

  const totalDirectEnergyEffectPp = directEnergyComponents.reduce((sum, effect) => sum + effect.cpiContributionPp, 0);

  const expandedEnergyLow = Math.max(directGasolineCpiEffectPp, totalDirectEnergyEffectPp * 0.85);
  const expandedEnergyHigh = Math.max(directGasolineCpiEffectPp, totalDirectEnergyEffectPp * 1.2);

  return {
    expandedEnergyLow,
    expandedEnergyHigh
  };
}

export function calculateStressScenarioTotalCpiPressure({
  directGasolineCpiEffectPp,
  expandedEnergyLow,
  expandedEnergyHigh,
  componentEffects,
  oilChangePct,
  horizon,
  passThroughSetting,
  localOilExposureMultiplier = 1
}: {
  directGasolineCpiEffectPp: number;
  expandedEnergyLow: number;
  expandedEnergyHigh: number;
  componentEffects: OilComponentEffect[];
  oilChangePct: number;
  horizon: OilHorizon;
  passThroughSetting: PassThroughSetting;
  localOilExposureMultiplier?: number;
}) {
  const shockClass = classifyOilShock(oilChangePct);
  const stressMultiplier = oilShockStressMultiplier(oilChangePct);
  const horizonMultiplier = HORIZON_INDIRECT_MULTIPLIER[horizon];
  const passThroughRiskMultiplier = PASS_THROUGH_RISK_MULTIPLIER[passThroughSetting];

  const indirectComponentEffectPp = componentEffects
    .filter((effect) => effect.channel === "indirect")
    .reduce((sum, effect) => sum + effect.cpiContributionPp, 0);

  const adjustedIndirectLow =
    indirectComponentEffectPp *
    stressMultiplier *
    horizonMultiplier *
    passThroughRiskMultiplier *
    localOilExposureMultiplier *
    0.75;

  const adjustedIndirectHigh =
    indirectComponentEffectPp *
    stressMultiplier *
    horizonMultiplier *
    passThroughRiskMultiplier *
    localOilExposureMultiplier *
    1.5;

  let stressLow = expandedEnergyLow + adjustedIndirectLow;
  let stressHigh = expandedEnergyHigh + adjustedIndirectHigh;

  let minimumHigh = directGasolineCpiEffectPp;
  if (shockClass === "large") {
    minimumHigh = directGasolineCpiEffectPp * 2.25;
  } else if (shockClass === "severe") {
    minimumHigh = directGasolineCpiEffectPp * 3.25;
  } else if (shockClass === "extreme") {
    minimumHigh = directGasolineCpiEffectPp * 4;
  }

  stressHigh = Math.max(stressHigh, minimumHigh);

  if (shockClass === "severe" || shockClass === "extreme") {
    stressLow = Math.max(stressLow, directGasolineCpiEffectPp * 1.75);
  }

  return {
    shockClass,
    stressLow,
    stressHigh,
    stressMultiplier,
    horizonMultiplier,
    passThroughRiskMultiplier,
    localOilExposureMultiplier
  };
}
