export default function OilConceptExplainer() {
  return (
    <section className="min-w-0 rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-950 sm:p-6">
      <h2 className="break-words text-lg font-black leading-7 sm:text-xl">Why can a large oil shock have a smaller direct CPI effect?</h2>
      <div className="mt-4 space-y-3 leading-7">
        <p>A 100% oil-price increase does not mean all consumer prices rise 100%. Oil first passes through to refined products like gasoline. If crude oil is roughly half of the retail gasoline price, a 100% oil increase may imply about a 50% gasoline-price increase under the baseline assumption.</p>
        <p>Then gasoline's effect on all-items CPI depends on its CPI basket weight. If gasoline is about 3% of the CPI basket, a 50% gasoline-price increase contributes about 1.5% to all-items CPI.</p>
        <p>That is only the direct gasoline channel. Larger oil shocks may also create broader pressure through diesel, freight, airfares, heating fuel, electricity, producer prices, food distribution, import prices, and inflation expectations.</p>
      </div>
      <div className="mt-5 overflow-x-auto rounded-lg border border-blue-200 bg-white p-4 font-mono text-xs leading-6 text-slate-800 sm:text-sm sm:leading-7">
        <p>Oil shock x oil-to-gasoline pass-through = gasoline price effect</p>
        <p>Gasoline price effect x gasoline CPI weight = direct gasoline contribution to all-items CPI</p>
        <p className="mt-3">Example: 100% x 50% = 50% gasoline price increase</p>
        <p>50% x 3% = 1.5% added to all-items CPI</p>
      </div>
    </section>
  );
}
