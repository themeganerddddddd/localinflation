export function formatDollar(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatYearRange(startYear: number, endYear: number): string {
  return startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`;
}
