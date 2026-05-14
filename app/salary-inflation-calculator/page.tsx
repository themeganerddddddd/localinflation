import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Salary Inflation Calculator | LocalInflation",
  "Compare salary growth with inflation and see whether wages kept up with rising prices.",
  "/salary-inflation-calculator"
);

const salaryFaq = [
  { question: "What is a salary inflation calculator?", answer: "It compares salary or wage growth with inflation to show whether purchasing power rose or fell." },
  { question: "How much salary growth keeps up with inflation?", answer: "A salary generally needs to rise by at least the inflation rate over the same period to keep purchasing power steady." },
  { question: "Can wages rise while buying power falls?", answer: "Yes. If prices rise faster than wages, purchasing power can fall even when nominal pay increases." },
  { question: "Where should I start?", answer: "Use the wage vs inflation calculator or choose a city inflation calculator to compare local price growth and wages." }
];

export default function SalaryInflationCalculatorPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Salary Inflation Calculator", url: "/salary-inflation-calculator" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(salaryFaq)) }} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-4xl font-black text-slate-950">Salary Inflation Calculator</h1>
        <p className="mt-4 leading-8 text-slate-600">Use LocalInflation to compare wage growth with inflation and understand whether salary gains kept up with rising prices. The main calculator also shows local purchasing power and wage charts where data is available.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" href="/wage-vs-inflation">Open wage vs inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator">Compare purchasing power</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/cities">Find a city calculator</Link>
        </div>
      </section>
      <FAQBlock items={salaryFaq} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Related LocalInflation tools</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator/united-states">U.S. inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/rankings/wages-vs-inflation">Wage rankings</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/oil-price-inflation-simulator">Oil-price inflation simulator</Link>
        </div>
      </section>
    </main>
  );
}
