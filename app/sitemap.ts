import type { MetadataRoute } from "next";
import { localizedPath, type AppLocale } from "@/lib/seo";
import { getAllArticles } from "@/src/features/news/data/articles.data";

const BASE_URL = "https://digitalpresso-homepage.vercel.app";
const LOCALES: AppLocale[] = ["ko", "en", "ja"];

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/references",
  "/news",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
] as const;

function toAbsoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

function parsePublishedAt(value: string): Date {
  const [yearRaw, monthRaw] = value.split(".");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    return new Date();
  }

  return new Date(Date.UTC(year, month - 1, 1));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: toAbsoluteUrl(localizedPath(locale, path)),
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
      });
    }
  }

  const articles = getAllArticles();

  for (const article of articles) {
    const articlePath = `/news/article/${article.id}`;
    const lastModified = parsePublishedAt(article.publishedAt);

    for (const locale of LOCALES) {
      entries.push({
        url: toAbsoluteUrl(localizedPath(locale, articlePath)),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
