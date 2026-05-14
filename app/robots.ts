import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" }
    ],
    sitemap: buildCanonicalUrl("/sitemap.xml")
  };
}
