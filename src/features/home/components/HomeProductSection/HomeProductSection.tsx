// src/features/home/components/HomeProductSection/HomeProductSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeProductSection.module.css';

const FEATURE_IMAGES = [
  {
    src: '/images/section4-checklist.png',
    aspectWidth: 480,
    aspectHeight: 634,
  },
] as const;

export async function HomeProductSection() {
  const t = await getTranslations('home.product');

  return (
    <section className={styles.section}>
      {FEATURE_IMAGES.map((image, index) => (
        <article key={image.src} className={styles.featureItem}>
          <div className={styles.container}>
            <div className={styles.textColumn}>
              <div className={styles.textBlock}>
                <p className={styles.subtitle}>
                  {t(`features.${index}.subtitle`)}
                </p>
                <h2 className={styles.title}>
                  {t(`features.${index}.title`)}
                </h2>
                <p className={styles.body}>
                  {t(`features.${index}.body1`)}
                </p>
                <p className={styles.body}>
                  {t(`features.${index}.body2`)}
                </p>
              </div>
            </div>

            <div className={styles.imageColumn}>
              <div className={styles.imageWrapper}>
                <Image
                  src={image.src}
                  alt={t(`features.${index}.imageAlt`)}
                  fill
                  className={styles.image}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
