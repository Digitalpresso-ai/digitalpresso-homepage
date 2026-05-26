'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useInfiniteArticles } from '@/src/hooks/queries/useArticles';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';
import { NewsFilterBar } from '../NewsFilterBar/NewsFilterBar';
import { NewsArticleGrid } from '../NewsArticleGrid/NewsArticleGrid';
import type { NewsCategory } from '../../types/article.types';

interface NewsContentProps {
  initialCategory: NewsCategory;
  articleCounts: { company: number; construction: number; technology: number };
  searchQuery: string;
}

export function NewsContent({
  initialCategory,
  articleCounts,
  searchQuery,
}: NewsContentProps) {
  const locale = useLocale();
  const t = useTranslations('newsPage.hero');
  const searchParams = useSearchParams();

  const category =
    (searchParams.get('category') as NewsCategory) || initialCategory;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteArticles(category);

  let articles = (data?.pages ?? [])
    .flat()
    .map((entity) => mapCmsArticleToNewsArticle(entity, locale));

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }

  return (
    <>
      <NewsFilterBar
        activeCategory={category}
        articleCounts={articleCounts}
        searchQuery={searchQuery}
      />
      <NewsArticleGrid
        articles={articles}
        viewButtonText={t('viewButton')}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
