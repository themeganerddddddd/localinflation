import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { getAllMetros } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "City Inflation Calculator | LocalInflation",
  "Find city inflation calculators for U.S. metros and compare local purchasing power, wages, and future costs.",
  "/city-inflation-calculator"
);

const cityFaq = [
  { question: "What is a city inflation calculator?", answer: "It estimates purchasing power and price growth using the best available CPI geography for a city or metro." },
  { question: "Does every city have direct CPI data?", answer: "No. Some cities use a direct metro CPI series, while others use labeled regional or national proxy data." },
  { question: "Can city inflation differ from national inflation?", answer: "Yes. Local housing, transportation, and energy patterns can make price growth differ by place." },
  { question: "Where can I compare cities?", answer: "Use the city index, rankings pages, or individual city calculator pages." }
];

export default function CityInflationCalculatorPage() {
  const metros = getAllMetros().filter((metro) => metro.slug !== "united-states").slice(0, 12);
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "City Inflation Calculator", url: "/city-inflation-calculator" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(cityFaq)) }} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-4xl font-black text-slate-950">City Inflation Calculator</h1>
        <p className="mt-4 leading-8 text-slate-600">Find local inflation calculators for U.S. cities and metro areas. LocalInflation labels whether a city uses direct metro CPI, regional proxy CPI, or national CPI where local data is unavailable.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" href="/cities">Browse all city calculators</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/rankings/highest-inflation">Highest inflation rankings</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator/united-states">U.S. inflation calculator</Link>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Popular city calculators</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metros.map((metro) => (
            <Link key={metro.slug} className="rounded-lg border border-slate-200 p-4 font-bold text-blue-800 hover:bg-blue-50" href={`/inflation-calculator/${metro.slug}`}>
              {metro.display_name} inflation calculator
            </Link>
          ))}
        </div>
      </section>
      <FAQBlock items={cityFaq} />
    </main>
  );
}
