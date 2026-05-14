import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import FAQBlock from "@/components/FAQBlock";
import HowToReadThis from "@/components/HowToReadThis";
import MethodologyNote from "@/components/MethodologyNote";
import RelatedLocations from "@/components/RelatedLocations";
import { getAllMetros, getMetroBySlug, getNearbyMetros } from "@/lib/data";
import { buildFAQJsonLd, buildMetroDescription, buildMetroTitle, pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

const usFaq = [
  { question: "What is an inflation calculator?", answer: "It estimates how much money from one year is worth in another year using CPI data." },
  { question: "How do you calculate inflation?", answer: "LocalInflation multiplies your amount by the ratio of CPI in the comparison year to CPI in the base year." },
  { question: "What does CPI mean?", answer: "CPI means Consumer Price Index, a public measure of price changes over time." },
  { question: "What is a base year?", answer: "A base year is the year you start from." },
  { question: "Can I choose any starting year?", answer: "Yes. You can choose any year available in the selected location’s CPI series." },
  { question: "How much has inflation changed since 2020?", answer: "Choose 2020 as the base year and the latest available year as the comparison year to see the current estimate." },
  { question: "How much salary do I need to keep up with inflation?", answer: "Your income needs to rise at least as much as prices rose over the same period." },
  { question: "Are local inflation rates different from national inflation?", answer: "They can be. LocalInflation labels when a metro, regional, or national CPI series is used." },
  { question: "Can this predict future prices?", answer: "No. Future Cost Index scenarios are estimates based on historical public data, not predictions." }
];

export function generateStaticParams() {
  return getAllMetros().map((metro) => ({ slug: metro.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const metro = getMetroBySlug(params.slug);
  if (!metro) return {};
  return pageMetadata(buildMetroTitle(metro), buildMetroDescription(metro), `/inflation-calculator/${metro.slug}`);
}

export default function MetroInflationPage({ params }: { params: { slug: string } }) {
  const metro = getMetroBySlug(params.slug);
  if (!metro) notFound();
  const metros = getAllMetros();
  const isUs = metro.slug === "united-states";
  const title = isUs ? "Inflation Calculator: What Is Your Money Worth Today?" : buildMetroTitle(metro);
  const intro = isUs
    ? "Use LocalInflation’s U.S. Inflation Calculator to compare the value of money across years, see how prices changed nationally, and understand whether wages kept up with inflation. Enter an amount, choose a starting year and ending year, and get a clear estimate based on public CPI data."
    : `The ${metro.display_name} inflation calculator estimates how much prices changed over time using the best available public CPI data. Choose any available base year and comparison year, compare a dollar amount across time, see whether wages kept up, and view scenario-based future cost estimates.`;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      {isUs ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(usFaq)) }} /> : null}
      <section>
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{metro.display_name}</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">{title}</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">{intro}</p>
        <p className="mt-3 text-sm text-slate-500">
          {metro.data_coverage === "national_cpi"
            ? "This page uses a U.S. national CPI series for broad purchasing-power estimates."
            : metro.data_coverage === "direct_metro_cpi"
              ? `This page uses a BLS metro CPI series for the ${metro.full_name} area where available.`
              : "Because BLS does not publish a dedicated CPI series for every city, this page uses the closest available CPI geography and labels the data source clearly."}
        </p>
      </section>
      <Calculator metros={metros} initialSlug={metro.slug} cpiBySlug={cpi} wagesBySlug={wages} />
      <HowToReadThis />
      {isUs ? <FAQBlock items={usFaq} /> : null}
      <MethodologyNote metro={metro} />
      <RelatedLocations metros={getNearbyMetros(metro.slug)} />
      <section className="grid gap-3 sm:grid-cols-3">
        <Link className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-blue-800 shadow-sm" href={`/wage-vs-inflation/${metro.slug}`}>Wages vs inflation</Link>
        <Link className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-blue-800 shadow-sm" href={`/future-costs/${metro.slug}`}>Future costs</Link>
        <Link className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-blue-800 shadow-sm" href="/rankings/highest-inflation">Rankings preview</Link>
      </section>
    </main>
  );
}
