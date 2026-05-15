"use client";

import MetroSelector from "@/components/MetroSelector";
import type { PassThroughSetting } from "@/lib/oilCalculations";
import type { Metro } from "@/lib/types";

export type OilModelView = "simple" | "component" | "duration" | "localProjection" | "econometric" | "ml";

type OilScenarioFormProps = {
  metros: Metro[];
  location: string;
  setLocation: (value: string) => void;
  currentOilPrice: number;
  setCurrentOilPrice: (value: number) => void;
  scenarioOilPrice: number;
  setScenarioOilPrice: (value: number) => void;
  horizon: number;
  setHorizon: (value: number) => void;
  passThrough: PassThroughSetting;
  setPassThrough: (value: PassThroughSetting) => void;
};

const horizons = [
  { label: "1 month", value: 1 },
  { label: "3 months", value: 3 },
  { label: "6 months", value: 6 },
  { label: "12 months", value: 12 },
  { label: "3 years", value: 36 }
];

export default function OilScenarioForm(props: OilScenarioFormProps) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetroSelector metros={props.metros} value={props.location} onChange={props.setLocation} />
      <label className="block min-w-0 text-sm font-semibold text-slate-800">
        Current oil price per barrel
        <div className="mt-2 flex rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <span className="flex items-center rounded-l-xl bg-slate-50 px-4 text-slate-500">$</span>
          <input className="min-w-0 flex-1 rounded-r-xl px-4 py-3 font-bold outline-none" type="number" min={1} value={props.currentOilPrice} onChange={(event) => props.setCurrentOilPrice(Math.max(1, Number(event.target.value)))} />
        </div>
      </label>
      <label className="block min-w-0 text-sm font-semibold text-slate-800">
        Scenario oil price per barrel
        <div className="mt-2 flex rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <span className="flex items-center rounded-l-xl bg-slate-50 px-4 text-slate-500">$</span>
          <input className="min-w-0 flex-1 rounded-r-xl px-4 py-3 font-bold outline-none" type="number" min={1} value={props.scenarioOilPrice} onChange={(event) => props.setScenarioOilPrice(Math.max(1, Number(event.target.value)))} />
        </div>
      </label>
      <label className="block min-w-0 text-sm font-semibold text-slate-800">
        Time horizon
        <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={props.horizon} onChange={(event) => props.setHorizon(Number(event.target.value))}>
          {horizons.map((horizon) => <option key={horizon.value} value={horizon.value}>{horizon.label}</option>)}
        </select>
      </label>
      <label className="block min-w-0 text-sm font-semibold text-slate-800">
        Pass-through setting
        <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={props.passThrough} onChange={(event) => props.setPassThrough(event.target.value as PassThroughSetting)}>
          <option value="conservative">Conservative</option>
          <option value="baseline">Baseline</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>
  );
}
