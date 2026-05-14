import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import FAQBlock from "@/components/FAQBlock";
import MethodologyNote from "@/components/MethodologyNote";
import RankingHighlights from "@/components/RankingHighlights";
import { getAllMetros } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

export const metadata: Metadata = pageMetadata(
  "Local Inflation Calculator by City",
  "Choose a city, amount, base year, and comparison year to calculate local purchasing power.",
  "/inflation-calculator"
);

const inflationFaq = [
  { question: "What is an inflation calculator?", answer: "An inflation calculator estimates how the buying power of money changes between two years using CPI data." },
  { question: "How do you calculate inflation?", answer: "LocalInflation compares CPI in the comparison year with CPI in the base year and applies that ratio to the entered dollar amount." },
  { question: "Can I choose any base year?", answer: "Yes. The calculator lets users choose any year available in the selected location's CPI series." },
  { question: "What is CPI?", answer: "CPI means Consumer Price Index, a public measure of price changes for a basket of goods and services." },
  { question: "Why do local inflation rates differ?", answer: "Local inflation can differ because housing, transportation, energy, and other costs vary by metro and region." },
  { question: "How much salary do I need to keep up with inflation?", answer: "Salary generally needs to rise by at least the inflation rate over the same period to preserve purchasing power." }
];

export default function InflationCalculatorPage() {
  const metros = getAllMetros();
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Inflation Calculator", url: "/inflation-calculator" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(inflationFaq)) }} />
      <div>
        <h1 className="text-4xl font-black text-slate-950">Local inflation calculator</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Choose any available base year and comparison year. The calculator derives year options from the selected location's CPI series.</p>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">What this calculator does</h2>
        <p className="mt-3 leading-7 text-slate-600">Enter a dollar amount and two years to estimate how much money you would need in the comparison year to match the purchasing power of the base year. LocalInflation also helps compare price growth with wages where data is available.</p>
      </section>
      <Calculator metros={metros} initialSlug="united-states" cpiBySlug={cpi} wagesBySlug={wages} />
      <RankingHighlights />
      <FAQBlock items={inflationFaq} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Related tools</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator/united-states">U.S. inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/wage-vs-inflation">Wages vs inflation</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/future-costs">Future cost calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/oil-price-inflation-simulator">Oil-price inflation simulator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/cities">City calculators</Link>
        </div>
      </section>
      <MethodologyNote />
    </main>
  );
}
