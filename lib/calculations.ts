import type { CpiPoint, FutureScenario } from "@/lib/types";

export function adjustForInflation(amount: number, cpiStart: number, cpiEnd: number): number {
  return amount * (cpiEnd / cpiStart);
}

export function percentChange(start: number, end: number): number {
  return ((end / start) - 1) * 100;
}

export function realWageChange(wageStart: number, wageEnd: number, cpiStart: number, cpiEnd: number): number {
  const wageGrowth = wageEnd / wageStart;
  const priceGrowth = cpiEnd / cpiStart;
  return (wageGrowth / priceGrowth) - 1;
}

export function annualizedGrowthRate(startValue: number, endValue: number, years: number): number {
  if (years <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

export function futureCost(amount: number, annualRate: number, years: number): number {
  return amount * Math.pow(1 + annualRate, years);
}

export function annualInflationRates(cpiValues: CpiPoint[]): number[] {
  return [...cpiValues]
    .sort((a, b) => a.year - b.year)
    .slice(1)
    .map((point, index, sortedTail) => {
      const previous = [...cpiValues].sort((a, b) => a.year - b.year)[index];
      return point.index / previous.index - 1;
    });
}

export function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = average(values);
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function buildFutureScenarios(
  cpiValues: CpiPoint[],
  currentAmount: number,
  currentYear: number,
  targetYear: number
): FutureScenario[] {
  const rates = annualInflationRates(cpiValues);
  const latestRates = rates.slice(-10);
  const recentThree = rates.slice(-3);
  const yearsForward = Math.max(0, targetYear - currentYear);
  const baselineWindow = latestRates.length ? latestRates : rates;
  const baseline = average(baselineWindow);
  const rawLow = percentile(rates, 0.25);
  const recentThreeAverage = average(recentThree);
  const upperHistoricalRate = Math.max(percentile(rates, 0.75), percentile(rates, 0.9));
  const volatilityPremiumRate = baseline + standardDeviation(baselineWindow) * 0.5;
  const rawHigh = Math.max(
    upperHistoricalRate,
    recentThreeAverage,
    volatilityPremiumRate
  );
  const low = Math.min(rawLow, baseline);
  const high = Math.max(rawHigh, baseline);

  return [
    { label: "Low", annualRate: low, value: futureCost(currentAmount, low, yearsForward) },
    { label: "Baseline", annualRate: baseline, value: futureCost(currentAmount, baseline, yearsForward) },
    { label: "High", annualRate: high, value: futureCost(currentAmount, high, yearsForward) }
  ];
}

export function getAvailableYears(cpiValues: CpiPoint[]): number[] {
  return cpiValues.map((point) => point.year).sort((a, b) => a - b);
}

export function getNearestAvailableYear(year: number, availableYears: number[]): number {
  return availableYears.reduce((nearest, candidate) =>
    Math.abs(candidate - year) < Math.abs(nearest - year) ? candidate : nearest
  , availableYears[0]);
}
