'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useInfiniteArticles } from '@/src/hooks/queries/useArticles';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';
import { NewsFilterBar } from '../NewsFilterBar/NewsFilterBar';
import { NewsArticleGrid } from '../NewsArticleGrid/NewsArticleGrid';
import type { NewsCategory, NewsTab } from '../../types/article.types';

interface NewsContentProps {
  initialCategory: NewsTab;
  articleCounts: { all: number; company: number; construction: number; technology: number };
  searchQuery: string;
}

const VALID_TABS: NewsTab[] = ['all', 'company', 'construction', 'technology'];

export function NewsContent({
  initialCategory,
  articleCounts,
  searchQuery,
}: NewsContentProps) {
  const locale = useLocale();
  const t = useTranslations('newsPage.hero');
  const searchParams = useSearchParams();

  const paramTab = searchParams.get('category') as NewsTab | null;
  const activeTab: NewsTab =
    paramTab && VALID_TABS.includes(paramTab) ? paramTab : initialCategory;

  // 'all' 탭은 카테고리 필터 없이 전체 조회.
  const fetchCategory = activeTab === 'all' ? undefined : activeTab;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteArticles(fetchCategory);

  const tagLabels: Record<NewsCategory, string> = {
    company: t('tags.company'),
    construction: t('tags.construction'),
    technology: t('tags.technology'),
  };

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
        activeCategory={activeTab}
        articleCounts={articleCounts}
        searchQuery={searchQuery}
      />
      <NewsArticleGrid
        articles={articles}
        viewButtonText={t('viewButton')}
        tagLabels={tagLabels}
        showTag={activeTab === 'all'}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
