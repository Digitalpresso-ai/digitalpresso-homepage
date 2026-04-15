// src/features/about/components/AboutOffice/AboutOffice.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './AboutOffice.module.css';

const GALLERY_IMAGE_SOURCES = [
  '/images/about-section1.png',
  '/images/about-section2.png',
  '/images/about-section3.png',
  '/images/about-section4.png',
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

        <div className={styles.gallery}>
          {GALLERY_IMAGE_SOURCES.map((src, index) => (
            <div key={src} className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={src}
                  alt={captions[index]}
                  fill
                  className={styles.image}
                  sizes="(max-width: 799px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              <span className={styles.caption}>{captions[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
