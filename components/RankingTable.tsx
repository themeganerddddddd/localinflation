import Link from "next/link";

type RankingColumn<T> = { header: string; render: (row: T) => React.ReactNode };

export default function RankingTable<T extends { slug: string; metro: string }>({ columns, rows }: { columns: RankingColumn<T>[]; rows: T[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-3 font-semibold">{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.slug}>
                {columns.map((column) => (
                  <td key={column.header} className="px-4 py-4">
                    {column.header === "Metro" ? <Link className="font-semibold text-blue-800 hover:text-blue-600" href={`/inflation-calculator/${row.slug}`}>{column.render(row)}</Link> : column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
