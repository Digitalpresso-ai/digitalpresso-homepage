// app/[locale]/news/page.tsx

import type { Metadata } from "next";
import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsArticleGrid } from '@/src/features/news/components/NewsArticleGrid/NewsArticleGrid';
import { getArticlesByCategory } from '@/src/features/news/data/articles.data';
import type { NewsCategory } from '@/src/features/news/types/article.types';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

const VALID_CATEGORIES: NewsCategory[] = [
  'company',
  'construction',
  'technology',
];

const NEWS_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: "뉴스 | digitalPresso",
    description:
      "건설·안전·AI 현장 운영과 관련된 digitalPresso의 최신 소식과 인사이트를 확인하세요.",
  },
  en: {
    title: "News | digitalPresso",
    description:
      "Read the latest updates and insights from digitalPresso on construction, safety, and AI-powered field operations.",
  },
  ja: {
    title: "ニュース | digitalPresso",
    description:
      "建設・安全・AI現場運用に関するdigitalPressoの最新ニュースとインサイトをご覧ください。",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : "ko";
  const content = NEWS_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: "/news",
    title: content.title,
    description: content.description,
    image: "/images/news-card-1.png",
  });
}

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
