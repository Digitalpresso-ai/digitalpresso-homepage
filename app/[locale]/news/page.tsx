// app/[locale]/news/page.tsx

import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsArticleGrid } from '@/src/features/news/components/NewsArticleGrid/NewsArticleGrid';
import { getArticlesByCategory } from '@/src/features/news/data/articles.data';
import type { NewsCategory } from '@/src/features/news/types/article.types';

interface Props {
  searchParams: Promise<{ category?: string }>;
}

const VALID_CATEGORIES: NewsCategory[] = [
  'company',
  'construction',
  'technology',
];

export default async function NewsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory: NewsCategory = VALID_CATEGORIES.includes(
    category as NewsCategory,
  )
    ? (category as NewsCategory)
    : 'company';

  const articles = getArticlesByCategory(activeCategory);

  return (
    <main>
      <NewsHero activeCategory={activeCategory} />
      <NewsArticleGrid articles={articles} />
    </main>
  );
}
