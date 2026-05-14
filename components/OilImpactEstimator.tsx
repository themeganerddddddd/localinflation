"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ResultCard from "@/components/ResultCard";
import YearSelector from "@/components/YearSelector";
import { formatDollar, formatPercent } from "@/lib/formatters";
import { estimateOilInflationImpact, regionalOilSensitivity } from "@/lib/oil-impact";
import type { CpiPoint, Metro, OilPricePoint } from "@/lib/types";

type OilImpactEstimatorProps = {
  metro?: Metro;
  cpiValues: CpiPoint[];
  oilPrices: OilPricePoint[];
};

export default function OilImpactEstimator({ metro, cpiValues, oilPrices }: OilImpactEstimatorProps) {
  const oilYears = useMemo(() => oilPrices.map((point) => point.year), [oilPrices]);
  const latestOil = oilPrices.at(-1);
  const [oilPrice, setOilPrice] = useState(latestOil?.price ?? 76);
  const [baseYear, setBaseYear] = useState(latestOil?.year ?? 2026);
  const [durationMonths, setDurationMonths] = useState(6);
  const [passThrough, setPassThrough] = useState<"low" | "baseline" | "high">("baseline");
  const sensitivity = regionalOilSensitivity(metro?.data_coverage ?? "national_cpi", metro?.slug ?? "united-states");
  const estimate = estimateOilInflationImpact({
    enteredOilPrice: oilPrice,
    baseYear,
    durationMonths,
    passThrough,
    cpiValues,
    oilPrices,
    regionalSensitivity: sensitivity
  });
  const oilHistory = oilPrices.map((point) => ({ year: point.year, oil: point.price }));
  const driverData = [
    { name: "Oil shock", value: estimate.oilShockPct },
    { name: "CPI trend", value: estimate.cpiMomentumPct },
    { name: "Energy-channel pressure", value: estimate.energyChannelImpactPct },
    { name: "Sustained impact", value: estimate.sustainedInflationImpactPct }
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-800">
          Enter oil price per barrel
          <div className="mt-2 flex rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
            <span className="flex items-center rounded-l-xl bg-slate-50 px-4 text-slate-500">$</span>
            <input
              aria-label="Enter oil price per barrel"
              className="min-w-0 flex-1 rounded-r-xl px-4 py-3 text-lg font-bold text-slate-950 outline-none"
              min={1}
              step={1}
              type="number"
              value={oilPrice}
              onChange={(event) => setOilPrice(Math.max(1, Number(event.target.value)))}
            />
          </div>
        </label>
        <YearSelector label="Historical comparison year" years={oilYears} value={baseYear} onChange={setBaseYear} />
        <label className="block text-sm font-semibold text-slate-800">
          Sustained duration
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold shadow-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            value={durationMonths}
            onChange={(event) => setDurationMonths(Number(event.target.value))}
          >
            {[1, 3, 6, 12, 18, 24].map((months) => (
              <option key={months} value={months}>{months} months</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-800">
          Pass-through
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold shadow-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            value={passThrough}
            onChange={(event) => setPassThrough(event.target.value as "low" | "baseline" | "high")}
          >
            <option value="low">Low</option>
            <option value="baseline">Baseline</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-600">Historical oil price</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{formatDollar(estimate.historicalOilPrice)}</p>
          <p className="mt-1 text-xs text-slate-500">Annual average for {baseYear}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-600">Scenario assumption</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{durationMonths} months</p>
          <p className="mt-1 text-xs text-slate-500">{passThrough} pass-through into CPI categories</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <ResultCard eyebrow="Experimental tree-based scenario estimate" title="Experimental sustained CPI pressure" value={formatPercent(estimate.sustainedInflationImpactPct)} detail="Estimated cumulative possible CPI pressure while oil remains elevated." tone="blue" />
        <ResultCard title="Average monthly scenario pressure" value={formatPercent(estimate.estimatedMonthlyInflationPct)} detail="Average monthly CPI pressure during the sustained period." tone="green" />
        <ResultCard title="Experimental energy-channel pressure" value={formatPercent(estimate.energyChannelImpactPct)} detail="Scenario channel for energy, transport, and goods spillovers." />
        <ResultCard title="Oil price shock" value={formatPercent(estimate.oilShockPct)} detail={`Compared with the historical ${baseYear} oil price.`} />
        <ResultCard title="Peak delay" value={`${estimate.lagMonths} months`} detail={`Pressure may fade over roughly ${estimate.decayMonths} months after oil normalizes.`} tone="amber" />
      </div>
      <ResultCard title="Model confidence" value={estimate.confidence} detail="Lower confidence means the entered oil price is farther outside historical patterns. Sustained scenarios should be read directionally, not as forecasts." />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Oil history</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">Oil prices in the CPI history window</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oilHistory}>
                <defs>
                  <linearGradient id="oilFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} width={42} />
                <Tooltip formatter={(value) => [formatDollar(Number(value)), "Oil price"]} />
                <Area type="monotone" dataKey="oil" stroke="#0f766e" strokeWidth={3} fill="url(#oilFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Model inputs</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">Scenario drivers</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} width={44} />
                <Tooltip formatter={(value) => [formatPercent(Number(value)), "Value"]} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        This is a hand-coded tree-based scenario model. It is not yet a trained GBDT model. A future version can train a real gradient-boosted model on historical oil, gasoline, CPI, PPI, labor-market, and interest-rate data. The direct gasoline effect can look much smaller than the sustained-impact estimate because it only measures gasoline's direct CPI-basket contribution. The sustained-impact estimate includes broader assumptions about duration, regional sensitivity, CPI momentum, volatility, and indirect channels.
      </div>
    </div>
  );
}
