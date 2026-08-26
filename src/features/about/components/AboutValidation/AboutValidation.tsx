// src/features/about/components/AboutValidation/AboutValidation.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './AboutValidation.module.css';

const CARD_IMAGES = [
  '/images/office-renamedp.webp',
  '/images/office-nvidia.webp',
  '/images/office-didimdol.webp',
  '/images/office-kict.webp',
  '/images/office-list.webp',
];

const CARD_INDEXES = [0, 1, 2, 3, 4] as const;

export async function AboutValidation() {
  const t = await getTranslations('aboutPage.validation');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t('title')}</h2>

        <ul className={styles.cards}>
          {CARD_INDEXES.map((i) => (
            <li key={i} className={styles.card}>
              <div className={styles.imageBox}>
                <Image
                  src={CARD_IMAGES[i]}
                  alt={t(`cards.${i}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                  className={styles.image}
                />
              </div>
              <div className={styles.textArea}>
                <div className={styles.textBox}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.cardTitle}>{t(`cards.${i}.title`)}</h3>
                    <span className={styles.badge}>{t(`cards.${i}.date`)}</span>
                  </div>
                  <p className={styles.cardDesc}>{t(`cards.${i}.desc`)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
