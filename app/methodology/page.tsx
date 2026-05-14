import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildPersonJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Methodology / About",
  "How LocalInflation estimates inflation, wages, future costs, and oil-price impacts.",
  "/methodology"
);

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Methodology / About", url: "/methodology" }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonJsonLd()) }} />
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Methodology / About</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">How LocalInflation Works</h1>
          <div className="mt-6 space-y-5 leading-8 text-slate-600">
            <p>LocalInflation estimates changes in purchasing power using Consumer Price Index series published by the U.S. Bureau of Labor Statistics where available. For each location, the calculator compares index values across user-selected years and applies the ratio to the entered dollar amount.</p>
            <p>For wage comparisons, LocalInflation compares nominal wage growth with inflation growth. The wage charts show wages with wage growth, wages if they had only kept pace with inflation, and year-over-year nominal wage growth versus the inflation rate.</p>
            <p>Future Cost Index estimates are scenario-based projections using historical inflation trends. The baseline scenario uses the average annual inflation rate from the latest available 10-year window. The high scenario uses the highest of upper-percentile historical inflation, recent three-year inflation pressure, and a volatility premium above the baseline so the high case represents a genuinely higher-cost scenario. They are not predictions, financial advice, or guarantees.</p>
          </div>

          <h2 className="mt-10 text-2xl font-black text-slate-950">Data Updates</h2>
          <div className="mt-4 space-y-4 leading-8 text-slate-600">
            <p>The project is structured to update public economic data with Python scripts in the <span className="font-semibold text-slate-900">scripts</span> folder. CPI data is designed to use the BLS Public Data API with an optional API key for higher limits. Wage data is structured separately so verified BLS/OEWS or related public wage series can be connected by metro.</p>
            <p>A GitHub Actions workflow runs weekly and can also be triggered manually. It runs the data update scripts, writes generated JSON files, and commits any changed data. Pages then read from the static generated data files, which keeps the public site fast and Vercel-friendly.</p>
            <p>Some locations use direct metro CPI where available. Other locations use regional proxy data because BLS does not publish a dedicated CPI series for every city. Proxy pages are labeled so readers can understand the data coverage.</p>
          </div>

          <h2 className="mt-10 text-2xl font-black text-slate-950">Oil Price Inflation Simulator Methodology</h2>
          <div className="mt-4 space-y-4 leading-8 text-slate-600">
            <p>LocalInflation reports oil-price effects in several layers because oil shocks can move through consumer prices at different speeds and through different channels. The simulator is designed for scenario analysis and historical pass-through context, not for guaranteed forecasts.</p>
            <p><span className="font-semibold text-slate-900">Direct gasoline channel:</span> the narrowest calculation estimates gasoline's direct contribution to all-items CPI. It multiplies the oil-price change by an oil-to-gasoline pass-through assumption and gasoline's CPI basket weight. For example, a 100% oil-price increase with 50% pass-through implies a 50% gasoline-price increase. If gasoline is about 3% of CPI, that contributes about 1.5% to all-items CPI.</p>
            <p><span className="font-semibold text-slate-900">Stress and component scenario:</span> the broader scenario adds direct energy channels and possible indirect pressure from airfares, freight, heating fuel, producer prices, food distribution, import prices, and inflation expectations. This range is nonlinear because severe oil shocks can create wider second-round pressure than small oil moves.</p>
            <p><span className="font-semibold text-slate-900">Calibrated duration model:</span> this layer estimates cumulative CPI pressure while oil remains elevated. It adjusts for duration, shock persistence, pass-through assumptions, local oil exposure, CPI momentum, and oil volatility.</p>
            <p><span className="font-semibold text-slate-900">Historical models:</span> the local projection and VAR scaffolds estimate historical pass-through patterns when enough monthly oil, gasoline, CPI, and macroeconomic data is available. These models help show how past oil shocks moved through CPI over 1, 3, 6, 12, 24, and 36 months.</p>
            <p><span className="font-semibold text-slate-900">Machine-learning model:</span> the GBDT scaffold is intended to train nonlinear scenario estimates from historical oil, gasoline, CPI, PPI, labor-market, interest-rate, and macroeconomic features. Until trained data is available, the hand-coded tree model is labeled as an experimental prototype rather than a trained GBDT estimate.</p>
            <p>All oil-price inflation outputs are scenario estimates or historical pass-through estimates. They are not forecasts, guarantees, investment advice, employment advice, legal advice, or policy advice. Historical relationships can change across inflation regimes, monetary policy environments, supply shocks, and geopolitical events.</p>
          </div>

        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-[180px_1fr] lg:grid-cols-1">
            <img src="/westley-sturhan.jpeg" alt="Westley Sturhan" className="h-full max-h-[360px] w-full rounded-xl object-cover object-top" />
            <div>
              <h2 className="text-2xl font-black text-slate-950">Westley Sturhan</h2>
              <p className="mt-4 leading-7 text-slate-600">Westley Sturhan is an economic development researcher and civic data builder focused on making local economies easier to understand. His work combines public policy, data analysis, and product design to turn fragmented public datasets into practical tools for residents, businesses, journalists, and decision-makers. Trained in economic development at the London School of Economics, Westley focuses on affordability, wage growth, workforce trends, business activity, and regional competitiveness, helping people see how headline economic numbers translate into everyday local realities.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2 lg:grid-cols-1">
            <a className="rounded-lg bg-blue-700 px-4 py-3 text-center text-white hover:bg-blue-800" href="https://www.linkedin.com/in/westley-sturhan-waibel-09497917b/">LinkedIn</a>
            <a className="rounded-lg border border-slate-200 px-4 py-3 text-center text-slate-700 hover:bg-slate-50" href="mailto:weststurhan@gmail.com">Contact: weststurhan@gmail.com</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
