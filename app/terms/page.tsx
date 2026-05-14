import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Terms of Use", "LocalInflation terms of use.", "/terms");

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Terms of Use</h1>
      <div className="mt-6 space-y-5 leading-8 text-slate-600">
        <p>LocalInflation provides inflation calculators, wage comparisons, oil-price inflation scenarios, future-cost scenarios, and related economic information for educational and informational purposes only.</p>
        <p>Results are estimates based on public data, assumptions, and scenario models. They are not financial, investment, legal, employment, tax, or policy advice.</p>
        <p>Future-cost and oil-price outputs are scenario estimates, not guarantees or forecasts. Historical relationships can change, and local estimates may rely on regional or national proxy data where direct local data is unavailable.</p>
        <p>Users should verify important decisions with official sources or qualified professionals. LocalInflation is provided as-is and may contain errors, outdated data, or incomplete coverage.</p>
      </div>
    </main>
  );
}
