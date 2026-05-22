// src/features/home/components/HomeDocumentsSection/HomeDocumentsSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeDocumentsSection.module.css';

export async function HomeDocumentsSection() {
  const t = await getTranslations('home.documents');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <h2 className={styles.subtitle}>{t('subtitle')}</h2>
              <p className={styles.title}>{t('title')}</p>
            </div>
            <p className={styles.body}>{t('body1')}</p>
            <p className={styles.body}>{t('body2')}</p>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section-documents.png"
              alt={t('imageAlt')}
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
