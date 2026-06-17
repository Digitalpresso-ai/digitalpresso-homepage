// app/[locale]/news/article/[id]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsArticleDetail } from '@/src/features/news/components/NewsArticleDetail/NewsArticleDetail';
import {
  getArticleById,
  getAdjacentArticles,
} from '@/backend/article/application/server-facade';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';
import {
  buildPageMetadata,
  isAppLocale,
  localizedPath,
  type AppLocale,
} from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';
import type { ArticleEntity } from '@/backend/article/domain/entities/ArticleEntity';
import type { NewsArticle } from '@/src/features/news/types/article.types';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

function toAbsoluteUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

/**
 * 뉴스 기사용 NewsArticle 구조화 데이터(JSON-LD).
 * 구글이 페이지를 "뉴스 기사"로 인식해 발행일·게시자·대표 이미지를 리치 결과로 노출하고
 * 색인 우선순위를 높이도록 돕는다.
 */
function buildNewsArticleJsonLd(
  entity: ArticleEntity,
  article: NewsArticle,
  locale: AppLocale,
) {
  const articleUrl = toAbsoluteUrl(
    localizedPath(locale, `/news/article/${article.id}`),
  );
  const publishedAt = new Date(entity.created_at).toISOString();
  const imageUrl = article.mainImage.src
    ? new URL(article.mainImage.src, getSiteUrl()).toString()
    : toAbsoluteUrl('/images/news-card-1.png');

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title.replace(/\n/g, ' ').trim(),
    description: article.description,
    image: [imageUrl],
    datePublished: publishedAt,
    dateModified: publishedAt,
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    url: articleUrl,
    author: { '@type': 'Organization', name: 'digitalPresso' },
    publisher: {
      '@type': 'Organization',
      name: 'digitalPresso',
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/images/header-background.png'),
      },
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'ko';
  const entity = await getArticleById(id);

  if (!entity) {
    return buildPageMetadata({
      locale: safeLocale,
      path: `/news/article/${id}`,
      title: 'Article Not Found',
      description: '요청한 뉴스 아티클을 찾을 수 없습니다.',
      noIndex: true,
    });
  }

  const article = mapCmsArticleToNewsArticle(entity, safeLocale);
  const cleanTitle = article.title.replace(/\n/g, ' ').trim();

  // 제목의 ' | digitalPresso' 접미사는 layout.tsx의 title.template이 자동으로 붙임
  return buildPageMetadata({
    locale: safeLocale,
    path: `/news/article/${article.id}`,
    title: cleanTitle,
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

  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'ko';
  const article = mapCmsArticleToNewsArticle(entity, locale);
  const { prev, next } = await getAdjacentArticles(id);
  const jsonLd = buildNewsArticleJsonLd(entity, article, safeLocale);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsArticleDetail
        article={article}
        prevArticle={prev ? mapCmsArticleToNewsArticle(prev, locale) : undefined}
        nextArticle={next ? mapCmsArticleToNewsArticle(next, locale) : undefined}
      />
    </main>
  );
}
