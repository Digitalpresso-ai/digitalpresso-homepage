// app/[locale]/news/article/[id]/page.tsx

import { notFound } from 'next/navigation';
import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsArticleDetail } from '@/src/features/news/components/NewsArticleDetail/NewsArticleDetail';
import {
  getArticleById,
  getAdjacentArticles,
} from '@/src/features/news/api/news.api';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, id } = await params;
  const entity = await getArticleById(id);

  if (!entity) {
    notFound();
  }

  const article = mapCmsArticleToNewsArticle(entity, locale);
  const { prev, next } = await getAdjacentArticles(id);

  return (
    <main>
      <NewsHero showTabs={false} />
      <NewsArticleDetail
        article={article}
        prevArticle={prev ? mapCmsArticleToNewsArticle(prev, locale) : undefined}
        nextArticle={next ? mapCmsArticleToNewsArticle(next, locale) : undefined}
      />
    </main>
  );
}
