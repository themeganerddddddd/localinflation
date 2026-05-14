import Link from "next/link";
import type { Metro } from "@/lib/types";

export default function RelatedLocations({ metros }: { metros: Metro[] }) {
  if (!metros.length) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Related city calculators</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {metros.map((metro) => (
          <Link key={metro.slug} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-100 hover:text-blue-900" href={`/inflation-calculator/${metro.slug}`}>
            {metro.display_name}
          </Link>
        ))}
      </div>
    </section>
  );
}
