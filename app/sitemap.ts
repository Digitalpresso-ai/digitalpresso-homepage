import type { MetadataRoute } from 'next';
import { localizedPath, type AppLocale } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';
import { getPublishedArticles } from '@/src/features/news/api/news.api';

const BASE_URL = getSiteUrl();
const LOCALES: AppLocale[] = ['ko', 'en', 'ja'];

const STATIC_PATHS = [
  '/',
  '/about-us',
  '/references',
  '/news',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
] as const;

function toAbsoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

function parseCreatedAt(value: string): Date {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: toAbsoluteUrl(localizedPath(locale, path)),
        lastModified: now,
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.8,
      });
    }
  }

  const articles = await getPublishedArticles();

  for (const article of articles) {
    const articlePath = `/news/article/${article.id}`;
    const lastModified = parseCreatedAt(article.created_at);

    for (const locale of LOCALES) {
      entries.push({
        url: toAbsoluteUrl(localizedPath(locale, articlePath)),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
