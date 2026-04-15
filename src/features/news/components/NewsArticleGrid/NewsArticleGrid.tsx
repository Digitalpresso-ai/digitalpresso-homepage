// src/features/news/components/NewsArticleGrid/NewsArticleGrid.tsx

'use client';

import { useState, useEffect } from 'react';
import { NewsArticleCard } from '../NewsArticleCard/NewsArticleCard';
import { NewsPagination } from '../NewsPagination/NewsPagination';
import type { NewsArticle } from '../../types/article.types';
import styles from './NewsArticleGrid.module.css';

const DESKTOP_PER_PAGE = 12;
const TABLET_PER_PAGE = 8;
const MOBILE_PER_PAGE = 5;

interface NewsArticleGridProps {
  articles: NewsArticle[];
  viewButtonText: string;
}

function usePerPage() {
  const [perPage, setPerPage] = useState(DESKTOP_PER_PAGE);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 799) setPerPage(MOBILE_PER_PAGE);
      else if (w <= 1279) setPerPage(TABLET_PER_PAGE);
      else setPerPage(DESKTOP_PER_PAGE);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return perPage;
}

export function NewsArticleGrid({
  articles,
  viewButtonText,
}: NewsArticleGridProps) {
  const perPage = usePerPage();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));

  // Reset to page 1 when perPage or article count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, articles.length]);

  // Clamp currentPage if it exceeds totalPages
  const safePage = Math.min(currentPage, totalPages);
  const visible = articles.slice((safePage - 1) * perPage, safePage * perPage);

  if (articles.length === 0) {
    return <p className={styles.empty}>등록된 소식이 없습니다.</p>;
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.grid}>
        {visible.map((article) => (
          <NewsArticleCard
            key={article.id}
            article={article}
            viewButtonText={viewButtonText}
          />
        ))}
      </div>
      <NewsPagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
