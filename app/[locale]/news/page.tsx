import type { Metadata } from 'next';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import { NewsHero } from '@/src/features/news/components/NewsHero/NewsHero';
import { NewsContent } from '@/src/features/news/components/NewsContent/NewsContent';
import {
  getPublishedArticles,
  getArticleCounts,
} from '@/backend/article/application/server-facade';
import type { NewsCategory, NewsTab } from '@/src/features/news/types/article.types';
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

const PAGE_SIZE = 12;

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
  await getTranslations({ locale, namespace: 'newsPage.hero' });

  // category 파라미터가 없거나 유효하지 않으면 '전체'(all)가 기본 탭이다.
  const activeTab: NewsTab = VALID_CATEGORIES.includes(category as NewsCategory)
    ? (category as NewsCategory)
    : 'all';

  // 'all' 은 카테고리 필터 없이 전체 조회(undefined).
  const fetchCategory = activeTab === 'all' ? undefined : activeTab;

  const searchQuery = search?.trim() || '';

  const queryClient = new QueryClient();

  const [, counts] = await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['articles', 'infinite', { category: fetchCategory }],
      queryFn: () =>
        getPublishedArticles({
          category: fetchCategory,
          limit: PAGE_SIZE,
          offset: 0,
        }),
      initialPageParam: 0,
    }),
    getArticleCounts(),
  ]);

  const company = counts.company ?? 0;
  const construction = counts.construction ?? 0;
  const technology = counts.technology ?? 0;
  const articleCounts = {
    all: company + construction + technology,
    company,
    construction,
    technology,
  };

  return (
    <main>
      <NewsHero />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NewsContent
          initialCategory={activeTab}
          articleCounts={articleCounts}
          searchQuery={searchQuery}
        />
      </HydrationBoundary>
    </main>
  );
}
