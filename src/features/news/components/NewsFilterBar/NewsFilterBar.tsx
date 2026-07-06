// src/features/news/components/NewsFilterBar/NewsFilterBar.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { NewsTab } from '../../types/article.types';
import styles from './NewsFilterBar.module.css';

interface NewsFilterBarProps {
  activeCategory: NewsTab;
  articleCounts: { all: number; company: number; construction: number; technology: number };
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

  // 모바일 전용 드롭다운 열림 상태
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const tabs: { key: NewsTab; label: string; count: number }[] = [
    { key: 'all', label: t('tabs.all'), count: articleCounts.all },
    { key: 'company', label: t('tabs.company'), count: articleCounts.company },
    { key: 'construction', label: t('tabs.construction'), count: articleCounts.construction },
    { key: 'technology', label: t('tabs.technology'), count: articleCounts.technology },
  ];

  const activeLabel = tabs.find((tab) => tab.key === activeCategory)?.label ?? t('tabs.all');

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

  const handleTabClick = (key: NewsTab) => {
    // '전체'는 category 파라미터를 제거해 기본 상태로 둔다.
    updateParams({ category: key === 'all' ? null : key });
    setIsOpen(false);
  };

  const handleSearch = (value: string) => {
    updateParams({ search: value || null });
  };

  const countSuffix = t('countSuffix');

  return (
    <div className={styles.wrapper}>
      {/* PC/태블릿: 탭 */}
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

      {/* 모바일: 구분 선택 드롭다운 */}
      <div className={styles.dropdown} ref={dropdownRef}>
        <span className={styles.dropdownLabel}>{t('dropdownLabel')}</span>
        <button
          type="button"
          className={styles.dropdownToggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>{activeLabel}</span>
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6 9L12 15L18 9" stroke="#1E2939" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isOpen && (
          <ul className={styles.dropdownMenu} role="listbox">
            {tabs.map(({ key, label }) => {
              const isActive = key === activeCategory;
              return (
                <li key={key} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    disabled={isActive}
                    onClick={() => handleTabClick(key)}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
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
