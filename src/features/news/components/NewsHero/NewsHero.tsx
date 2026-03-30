// src/features/news/components/NewsHero/NewsHero.tsx

import { getTranslations } from 'next-intl/server';
import { CategoryTabs } from './CategoryTabs';
import { getArticlesByCategory } from '../../data/articles.data';
import type { NewsCategory } from '../../types/article.types';
import styles from './NewsHero.module.css';

interface NewsHeroProps {
  activeCategory?: NewsCategory;
  showTabs?: boolean;
}

export async function NewsHero({
  activeCategory = 'company',
  showTabs = true,
}: NewsHeroProps) {
  const t = await getTranslations('newsPage.hero');

  const tabs: { key: NewsCategory; label: string; count: number }[] = [
    { key: 'company', label: t('tabs.company'), count: getArticlesByCategory('company').length },
    { key: 'construction', label: t('tabs.construction'), count: getArticlesByCategory('construction').length },
    { key: 'technology', label: t('tabs.technology'), count: getArticlesByCategory('technology').length },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>
          {t('headingLine1')}
          <br />
          {t('headingLine2')}
        </h1>
        <p className={styles.subtitle}>
          {t('subtitleLine1')}
          <br />
          {t('subtitleLine2')}
        </p>
        {showTabs && (
          <CategoryTabs tabs={tabs} activeCategory={activeCategory} />
        )}
      </div>
    </section>
  );
}
