import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FutureCostExplorer from "@/components/FutureCostExplorer";
import { getAllMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";

export const metadata: Metadata = pageMetadata(
  "Future Cost Index",
  "Estimate how much today’s dollars may need to become under low, baseline, and high inflation scenarios.",
  "/future-costs"
);

export default function FutureCostsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Future Cost Index</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Scenario estimates based on historical inflation, not predictions or financial advice.</p>
      </div>
      <FutureCostExplorer metros={getAllMetros()} cpiBySlug={cpi} />
      <AdSlot slotName="future-costs-lower-body" />
    </main>
  );
}
