import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import { getAllMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

export const metadata: Metadata = pageMetadata("Compare City Inflation", "Compare inflation, wage growth, and future cost scenarios between two cities.", "/compare");

export default function ComparePage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Compare city inflation</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Compare inflation, wage growth, and future cost scenarios between two cities.</p>
      </div>
      <Calculator metros={getAllMetros()} initialSlug="new-york" cpiBySlug={cpi} wagesBySlug={wages} />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Popular comparisons</h2>
        <div className="mt-4 flex flex-wrap gap-3 font-semibold text-blue-800">
          <Link href="/compare/new-york-vs-los-angeles">New York City vs Los Angeles</Link>
          <Link href="/compare/washington-dc-vs-baltimore">Washington DC vs Baltimore</Link>
          <Link href="/compare/dallas-vs-houston">Dallas vs Houston</Link>
        </div>
      </section>
    </main>
  );
}
