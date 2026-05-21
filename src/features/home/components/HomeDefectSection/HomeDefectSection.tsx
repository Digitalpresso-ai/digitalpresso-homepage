// src/features/home/components/HomeDefectSection/HomeDefectSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeDefectSection.module.css';

export async function HomeDefectSection() {
  const t = await getTranslations('home.defect');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <p className={styles.subtitle}>{t('subtitle')}</p>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.body}>{t('body1')}</p>
            <p className={styles.body}>{t('body2')}</p>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section-defect.png"
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
