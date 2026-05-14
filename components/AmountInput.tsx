"use client";

type AmountInputProps = {
  value: number;
  onChange: (value: number) => void;
  label?: string;
};

export default function AmountInput({ value, onChange, label = "Enter dollar amount" }: AmountInputProps) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <div className="mt-2 flex rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        <span className="flex items-center rounded-l-xl bg-slate-50 px-4 text-slate-500">$</span>
        <input
          aria-label={label}
          className="min-w-0 flex-1 rounded-r-xl px-4 py-3 text-lg font-bold text-slate-950 outline-none"
          min={0.01}
          placeholder="100"
          step={1}
          type="number"
          value={value}
          onChange={(event) => onChange(Math.max(0.01, Number(event.target.value)))}
        />
      </div>
    </label>
  );
}
