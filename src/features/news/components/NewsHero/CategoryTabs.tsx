// src/features/news/components/NewsHero/CategoryTabs.tsx

'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import type { NewsCategory } from '../../types/article.types';
import styles from './NewsHero.module.css';

interface Tab {
  key: NewsCategory;
  label: string;
  count: number;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeCategory: NewsCategory;
}

export function CategoryTabs({ tabs, activeCategory }: CategoryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabClick = (key: NewsCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
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
              <span className={styles.count}>{count}개</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
