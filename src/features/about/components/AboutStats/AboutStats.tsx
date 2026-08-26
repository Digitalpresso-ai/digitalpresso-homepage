// src/features/about/components/AboutStats/AboutStats.tsx

import { getTranslations } from 'next-intl/server';
import { ChartNoAxesCombined, FileBadge, Handshake, Target } from 'lucide-react';
import styles from './AboutStats.module.css';

const CARD_ICONS = [ChartNoAxesCombined, Handshake, Target, FileBadge];
const CARD_INDEXES = [0, 1, 2, 3] as const;

export async function AboutStats() {
  const t = await getTranslations('aboutPage.stats');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t('title')}</h2>

        <ul className={styles.cards}>
          {CARD_INDEXES.map((i) => {
            const Icon = CARD_ICONS[i];
            return (
              <li key={i} className={styles.card}>
                <span className={styles.iconBox}>
                  <Icon size={40} strokeWidth={1.5} />
                </span>
                <p className={styles.value}>
                  {t(`cards.${i}.value`)}
                  <span className={styles.suffix}>{t(`cards.${i}.suffix`)}</span>
                </p>
                <hr className={styles.divider} />
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{t(`cards.${i}.title`)}</h3>
                  <p className={styles.cardDesc}>{t(`cards.${i}.desc`)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
