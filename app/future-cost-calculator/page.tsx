import type { Metadata } from "next";
import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import { buildBreadcrumbJsonLd, buildFAQJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Future Cost Calculator | LocalInflation",
  "Estimate future costs under low, baseline, and high inflation scenarios using LocalInflation.",
  "/future-cost-calculator"
);

const futureCostFaq = [
  { question: "What does a future cost calculator estimate?", answer: "It estimates how much a current amount may need to become under low, baseline, and high inflation scenarios." },
  { question: "Is a future cost estimate a prediction?", answer: "No. It is a scenario range based on historical inflation data and assumptions." },
  { question: "Why use several scenarios?", answer: "Several scenarios help show uncertainty instead of pretending one future inflation path is certain." },
  { question: "Can I estimate future costs by city?", answer: "Yes. LocalInflation includes future cost pages for each supported location." }
];

export default function FutureCostCalculatorPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Future Cost Calculator", url: "/future-cost-calculator" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(futureCostFaq)) }} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-4xl font-black text-slate-950">Future Cost Calculator</h1>
        <p className="mt-4 leading-8 text-slate-600">Use LocalInflation's Future Cost Index to estimate how today's costs may change under low, baseline, and high inflation scenarios. The results are scenario estimates, not forecasts.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" href="/future-costs">Open Future Cost Index</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/inflation-calculator">Inflation calculator</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/oil-price-inflation-simulator">Oil-price inflation simulator</Link>
        </div>
      </section>
      <FAQBlock items={futureCostFaq} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">More planning tools</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/cities">City calculators</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/rankings/highest-inflation">Inflation rankings</Link>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-blue-800 hover:bg-blue-50" href="/methodology">Methodology</Link>
        </div>
      </section>
    </main>
  );
}
