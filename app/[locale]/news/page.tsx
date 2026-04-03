// app/[locale]/news/page.tsx

import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsArticleGrid } from '@/src/features/news/components/NewsArticleGrid/NewsArticleGrid';
import { getPublishedArticles } from '@/src/features/news/api/news.api';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';
import type { NewsCategory } from '@/src/features/news/types/article.types';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

const VALID_CATEGORIES: NewsCategory[] = [
  'company',
  'construction',
  'technology',
];

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  const activeCategory: NewsCategory = VALID_CATEGORIES.includes(
    category as NewsCategory,
  )
    ? (category as NewsCategory)
    : 'company';

  const entities = await getPublishedArticles();
  const allArticles = entities.map((e) => mapCmsArticleToNewsArticle(e, locale));
  const articles = allArticles.filter((a) => a.category === activeCategory);

  const articleCounts = {
    company: allArticles.filter((a) => a.category === 'company').length,
    construction: allArticles.filter((a) => a.category === 'construction').length,
    technology: allArticles.filter((a) => a.category === 'technology').length,
  };

  return (
    <main>
      <NewsHero activeCategory={activeCategory} articleCounts={articleCounts} />
      <NewsArticleGrid articles={articles} />
    </main>
  );
}
