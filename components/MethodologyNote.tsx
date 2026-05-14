import type { Metro } from "@/lib/types";

export default function MethodologyNote({ metro }: { metro?: Metro }) {
  const isProxy = metro && !["direct_metro_cpi", "national_cpi"].includes(metro.data_coverage);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
      <p className="font-semibold text-slate-900">Methodology note</p>
      <p className="mt-2">
        LocalInflation estimates purchasing power by comparing CPI index values across the years you choose and applying that ratio to your dollar amount.
      </p>
      {isProxy ? (
        <p className="mt-2 font-medium text-blue-900">
          Inflation data note: BLS does not publish a dedicated CPI series for every city. This page uses the closest available metro, regional, or national CPI series and labels the source where available.
        </p>
      ) : null}
    </div>
  );
}
