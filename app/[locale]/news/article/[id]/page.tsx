// app/[locale]/news/article/[id]/page.tsx

import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsArticleDetail } from '@/src/features/news/components/NewsArticleDetail/NewsArticleDetail';
import {
  getArticleById,
  getAdjacentArticles,
} from '@/src/features/news/data/articles.data';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const article = getArticleById(id);

  if (!article) {
    return buildPageMetadata({
      locale: safeLocale,
      path: `/news/article/${id}`,
      title: "Article Not Found | digitalPresso",
      description: "요청한 뉴스 아티클을 찾을 수 없습니다.",
      noIndex: true,
    });
  }

  const cleanTitle = article.title.replace(/\n/g, " ").trim();

  return buildPageMetadata({
    locale: safeLocale,
    path: `/news/article/${article.id}`,
    title: `${cleanTitle} | digitalPresso`,
    description: article.description,
    image: article.mainImage.src,
  });
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
