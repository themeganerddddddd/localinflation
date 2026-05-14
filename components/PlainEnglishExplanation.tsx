import { formatDollar, formatPercent } from "@/lib/formatters";

type PlainEnglishExplanationProps = {
  amount: number;
  adjusted: number;
  startYear: number;
  endYear: number;
  priceChange: number;
};

export default function PlainEnglishExplanation({ amount, adjusted, startYear, endYear, priceChange }: PlainEnglishExplanationProps) {
  return (
    <section className="rounded-lg border border-blue-100 bg-blue-50 p-6">
      <h2 className="text-xl font-bold text-blue-950">What this means</h2>
      <p className="mt-3 leading-7 text-blue-950">
        Your selected amount needs to be about {formatDollar(adjusted)} in {endYear} to buy what {formatDollar(amount)} bought in {startYear}.
      </p>
      <p className="mt-2 leading-7 text-blue-900">
        If your income grew less than {formatPercent(priceChange)} over that time, your real purchasing power declined.
      </p>
    </section>
  );
}
