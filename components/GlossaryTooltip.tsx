const definitions: Record<string, string> = {
  CPI: "Consumer Price Index, a public measure of price changes over time.",
  "Purchasing power": "How much goods and services your money can buy.",
  Inflation: "The rate at which prices rise over time.",
  "Real wages": "Wages adjusted for inflation. LocalInflation primarily shows nominal wage growth and the wage-inflation gap.",
  "Nominal wages": "Wages measured in current dollars before inflation adjustment.",
  "Future Cost Index": "A scenario estimate of how much today’s amount may need to become in a future year.",
  "Base year": "The starting year you want to compare from.",
  "Comparison year": "The year you want to compare against."
};

export default function GlossaryTooltip({ term }: { term: keyof typeof definitions }) {
  return (
    <span className="group relative inline-flex cursor-help items-center border-b border-dotted border-slate-400 font-medium text-slate-900">
      {term}
      <span className="pointer-events-none absolute left-0 top-7 z-10 hidden w-64 rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal leading-5 text-slate-600 shadow-xl group-hover:block">
        {definitions[term]}
      </span>
    </span>
  );
}
