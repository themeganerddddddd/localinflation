import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import FAQBlock from "@/components/FAQBlock";
import { getAllMetros } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

export const metadata: Metadata = pageMetadata(
  "Wage vs Inflation Calculator",
  "Compare wage growth with inflation by city and see whether purchasing power rose or fell.",
  "/wage-vs-inflation"
);

const wageFaq = [
  { question: "What does it mean for wages to keep up with inflation?", answer: "Wages keep up with inflation when pay rises at least as fast as prices over the same period." },
  { question: "How do you calculate real wage growth?", answer: "Real wage growth compares wage growth with price growth after accounting for inflation." },
  { question: "Why can wages rise while purchasing power falls?", answer: "If prices rise faster than wages, a higher paycheck can still buy less than before." },
  { question: "Why do wage and inflation geographies sometimes differ?", answer: "BLS wage and CPI data are not always published for the same local boundaries, so some locations require labeled proxy data." }
];

export default function WageIndexPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Wage vs Inflation", url: "/wage-vs-inflation" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(wageFaq)) }} />
      <div>
        <h1 className="text-4xl font-black text-slate-950">Wage vs inflation calculator</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Compare average wage growth with CPI growth for any available years.</p>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">What this tool does</h2>
        <p className="mt-3 leading-7 text-slate-600">Use this tool to compare wage growth with inflation and see whether purchasing power rose or fell over time.</p>
      </section>
      <Calculator metros={getAllMetros()} initialSlug="united-states" cpiBySlug={cpi} wagesBySlug={wages} />
      <FAQBlock items={wageFaq} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Related tools</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator">Inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/future-costs">Future cost calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/rankings/wages-vs-inflation">Wage rankings</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/cities">City calculators</Link>
        </div>
      </section>
    </main>
  );
}
