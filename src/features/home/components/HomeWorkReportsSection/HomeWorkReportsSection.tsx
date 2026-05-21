// src/features/home/components/HomeWorkReportsSection/HomeWorkReportsSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeWorkReportsSection.module.css';

export async function HomeWorkReportsSection() {
  const t = await getTranslations('home.workReports');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section-work-reports.png"
              alt={t('imageAlt')}
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.subtitle}>{t('subtitle')}</p>
              <h2 className={styles.title}>{t('title')}</h2>
            </div>
            <p className={styles.body}>{t('body1')}</p>
            <p className={styles.body}>{t('body2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
