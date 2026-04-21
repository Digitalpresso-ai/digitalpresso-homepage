import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ai.txt", "/llms.txt"],
        disallow: ["/admin/", "/api/", "/private/", "/_next/"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
