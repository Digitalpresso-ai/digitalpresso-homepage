// src/features/news/components/NewsArticleGrid/NewsArticleGrid.tsx

import { NewsArticleCard } from '../NewsArticleCard/NewsArticleCard';
import type { Article } from '../../types/article.types';
import styles from './NewsArticleGrid.module.css';

interface NewsArticleGridProps {
  articles: Article[];
}

export function NewsArticleGrid({ articles }: NewsArticleGridProps) {
  if (articles.length === 0) {
    return <p className={styles.empty}>등록된 소식이 없습니다.</p>;
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.grid}>
        {articles.map((article) => (
          <NewsArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
