// app/[locale]/news/article/[id]/page.tsx

import { notFound } from 'next/navigation';
import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsArticleDetail } from '@/src/features/news/components/NewsArticleDetail/NewsArticleDetail';
import {
  getArticleById,
  getAdjacentArticles,
} from '@/src/features/news/data/articles.data';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsArticlePage({ params }: Props) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  const { prev, next } = getAdjacentArticles(id, article.category);

  return (
    <main>
      <NewsHero showTabs={false} />
      <NewsArticleDetail
        article={article}
        prevArticle={prev}
        nextArticle={next}
      />
    </main>
  );
}
