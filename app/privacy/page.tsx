import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Privacy Policy", "LocalInflation privacy policy.", "/privacy");

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Privacy Policy</h1>
      <p className="mt-6 leading-8 text-slate-600">LocalInflation does not require an account to use calculators. Hosting, analytics, advertising, and embedded services may process standard technical data such as device, browser, and page information. Do not enter private financial, legal, or employment information into the site.</p>
    </main>
  );
}
