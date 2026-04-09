// src/features/news/components/NewsHero/NewsHero.tsx

import { getTranslations } from 'next-intl/server';
import styles from './NewsHero.module.css';

export async function NewsHero() {
  const t = await getTranslations('newsPage.hero');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textGroup}>
          <p className={styles.label}>{t('label')}</p>
          <h1 className={styles.heading}>
            {t('headingLine1')}
            <br />
            {t('headingLine2')}
          </h1>
        </div>
        <p className={styles.subtitle}>
          {t('subtitleLine1')}
          <br />
          {t('subtitleLine2')}
        </p>
      </div>
    </section>
  );
}
