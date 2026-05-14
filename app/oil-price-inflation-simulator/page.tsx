import type { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import OilInflationSimulator from "@/components/OilInflationSimulator";
import type { OilMacroMonthlyPoint } from "@/components/OilHistoricalRelationshipChart";
import type { OilLocalProjectionPayload } from "@/components/OilLocalProjectionResults";
import type { OilVarPayload } from "@/components/OilVarResults";
import type { OilGbdtPayload } from "@/components/OilGbdtResults";
import { getAllMetros } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Oil Price Inflation Simulator | LocalInflation",
  "Estimate how changes in oil prices may affect inflation through gasoline, energy costs, transportation, producer prices, and broader CPI pass-through.",
  "/oil-price-inflation-simulator"
);

const oilFaq = [
  { question: "How do oil prices affect inflation?", answer: "Oil can affect inflation through gasoline, heating fuel, diesel, transportation, freight, producer prices, and expectations." },
  { question: "Why can a large oil shock have a smaller direct CPI effect?", answer: "Gasoline can rise sharply, but gasoline is only one part of the overall CPI basket." },
  { question: "What is oil-to-gasoline pass-through?", answer: "It is an assumption about how much of a crude oil price change reaches retail gasoline prices." },
  { question: "Why are oil simulator results scenario estimates?", answer: "Oil pass-through depends on timing, duration, local exposure, and broader economic conditions, so results are ranges rather than forecasts." },
  { question: "Why do different oil models show different values?", answer: "Each model answers a different question, from direct gasoline contribution to broader stress scenarios and historical pass-through estimates." }
];

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Oil Price Inflation Simulator", url: "/oil-price-inflation-simulator" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(oilFaq)) }} />
      <section>
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Scenario simulator</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Oil Price Inflation Simulator</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">Estimate how a change in crude oil prices could affect inflation through gasoline, energy costs, transportation, producer prices, and broader price pass-through. Results are scenario estimates based on historical research and public data, not forecasts or financial advice.</p>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">What this simulator does</h2>
        <p className="mt-3 leading-7 text-slate-600">Use this simulator to estimate possible CPI pressure from oil-price changes through gasoline, energy, transportation, freight, producer prices, and other pass-through channels. Results are scenario estimates, not forecasts.</p>
      </section>
      <OilInflationSimulator metros={getAllMetros()} oilMacroMonthly={getOilMacroMonthlyData()} localProjection={getLocalProjectionData()} varModel={getVarData()} gbdtModel={getGbdtData()} />
      <FAQBlock items={oilFaq} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Related tools</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator">Inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/wage-vs-inflation">Wages vs inflation</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/future-costs">Future cost calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/methodology">Methodology</Link>
        </div>
      </section>
    </main>
  );
}
