'use client';

import { NewsArticleCard } from '../NewsArticleCard/NewsArticleCard';
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver';
import type { NewsArticle } from '../../types/article.types';
import styles from './NewsArticleGrid.module.css';

interface NewsArticleGridProps {
  articles: NewsArticle[];
  viewButtonText: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function NewsArticleGrid({
  articles,
  viewButtonText,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: NewsArticleGridProps) {
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (articles.length === 0 && !isFetchingNextPage) {
    return <p className={styles.empty}>등록된 소식이 없습니다.</p>;
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.grid}>
        {articles.map((article) => (
          <NewsArticleCard
            key={article.id}
            article={article}
            viewButtonText={viewButtonText}
          />
        ))}
      </div>
      {isFetchingNextPage && (
        <div className={styles.loading}>
          <span className={styles.spinner} />
        </div>
      )}
      <div ref={sentinelRef} className={styles.sentinel} />
    </div>
  );
}
