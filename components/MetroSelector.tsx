"use client";

import { useMemo, useState } from "react";
import type { Metro } from "@/lib/types";

type MetroSelectorProps = {
  metros: Metro[];
  value: string;
  onChange: (slug: string) => void;
};

export default function MetroSelector({ metros, value, onChange }: MetroSelectorProps) {
  const [search, setSearch] = useState("");
  const filteredMetros = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return metros;
    return metros.filter((metro) =>
      `${metro.display_name} ${metro.full_name} ${metro.state_or_region}`.toLowerCase().includes(query)
    );
  }, [metros, search]);
  const selectedMetro = metros.find((metro) => metro.slug === value);

  return (
    <div className="block text-sm font-medium text-slate-700">
      <label htmlFor="metro-search">Location</label>
      <input
        id="metro-search"
        type="search"
        className="mt-2 w-full rounded-t-lg border border-b-0 border-slate-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder={selectedMetro ? `Search cities, currently ${selectedMetro.display_name}` : "Search cities"}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        className="w-full rounded-b-lg border border-slate-300 bg-white px-3 py-3 text-base shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setSearch("");
        }}
      >
        {filteredMetros.length ? filteredMetros.map((metro) => (
          <option key={metro.slug} value={metro.slug}>
            {metro.display_name}
          </option>
        )) : (
          <option value={value}>{selectedMetro?.display_name ?? "No city found"}</option>
        )}
      </select>
    </div>
  );
}
