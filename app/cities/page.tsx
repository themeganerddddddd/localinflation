import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { getAllMetros, getAvailableYearsForMetro } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "City Inflation Calculators",
  "Find local inflation calculators for major U.S. cities and metro areas. Compare purchasing power, wages, and future cost scenarios by location.",
  "/cities"
);

export default function CitiesPage() {
  const metros = getAllMetros().filter((metro) => metro.slug !== "united-states").sort((a, b) => a.display_name.localeCompare(b.display_name));
  const grouped = metros.reduce<Record<string, typeof metros>>((acc, metro) => {
    const letter = metro.display_name[0];
    acc[letter] = [...(acc[letter] ?? []), metro];
    return acc;
  }, {});
  const coverageLabel = (coverage: string) => {
    if (coverage === "direct_metro_cpi") return "Uses a direct metro";
    if (coverage === "national_cpi") return "Uses national CPI";
    return "Uses regional proxy";
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">City Inflation Calculators</h1>
      <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Find local inflation calculators for major U.S. cities and metro areas. Compare purchasing power, wages, and future cost scenarios by location.</p>
      <div className="mt-8 grid gap-8">
        {Object.entries(grouped).map(([letter, group]) => (
          <section key={letter}>
            <h2 className="text-2xl font-black text-blue-900">{letter}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.map((metro) => {
                const years = getAvailableYearsForMetro(metro.slug);
                return (
                  <article key={metro.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                    <Link href={`/inflation-calculator/${metro.slug}`} className="block rounded-lg p-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-slate-950">{metro.display_name}</h3>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{coverageLabel(metro.data_coverage)}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Latest available year: {years.at(-1)}</p>
                    </Link>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
                      <Link className="rounded-lg bg-blue-700 px-3 py-2 text-center text-white hover:bg-blue-800" href={`/inflation-calculator/${metro.slug}`}>Inflation calculator</Link>
                      <Link className="rounded-lg border border-slate-200 px-3 py-2 text-center text-slate-700 hover:bg-slate-50" href={`/future-costs/${metro.slug}`}>Future costs</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-10">
        <AdSlot slotName="cities-lower-body" />
      </div>
    </main>
  );
}
