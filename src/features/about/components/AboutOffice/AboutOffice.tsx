// src/features/about/components/AboutOffice/AboutOffice.tsx

import { getTranslations } from 'next-intl/server';
import styles from './AboutOffice.module.css';
import { AboutOfficeGallery } from './AboutOfficeGallery';

const GALLERY_IMAGE_SOURCES = [
  '/images/about-us1.png',
  '/images/about-us2.png',
  '/images/about-us3.png',
  '/images/about-us4.png',
] as const;

export async function AboutOffice() {
  const t = await getTranslations('aboutPage.office');
  const captions = t.raw('captions') as string[];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textGroup}>
          <h2 className={styles.title}>{t('title')}</h2>
          <div className={styles.body}>
            <p>{t('body1')}</p>
            <p>{t('body2')}</p>
            <p>{t('body3')}</p>
          </div>
        </div>

        <AboutOfficeGallery images={GALLERY_IMAGE_SOURCES} captions={captions} />
      </div>
    </section>
  );
}
