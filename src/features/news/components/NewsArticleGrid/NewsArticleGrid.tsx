'use client';

import { NewsArticleCard } from '../NewsArticleCard/NewsArticleCard';
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver';
import type { NewsArticle, NewsCategory } from '../../types/article.types';
import styles from './NewsArticleGrid.module.css';

interface NewsArticleGridProps {
  articles: NewsArticle[];
  viewButtonText: string;
  tagLabels: Record<NewsCategory, string>;
  /** 카드에 카테고리 태그를 노출할지 여부 ('전체' 탭에서만 true) */
  showTag: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function NewsArticleGrid({
  articles,
  viewButtonText,
  tagLabels,
  showTag,
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
            tagLabels={tagLabels}
            showTag={showTag}
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
