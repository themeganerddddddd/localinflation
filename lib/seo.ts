import type { Metadata } from "next";
import type { Metro } from "@/lib/types";

export const SITE_NAME = "LocalInflation";
export const SITE_TAGLINE = "Local inflation, wage growth, and cost-pressure tools for U.S. cities.";

export function buildCanonicalUrl(path = "/"): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localinflation.com";
  return new URL(path, siteUrl).toString();
}

export function buildMetroTitle(metro: Metro): string {
  if (metro.slug === "united-states") return "Inflation Calculator: See What Your Money Is Worth Today";
  if (metro.data_coverage === "direct_metro_cpi") {
    return `${metro.display_name} Inflation Calculator: Local CPI, Wages & Cost Forecast`;
  }
  return `${metro.display_name} Inflation Calculator: Estimate Prices, Wages & Future Costs`;
}

export function buildMetroDescription(metro: Metro): string {
  if (metro.slug === "united-states") {
    return "Use the U.S. inflation calculator to see how prices changed over time, compare wages with inflation, and estimate future costs using public economic data.";
  }
  return `Use the ${metro.display_name} inflation calculator to compare purchasing power, wages, and future cost scenarios using public economic data.`;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = buildCanonicalUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true }
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.url)
    }))
  };
}

export function buildWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: buildCanonicalUrl("/"),
    description: "LocalInflation provides inflation calculators, wage comparisons, future-cost scenarios, and oil-price inflation simulation tools using public economic data.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: buildCanonicalUrl("/"),
    description: "Local inflation, wage growth, purchasing power, and cost-pressure tools for U.S. cities."
  };
}

export function buildDatasetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${SITE_NAME} CPI and wage data`,
    description: "Public inflation, wage, and cost-pressure data compiled from public economic sources where available.",
    creator: { "@type": "Organization", name: SITE_NAME }
  };
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Westley Sturhan",
    description: "Economic development researcher and civic data builder focused on making local economic data easier to understand.",
    email: "weststurhan@gmail.com",
    url: buildCanonicalUrl("/methodology")
  };
}

export function buildFAQJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}
