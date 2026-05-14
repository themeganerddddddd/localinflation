type ResultCardProps = {
  eyebrow?: string;
  title: string;
  value: string;
  detail?: string;
  tooltip?: string;
  tone?: "blue" | "green" | "red" | "slate" | "amber";
};

const toneClass = {
  blue: "border-blue-200 bg-blue-50 text-blue-950",
  green: "border-emerald-200 bg-emerald-50 text-emerald-950",
  red: "border-rose-200 bg-rose-50 text-rose-950",
  slate: "border-slate-200 bg-white text-slate-950",
  amber: "border-amber-200 bg-amber-50 text-amber-950"
};

export default function ResultCard({ eyebrow, title, value, detail, tooltip, tone = "slate" }: ResultCardProps) {
  return (
    <div title={tooltip} className={`rounded-xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClass[tone]}`}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p> : null}
      <h3 className="mt-2 text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-3 text-2xl font-bold sm:text-3xl">{value}</p>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </div>
  );
}
