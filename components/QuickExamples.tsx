import { adjustForInflation } from "@/lib/calculations";
import { formatDollar } from "@/lib/formatters";

type QuickExamplesProps = {
  cpiStart: number;
  cpiEnd: number;
  endYear: number;
};

const examples = [1, 100, 1000, 50000, 100000];

export default function QuickExamples({ cpiStart, cpiEnd, endYear }: QuickExamplesProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Quick examples</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {examples.map((amount) => (
          <div key={amount} className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">{formatDollar(amount)} then</p>
            <p className="mt-2 text-lg font-bold text-slate-950">= {formatDollar(adjustForInflation(amount, cpiStart, cpiEnd))}</p>
            <p className="text-xs text-slate-500">in {endYear}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
