import type { Metadata } from "next";
import HighestInflationRankings from "@/components/HighestInflationRankings";
import { getAllMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";

export const metadata: Metadata = pageMetadata("Highest Inflation Rankings", "Rank cities by recent CPI inflation.", "/rankings/highest-inflation");

export default function HighestInflationPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Highest inflation rankings</h1>
        <p className="mt-3 text-lg text-slate-600">Rank cities by inflation from a selected base year to the latest available CPI year.</p>
      </div>
      <HighestInflationRankings metros={getAllMetros()} cpiBySlug={cpi} />
    </main>
  );
}
