// app/[locale]/news/article/[id]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsArticleDetail } from '@/src/features/news/components/NewsArticleDetail/NewsArticleDetail';
import {
  getArticleById,
  getAdjacentArticles,
} from '@/src/features/news/api/news.api';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';
import { buildPageMetadata, isAppLocale, localizedPath, type AppLocale } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'ko';
  const entity = await getArticleById(id);

  if (!entity) {
    return buildPageMetadata({
      locale: safeLocale,
      path: `/news/article/${id}`,
      title: 'Article Not Found | DigitalPresso',
      description: '요청한 뉴스 아티클을 찾을 수 없습니다.',
      noIndex: true,
    });
  }

  const article = mapCmsArticleToNewsArticle(entity, safeLocale);
  const cleanTitle = article.title.replace(/\n/g, ' ').trim();

  return buildPageMetadata({
    locale: safeLocale,
    path: `/news/article/${article.id}`,
    title: `${cleanTitle} | DigitalPresso`,
    description: article.description,
    image: article.mainImage.src || '/images/news-card-1.png',
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, id } = await params;
  const entity = await getArticleById(id);

  if (!entity) {
    notFound();
  }

  const article = mapCmsArticleToNewsArticle(entity, locale);
  const { prev, next } = await getAdjacentArticles(id);
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'ko';
  const articleUrl = `${getSiteUrl()}${localizedPath(safeLocale, `/news/article/${article.id}`)}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title.replace(/\n/g, ' ').trim(),
    description: article.description,
    datePublished: article.publishedAtIso,
    dateModified: article.publishedAtIso,
    inLanguage: safeLocale,
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    articleSection: article.categoryLabel,
    publisher: {
      '@type': 'Organization',
      name: 'DigitalPresso',
      alternateName: '디지털프레소',
      url: getSiteUrl(),
      logo: {
        '@type': 'ImageObject',
        url: `${getSiteUrl()}/images/dp_logo_eng.svg`,
      },
    },
    image: article.mainImage.src ? [article.mainImage.src] : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <NewsArticleDetail
        article={article}
        prevArticle={prev ? mapCmsArticleToNewsArticle(prev, locale) : undefined}
        nextArticle={next ? mapCmsArticleToNewsArticle(next, locale) : undefined}
      />
    </main>
  );
}
