// src/features/home/components/HomeUploadSection/HomeUploadSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeUploadSection.module.css';

export async function HomeUploadSection() {
  const t = await getTranslations('home.upload');

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
              src="/images/section6-upload.png"
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
