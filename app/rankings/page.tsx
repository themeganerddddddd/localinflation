import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Inflation and Wage Rankings", "Compare metro inflation and wage growth rankings.", "/rankings");

export default function RankingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Rankings</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" href="/rankings/highest-inflation">
          <h2 className="text-xl font-bold text-slate-950">Highest inflation</h2>
          <p className="mt-2 text-slate-600">Compare inflation since 2019, 2020, and the selected base year.</p>
        </Link>
        <Link className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" href="/rankings/wages-vs-inflation">
          <h2 className="text-xl font-bold text-slate-950">Wages vs inflation</h2>
          <p className="mt-2 text-slate-600">See where wages beat or trailed price growth.</p>
        </Link>
      </div>
      <div className="mt-8">
        <AdSlot slotName="rankings-lower-body" />
      </div>
    </main>
  );
}
