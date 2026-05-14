import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import MethodologyNote from "@/components/MethodologyNote";
import RelatedLocations from "@/components/RelatedLocations";
import { getAllMetros, getMetroBySlug, getNearbyMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";
import wages from "@/data/generated/wages.json";

export function generateStaticParams() {
  return getAllMetros().map((metro) => ({ slug: metro.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const metro = getMetroBySlug(params.slug);
  if (!metro) return {};
  return pageMetadata(`Did Wages Keep Up With Inflation in ${metro.display_name}?`, `Compare wage growth with inflation in ${metro.display_name}.`, `/wage-vs-inflation/${metro.slug}`);
}

export default function MetroWagePage({ params }: { params: { slug: string } }) {
  const metro = getMetroBySlug(params.slug);
  if (!metro) notFound();
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Did Wages Keep Up With Inflation in {metro.display_name}?</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Choose any available base year and comparison year to see price growth, nominal wage growth, and the wage-inflation gap.</p>
      </div>
      <Calculator metros={getAllMetros()} initialSlug={metro.slug} cpiBySlug={cpi} wagesBySlug={wages} showLocationSelector={false} />
      <MethodologyNote metro={metro} />
      <RelatedLocations metros={getNearbyMetros(metro.slug)} />
    </main>
  );
}
