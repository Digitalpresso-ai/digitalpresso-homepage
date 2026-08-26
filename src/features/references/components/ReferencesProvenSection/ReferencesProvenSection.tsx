// src/features/references/components/ReferencesProvenSection/ReferencesProvenSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesProvenSection.module.css';

interface CardConfig {
  key: 'construction' | 'kaia' | 'gwangju';
  imageSrc: string;
}

const CARDS: readonly CardConfig[] = [
  { key: 'construction', imageSrc: '/images/customer-50.webp' },
  { key: 'kaia', imageSrc: '/images/customer-kaia.webp' },
  { key: 'gwangju', imageSrc: '/images/customer-ai.webp' },
];

export async function ReferencesProvenSection() {
  const t = await getTranslations('referencesPage.proven');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {t.rich('heading', {
            accent: (chunks) => <span className={styles.highlight}>{chunks}</span>,
          })}
        </h2>

        <ul className={styles.cards}>
          {CARDS.map((card) => (
            <li key={card.key} className={styles.card}>
              <div className={styles.imageBox}>
                <Image
                  src={card.imageSrc}
                  alt={t(`cards.${card.key}.imageAlt`)}
                  fill
                  className={styles.image}
                  sizes="(max-width: 799px) calc(100vw - 40px), (max-width: 1279px) calc((100vw - 128px) / 3), 368px"
                />
              </div>
              <div className={styles.textArea}>
                <h3
                  className={
                    card.key === 'kaia'
                      ? styles.cardTitle
                      : `${styles.cardTitle} ${styles.cardTitleNowrap}`
                  }
                >
                  {t.rich(`cards.${card.key}.title`, { br: () => <br /> })}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
