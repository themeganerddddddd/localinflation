import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Terms of Use", "LocalInflation terms of use.", "/terms");

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Terms of Use</h1>
      <p className="mt-6 leading-8 text-slate-600">LocalInflation provides educational estimates using public and generated economic data. Results are not financial, investment, employment, or legal advice. Future Cost Index scenarios are not predictions or guarantees.</p>
    </main>
  );
}
