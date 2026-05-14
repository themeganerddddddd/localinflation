import type { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";
import AdSlot from "@/components/AdSlot";
import OilInflationSimulator from "@/components/OilInflationSimulator";
import type { OilMacroMonthlyPoint } from "@/components/OilHistoricalRelationshipChart";
import type { OilLocalProjectionPayload } from "@/components/OilLocalProjectionResults";
import type { OilVarPayload } from "@/components/OilVarResults";
import type { OilGbdtPayload } from "@/components/OilGbdtResults";
import { getAllMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Oil Price Inflation Simulator | LocalInflation",
  "Estimate how changes in oil prices may affect inflation through gasoline, energy costs, transportation, producer prices, and broader CPI pass-through.",
  "/oil-price-inflation-simulator"
);

function getOilMacroMonthlyData(): OilMacroMonthlyPoint[] {
  try {
    const filePath = path.join(process.cwd(), "data", "generated", "oil_macro_monthly.json");
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as { observations?: OilMacroMonthlyPoint[] } | OilMacroMonthlyPoint[];
    return Array.isArray(parsed) ? parsed : parsed.observations ?? [];
  } catch {
    return [];
  }
}

function getLocalProjectionData(): OilLocalProjectionPayload {
  try {
    const filePath = path.join(process.cwd(), "data", "generated", "oil_local_projection_responses.json");
    return JSON.parse(readFileSync(filePath, "utf8")) as OilLocalProjectionPayload;
  } catch {
    return {
      model: "Local Projections",
      status: "placeholder",
      shock: "10_percent_oil_price_increase",
      description: "Historical model not trained yet. This section is designed to estimate CPI responses after oil shocks using historical monthly oil and CPI data.",
      responses: []
    };
  }
}

function getVarData(): OilVarPayload {
  try {
    const filePath = path.join(process.cwd(), "data", "generated", "oil_var_impulse_responses.json");
    return JSON.parse(readFileSync(filePath, "utf8")) as OilVarPayload;
  } catch {
    return { model: "VAR", status: "placeholder", shock: "one_standard_deviation_wti_shock", description: "VAR impulse-response model not trained yet.", responses: [] };
  }
}

function getGbdtData(): OilGbdtPayload {
  try {
    const filePath = path.join(process.cwd(), "data", "generated", "oil_gbdt_scenarios.json");
    return JSON.parse(readFileSync(filePath, "utf8")) as OilGbdtPayload;
  } catch {
    return { model: "GBDT", status: "placeholder", description: "GBDT model not trained yet.", scenario_estimates: [] };
  }
}

export default function OilPriceInflationSimulatorPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Scenario simulator</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Oil Price Inflation Simulator</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">Estimate how a change in crude oil prices could affect inflation through gasoline, energy costs, transportation, producer prices, and broader price pass-through. Results are scenario estimates based on historical research and public data, not forecasts or financial advice.</p>
      </section>
      <OilInflationSimulator metros={getAllMetros()} oilMacroMonthly={getOilMacroMonthlyData()} localProjection={getLocalProjectionData()} varModel={getVarData()} gbdtModel={getGbdtData()} />
      <AdSlot slotName="oil-simulator-lower-body" />
    </main>
  );
}
