// src/features/news/components/NewsPagination/NewsPagination.tsx

'use client';

import styles from './NewsPagination.module.css';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NewsPagination({ currentPage, totalPages, onPageChange }: NewsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.arrow}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <svg
          className={styles.arrowIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className={styles.pageInfo}>
        <span className={styles.pageCurrent}>{currentPage}</span>
        <span className={styles.pageSeparator}>/{totalPages}</span>
      </span>

      <button
        className={styles.arrow}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <svg
          className={styles.arrowIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
