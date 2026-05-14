import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import FutureCostExplorer from "@/components/FutureCostExplorer";
import { getAllMetros } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";

export const metadata: Metadata = pageMetadata(
  "Future Cost Index",
  "Estimate how much today's dollars may need to become under low, baseline, and high inflation scenarios.",
  "/future-costs"
);

const futureFaq = [
  { question: "What is a future cost estimate?", answer: "A future cost estimate shows how much today's amount may need to become under selected inflation scenarios." },
  { question: "Are future cost results predictions?", answer: "No. They are scenario estimates based on historical inflation patterns, not guarantees." },
  { question: "Why are there low, mid, and high scenarios?", answer: "The scenarios show a range based on lower historical inflation, a recent baseline, and higher-cost inflation assumptions." },
  { question: "How should I interpret a future cost range?", answer: "Use the range as planning context, not as a precise forecast of future prices." }
];

export default function FutureCostsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Future Costs", url: "/future-costs" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(futureFaq)) }} />
      <div>
        <h1 className="text-4xl font-black text-slate-950">Future Cost Index</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Scenario estimates based on historical inflation, not predictions or financial advice.</p>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">What this estimate does</h2>
        <p className="mt-3 leading-7 text-slate-600">Future cost estimates show how today's dollar amount may need to change under low, baseline, and high historical-inflation scenarios. The results are planning ranges, not forecasts.</p>
      </section>
      <FutureCostExplorer metros={getAllMetros()} cpiBySlug={cpi} />
      <FAQBlock items={futureFaq} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Related tools</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/future-cost-calculator">Future cost calculator guide</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator">Inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/oil-price-inflation-simulator">Oil-price inflation simulator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/cities">City calculators</Link>
        </div>
      </section>
    </main>
  );
}
