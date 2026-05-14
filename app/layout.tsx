import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { buildDatasetJsonLd, buildWebApplicationJsonLd, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://localinflation.example.com"),
  title: {
    default: "LocalInflation: Local Inflation, Wages & Future Costs",
    template: "%s | LocalInflation"
  },
  description: SITE_TAGLINE
};

const nav = [
  ["Inflation Calculator", "/inflation-calculator"],
  ["Oil Simulator", "/oil-price-inflation-simulator"],
  ["Future Costs", "/future-costs"],
  ["Cities", "/cities"],
  ["Rankings", "/rankings"],
  ["Methodology / About", "/methodology"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        {adsenseClientId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebApplicationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDatasetJsonLd()) }} />
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <Link href="/" className="text-xl font-black tracking-tight text-blue-900">LocalInflation</Link>
            <nav className="flex flex-wrap gap-2 text-sm font-semibold text-slate-600">
              {nav.map(([label, href]) => (
                <Link key={href} className="rounded-full px-3 py-2 hover:bg-blue-50 hover:text-blue-800" href={href}>{label}</Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="font-black text-blue-900">LocalInflation</p>
            <div className="flex gap-4">
              <Link href="/methodology" className="font-semibold text-slate-700 hover:text-blue-800">About</Link>
              <Link href="/rankings" className="font-semibold text-slate-700 hover:text-blue-800">Rankings</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
