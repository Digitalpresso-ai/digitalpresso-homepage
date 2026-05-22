// src/features/home/components/HomeShowcaseSection/HomeShowcaseSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeShowcaseSection.module.css';

interface Props {
  namespace: string;
  imageSrc: string;
  imageAspectRatio: string;
  reverse?: boolean;
  background?: string;
  objectFit?: 'contain' | 'cover';
  variant?: 'compact' | 'large';
  bodySize?: 'lg' | 'md';
}

export async function HomeShowcaseSection({
  namespace,
  imageSrc,
  imageAspectRatio,
  reverse = false,
  background,
  objectFit = 'contain',
  variant = 'large',
  bodySize = 'lg',
}: Props) {
  const t = await getTranslations(namespace);

  const containerClass = [
    styles.container,
    variant === 'compact' ? styles.compact : '',
    reverse ? styles.reverse : '',
  ]
    .filter(Boolean)
    .join(' ');

  const imageClass = `${styles.image} ${objectFit === 'cover' ? styles.cover : ''}`.trim();
  const bodyClass = `${styles.body} ${bodySize === 'md' ? styles.bodyMd : ''}`.trim();

  return (
    <section className={styles.section} style={background ? { background } : undefined}>
      <div className={containerClass}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper} style={{ aspectRatio: imageAspectRatio }}>
            <Image
              src={imageSrc}
              alt={t('imageAlt')}
              fill
              className={imageClass}
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
            <p className={bodyClass}>{t('body1')}</p>
            <p className={bodyClass}>{t('body2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
