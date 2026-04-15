// src/features/news/components/NewsFilterBar/NewsFilterBar.tsx

'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { NewsCategory } from '../../types/article.types';
import styles from './NewsFilterBar.module.css';

interface NewsFilterBarProps {
  activeCategory: NewsCategory;
  articleCounts: { company: number; construction: number; technology: number };
  searchQuery: string;
}

export function NewsFilterBar({
  activeCategory,
  articleCounts,
  searchQuery,
}: NewsFilterBarProps) {
  const t = useTranslations('newsPage.hero');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabs: { key: NewsCategory; label: string; count: number }[] = [
    { key: 'company', label: t('tabs.company'), count: articleCounts.company },
    { key: 'construction', label: t('tabs.construction'), count: articleCounts.construction },
    { key: 'technology', label: t('tabs.technology'), count: articleCounts.technology },
  ];

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    // Reset page when filters change
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTabClick = (key: NewsCategory) => {
    updateParams({ category: key });
  };

  const handleSearch = (value: string) => {
    updateParams({ search: value || null });
  };

  const countSuffix = t('countSuffix');

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabList} role="tablist">
        {tabs.map(({ key, label, count }) => {
          const isActive = key === activeCategory;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.tabActive : styles.tab}
              onClick={() => handleTabClick(key)}
            >
              {label}
              {isActive && count > 0 && (
                <span className={styles.count}>
                  {count}{countSuffix}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.searchGroup}>
        <label className={styles.searchLabel} htmlFor="news-search">
          {t('searchLabel')}
        </label>
        <div className={styles.searchInputWrapper}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="#99A1AF"
            />
          </svg>
          <input
            id="news-search"
            type="text"
            className={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            defaultValue={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
