// app/[locale]/news/page.tsx

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsFilterBar } from '@/src/features/news/components/NewsFilterBar/NewsFilterBar';
import { NewsArticleGrid } from '@/src/features/news/components/NewsArticleGrid/NewsArticleGrid';
import { getPublishedArticles } from '@/src/features/news/api/news.api';
import { mapCmsArticleToNewsArticle } from '@/src/features/news/mappers/article.mapper';
import type { NewsCategory } from '@/src/features/news/types/article.types';
import { buildPageMetadata, isAppLocale, type AppLocale } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}

const VALID_CATEGORIES: NewsCategory[] = [
  'company',
  'construction',
  'technology',
];

const NEWS_META: Record<AppLocale, { title: string; description: string }> = {
  ko: {
    title: '뉴스 | digitalPresso',
    description:
      '건설·안전·AI 현장 운영과 관련된 digitalPresso의 최신 소식과 인사이트를 확인하세요.',
  },
  en: {
    title: 'News | digitalPresso',
    description:
      'Read the latest updates and insights from digitalPresso on construction, safety, and AI-powered field operations.',
  },
  ja: {
    title: 'ニュース | digitalPresso',
    description:
      '建設・安全・AI現場運用に関するdigitalPressoの最新ニュースとインサイトをご覧ください。',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'ko';
  const content = NEWS_META[safeLocale];

  return buildPageMetadata({
    locale: safeLocale,
    path: '/news',
    title: content.title,
    description: content.description,
    image: '/images/news-card-1.png',
  });
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, search } = await searchParams;
  const t = await getTranslations('newsPage.hero');
  const activeCategory: NewsCategory = VALID_CATEGORIES.includes(
    category as NewsCategory,
  )
    ? (category as NewsCategory)
    : 'company';

  const entities = await getPublishedArticles();
  const allArticles = entities.map((e) => mapCmsArticleToNewsArticle(e, locale));

  // Filter by category
  let filteredArticles = allArticles.filter((a) => a.category === activeCategory);

  // Filter by search query
  const searchQuery = search?.trim() || '';
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }

  const articleCounts = {
    company: allArticles.filter((a) => a.category === 'company').length,
    construction: allArticles.filter((a) => a.category === 'construction').length,
    technology: allArticles.filter((a) => a.category === 'technology').length,
  };

  return (
    <main>
      <NewsHero />
      <NewsFilterBar
        activeCategory={activeCategory}
        articleCounts={articleCounts}
        searchQuery={searchQuery}
      />
      <NewsArticleGrid
        articles={filteredArticles}
        viewButtonText={t('viewButton')}
      />
    </main>
  );
}
