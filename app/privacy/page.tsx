import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Privacy Policy", "LocalInflation privacy policy.", "/privacy");

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Privacy Policy</h1>
      <div className="mt-6 space-y-5 leading-8 text-slate-600">
        <p>LocalInflation is an informational public data website. We may use basic analytics and Google AdSense or similar advertising tools. These services may use cookies or similar technologies to measure performance, serve ads, and understand site usage.</p>
        <p>Third-party vendors, including Google, may use cookies to serve ads based on visits to this and other websites. Users can manage ad personalization through their browser or Google ad settings.</p>
        <p>LocalInflation does not sell personal information directly. If you contact the site owner by email, your email address and message will be used only to respond to your inquiry unless otherwise agreed.</p>
        <p>LocalInflation may link to public data sources, government websites, and third-party resources. Those external sites have their own privacy practices.</p>
      </div>
    </main>
  );
}
