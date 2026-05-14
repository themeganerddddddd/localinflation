import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { getAllMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

export const metadata: Metadata = pageMetadata(
  "Wage vs Inflation Calculator",
  "Compare wage growth with inflation by city and see whether purchasing power rose or fell.",
  "/wage-vs-inflation"
);

export default function WageIndexPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Wage vs inflation calculator</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Compare average wage growth with CPI growth for any available years.</p>
      </div>
      <Calculator metros={getAllMetros()} initialSlug="united-states" cpiBySlug={cpi} wagesBySlug={wages} />
    </main>
  );
}
