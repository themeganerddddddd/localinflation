import { percentChange } from "@/lib/calculations";
import type { CpiPoint, DataCoverage, OilPricePoint } from "@/lib/types";

type OilFeatures = {
  oilShockPct: number;
  cpiMomentumPct: number;
  oilVolatilityPct: number;
  regionalSensitivity: number;
};

type TreeNode =
  | { value: number }
  | { feature: keyof OilFeatures; threshold: number; left: TreeNode; right: TreeNode };

const impactTrees: TreeNode[] = [
  {
    feature: "oilShockPct",
    threshold: 25,
    left: { feature: "cpiMomentumPct", threshold: 4, left: { value: 0.08 }, right: { value: 0.22 } },
    right: { feature: "regionalSensitivity", threshold: 1.08, left: { value: 0.55 }, right: { value: 0.78 } }
  },
  {
    feature: "oilShockPct",
    threshold: 60,
    left: { feature: "oilVolatilityPct", threshold: 35, left: { value: 0.06 }, right: { value: 0.18 } },
    right: { value: 0.46 }
  },
  {
    feature: "cpiMomentumPct",
    threshold: 6,
    left: { feature: "oilShockPct", threshold: 0, left: { value: -0.08 }, right: { value: 0.11 } },
    right: { feature: "regionalSensitivity", threshold: 1.12, left: { value: 0.22 }, right: { value: 0.38 } }
  },
  {
    feature: "regionalSensitivity",
    threshold: 0.95,
    left: { value: -0.03 },
    right: { feature: "oilShockPct", threshold: 40, left: { value: 0.09 }, right: { value: 0.25 } }
  }
];

const lagTrees: TreeNode[] = [
  {
    feature: "oilShockPct",
    threshold: 30,
    left: { feature: "cpiMomentumPct", threshold: 5, left: { value: 8 }, right: { value: 6 } },
    right: { feature: "oilVolatilityPct", threshold: 30, left: { value: 5 }, right: { value: 3 } }
  },
  {
    feature: "regionalSensitivity",
    threshold: 1.1,
    left: { value: 7 },
    right: { feature: "oilShockPct", threshold: 50, left: { value: 5 }, right: { value: 3 } }
  },
  {
    feature: "cpiMomentumPct",
    threshold: 7,
    left: { value: 6 },
    right: { value: 4 }
  }
];

function evaluateTree(tree: TreeNode, features: OilFeatures): number {
  if ("value" in tree) return tree.value;
  return features[tree.feature] <= tree.threshold
    ? evaluateTree(tree.left, features)
    : evaluateTree(tree.right, features);
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

export function regionalOilSensitivity(coverage: DataCoverage, slug: string): number {
  if (["houston", "dallas", "san-antonio", "new-orleans", "oklahoma-city"].includes(slug)) return 1.18;
  if (["los-angeles", "riverside", "san-diego", "phoenix", "las-vegas"].includes(slug)) return 1.12;
  if (coverage === "national_cpi") return 1;
  if (coverage === "regional_proxy_cpi") return 1.04;
  return 1.02;
}

export function estimateOilInflationImpact(options: {
  enteredOilPrice: number;
  baseYear: number;
  durationMonths: number;
  passThrough: "low" | "baseline" | "high";
  cpiValues: CpiPoint[];
  oilPrices: OilPricePoint[];
  regionalSensitivity: number;
}) {
  const historicalOil = options.oilPrices.find((point) => point.year === options.baseYear) ?? options.oilPrices.at(-1);
  const currentCpi = options.cpiValues.find((point) => point.year === options.baseYear) ?? options.cpiValues.at(-1);
  const previousCpi = options.cpiValues.find((point) => point.year === (currentCpi?.year ?? options.baseYear) - 1) ?? options.cpiValues[0];
  const nearbyOil = options.oilPrices.filter((point) => Math.abs(point.year - options.baseYear) <= 2);
  const oilMoves = nearbyOil.slice(1).map((point, index) => Math.abs(percentChange(nearbyOil[index].price, point.price)));
  const features: OilFeatures = {
    oilShockPct: historicalOil ? percentChange(historicalOil.price, options.enteredOilPrice) : 0,
    cpiMomentumPct: currentCpi && previousCpi ? percentChange(previousCpi.index, currentCpi.index) : 0,
    oilVolatilityPct: average(oilMoves),
    regionalSensitivity: options.regionalSensitivity
  };

  const passThroughMultiplier = options.passThrough === "low" ? 0.7 : options.passThrough === "high" ? 1.45 : 1;
  const passThroughShare = options.passThrough === "low" ? 0.45 : options.passThrough === "high" ? 0.95 : 0.68;
  const durationMultiplier = Math.min(3.2, Math.sqrt(Math.max(1, options.durationMonths) / 3));
  const rawImpact = average(impactTrees.map((tree) => evaluateTree(tree, features)));
  const energyWeight = 0.072;
  const transportAndGoodsSpillover = 0.035;
  const energyChannelImpact = features.oilShockPct * (energyWeight + transportAndGoodsSpillover) * passThroughShare;
  const extremeShockAmplifier = Math.max(0, Math.abs(features.oilShockPct) - 75) * 0.018;
  const adjustedImpact = (rawImpact * passThroughMultiplier + energyChannelImpact + extremeShockAmplifier) * options.regionalSensitivity;
  const sustainedImpact = adjustedImpact * durationMultiplier;
  const lagMonths = Math.round(average(lagTrees.map((tree) => evaluateTree(tree, features))));
  const monthlyPressure = sustainedImpact / Math.max(1, options.durationMonths);
  const decayMonths = Math.max(2, Math.round(lagMonths * 0.75 + options.durationMonths * 0.25));

  return {
    historicalOilPrice: historicalOil?.price ?? options.enteredOilPrice,
    oilShockPct: features.oilShockPct,
    cpiMomentumPct: features.cpiMomentumPct,
    estimatedInflationImpactPct: adjustedImpact,
    sustainedInflationImpactPct: sustainedImpact,
    estimatedMonthlyInflationPct: monthlyPressure,
    energyChannelImpactPct: energyChannelImpact,
    lagMonths,
    decayMonths,
    confidence: Math.abs(features.oilShockPct) > 70 ? "Lower" : Math.abs(features.oilShockPct) > 30 ? "Medium" : "Higher"
  };
}
