export type FAQItem = { question: string; answer: string };

export default function FAQBlock({ items }: { items: FAQItem[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">FAQ</h2>
      <div className="mt-4 divide-y divide-slate-200">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold text-slate-900">{item.question}</summary>
            <p className="mt-2 leading-6 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
