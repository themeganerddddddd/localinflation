import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FutureCostExplorer from "@/components/FutureCostExplorer";
import MethodologyNote from "@/components/MethodologyNote";
import RelatedLocations from "@/components/RelatedLocations";
import { getAllMetros, getMetroBySlug, getNearbyMetros } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import cpi from "@/data/generated/cpi.json";

export function generateStaticParams() {
  return getAllMetros().map((metro) => ({ slug: metro.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const metro = getMetroBySlug(params.slug);
  if (!metro) return {};
  return pageMetadata(`${metro.display_name} Future Cost Calculator: Estimate Prices Through 2030`, `Estimate future costs in ${metro.display_name} under low, baseline, and high inflation scenarios.`, `/future-costs/${metro.slug}`);
}

export default function MetroFuturePage({ params }: { params: { slug: string } }) {
  const metro = getMetroBySlug(params.slug);
  if (!metro) notFound();
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-slate-950">{metro.display_name} Future Cost Calculator: Estimate Prices Through 2030</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Estimate how much today’s amount may need to become in future years. These are scenarios based on historical public data, not guarantees.</p>
      </div>
      <FutureCostExplorer metros={getAllMetros()} cpiBySlug={cpi} initialSlug={metro.slug} />
      <MethodologyNote metro={metro} />
      <RelatedLocations metros={getNearbyMetros(metro.slug)} />
    </main>
  );
}
