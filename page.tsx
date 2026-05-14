import Link from "next/link";
import Calculator from "@/components/Calculator";
import HowToReadThis from "@/components/HowToReadThis";
import MethodologyNote from "@/components/MethodologyNote";
import { getAllMetros } from "@/lib/data";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

const popular = ["united-states", "washington-dc", "new-york", "los-angeles", "chicago", "dallas", "miami", "atlanta"];

export default function HomePage() {
  const metros = getAllMetros();
  const popularMetros = popular.map((slug) => metros.find((metro) => metro.slug === slug)).filter(Boolean);

  return (
    <main>
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_58%,#f0fdfa_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Local Inflation Calculator</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">See what your money is worth in your city, and whether wages kept up.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">Local inflation, wage growth, and cost-pressure tools for U.S. cities.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/inflation-calculator" className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-800">Calculate local inflation</Link>
            <Link href="/wage-vs-inflation" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 hover:bg-slate-50">Explore wages vs inflation</Link>
          </div>
          <div className="mt-10">
            <Calculator metros={metros} initialSlug="united-states" cpiBySlug={cpi} wagesBySlug={wages} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Popular calculators</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularMetros.map((metro) => (
              <Link key={metro!.slug} href={`/inflation-calculator/${metro!.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md">
                <p className="font-bold text-slate-950">{metro!.display_name} Inflation Calculator</p>
                <p className="mt-2 text-sm text-slate-500">Prices, wages, and future costs.</p>
              </Link>
            ))}
          </div>
        </section>
        <HowToReadThis />
        <section className="grid gap-6 md:grid-cols-2">
          <Link href="/oil-price-inflation-simulator" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Oil price inflation simulator</h2>
            <p className="mt-3 leading-7 text-slate-600">Estimate possible CPI effects from crude oil changes using transparent pass-through assumptions.</p>
          </Link>
          <Link href="/wage-vs-inflation" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Wage vs inflation preview</h2>
            <p className="mt-3 leading-7 text-slate-600">See whether wage growth beat, trailed, or roughly kept pace with rising prices.</p>
          </Link>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <Link href="/future-costs" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Future Cost Index preview</h2>
            <p className="mt-3 leading-7 text-slate-600">Estimate future costs under low, baseline, and high historical-inflation scenarios.</p>
          </Link>
        </section>
        <MethodologyNote />
      </div>
    </main>
  );
}
