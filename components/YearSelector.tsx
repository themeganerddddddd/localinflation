"use client";

type YearSelectorProps = {
  label: string;
  years: number[];
  value: number;
  onChange: (value: number) => void;
};

export default function YearSelector({ label, years, value, onChange }: YearSelectorProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  );
}
