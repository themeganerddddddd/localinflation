import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import MethodologyNote from "@/components/MethodologyNote";
import RankingHighlights from "@/components/RankingHighlights";
import { getAllMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

export const metadata: Metadata = pageMetadata(
  "Local Inflation Calculator by City",
  "Choose a city, amount, base year, and comparison year to calculate local purchasing power.",
  "/inflation-calculator"
);

export default function InflationCalculatorPage() {
  const metros = getAllMetros();
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Local inflation calculator</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Choose any available base year and comparison year. The calculator derives year options from the selected location’s CPI series.</p>
      </div>
      <Calculator metros={metros} initialSlug="united-states" cpiBySlug={cpi} wagesBySlug={wages} />
      <RankingHighlights />
      <MethodologyNote />
    </main>
  );
}
