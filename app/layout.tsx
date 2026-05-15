import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { buildDatasetJsonLd, buildWebApplicationJsonLd, buildWebSiteJsonLd, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://localinflation.com"),
  title: {
    default: "LocalInflation: Local Inflation, Wages & Future Costs",
    template: "%s | LocalInflation"
  },
  description: SITE_TAGLINE,
  icons: {
    icon: "/appicon.png",
    shortcut: "/appicon.png",
    apple: "/appicon.png"
  }
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
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3475349544392275"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebApplicationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDatasetJsonLd()) }} />
        <header className="z-30 overflow-hidden border-b border-slate-200 bg-white/95 backdrop-blur lg:sticky lg:top-0">
          <div className="mx-auto flex max-w-7xl min-w-0 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <Link href="/" className="min-w-0 text-xl font-black tracking-tight text-blue-900">LocalInflation</Link>
            <nav className="grid w-full min-w-0 grid-cols-2 gap-2 text-xs font-semibold text-slate-600 sm:flex sm:flex-wrap sm:text-sm lg:w-auto">
              {nav.map(([label, href]) => (
                <Link key={href} className="min-w-0 rounded-xl bg-slate-50 px-3 py-2 text-center leading-5 hover:bg-blue-50 hover:text-blue-800 sm:rounded-full sm:bg-transparent" href={href}>{label}</Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs leading-6 text-slate-500 sm:px-6 lg:px-8">
            <p>&copy; 2026 LocalInflation. Public data tools for inflation, wages, purchasing power, and cost-pressure scenarios.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/methodology" className="font-semibold text-slate-600 hover:text-blue-800">About & Methodology</Link>
              <Link href="/privacy" className="font-semibold text-slate-600 hover:text-blue-800">Privacy</Link>
              <Link href="/terms" className="font-semibold text-slate-600 hover:text-blue-800">Terms</Link>
              <Link href="/methodology" className="font-semibold text-slate-600 hover:text-blue-800">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
