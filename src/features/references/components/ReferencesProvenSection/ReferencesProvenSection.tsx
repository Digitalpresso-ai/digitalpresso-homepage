// src/features/references/components/ReferencesProvenSection/ReferencesProvenSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesProvenSection.module.css';

interface CardConfig {
  key: 'construction' | 'kaia' | 'gwangju';
  imageSrc: string;
  small?: boolean;
}

const CARDS: readonly CardConfig[] = [
  { key: 'construction', imageSrc: '/images/customer1.png' },
  { key: 'kaia', imageSrc: '/images/customer2.png', small: true },
  { key: 'gwangju', imageSrc: '/images/customer3.png' },
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

        <div className={styles.cardRow}>
          {CARDS.map((card) => (
            <div key={card.key} className={styles.card}>
              <Image
                src={card.imageSrc}
                alt={t(`cards.${card.key}.imageAlt`)}
                fill
                className={styles.cardImage}
                sizes="(max-width: 799px) calc(100vw - 40px), (max-width: 1279px) calc((100vw - 128px) / 3), 368px"
              />
              <h3
                className={
                  card.small
                    ? `${styles.cardTitle} ${styles.cardTitleSmall}`
                    : styles.cardTitle
                }
              >
                {t.rich(`cards.${card.key}.title`, { br: () => <br /> })}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
