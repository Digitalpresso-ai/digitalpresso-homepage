// src/features/home/components/HomeWebsiteSection/HomeWebsiteSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeWebsiteSection.module.css';

export async function HomeWebsiteSection() {
  const t = await getTranslations('home.website');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageAlign}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/section13-website.jpg"
                alt={t('imageAlt')}
                fill
                className={styles.image}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.badge}>{t('badge')}</p>
              <div className={styles.titleGroup}>
                <h2 className={styles.subtitle}>{t('subtitle')}</h2>
                <p className={styles.title}>{t('title')}</p>
              </div>
            </div>
            <p className={styles.body}>{t('body1')}</p>
            <p className={styles.body}>{t('body2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
