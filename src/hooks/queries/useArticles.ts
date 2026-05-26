import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchArticles, fetchArticleById, fetchArticleStats } from '@/src/lib/api/articles.api';

const PAGE_SIZE = 12;

export function useArticles(category?: string) {
  return useQuery({
    queryKey: ['articles', { category }],
    queryFn: () => fetchArticles({ category }),
  });
}

export function useInfiniteArticles(category?: string) {
  return useInfiniteQuery({
    queryKey: ['articles', 'infinite', { category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchArticles({ category, limit: PAGE_SIZE, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length * PAGE_SIZE;
    },
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
  });
}

export function useArticleStats() {
  return useQuery({
    queryKey: ['articles', 'stats'],
    queryFn: fetchArticleStats,
  });
}
