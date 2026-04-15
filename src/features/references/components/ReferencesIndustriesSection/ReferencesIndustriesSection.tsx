// src/features/references/components/ReferencesIndustriesSection/ReferencesIndustriesSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesIndustriesSection.module.css';

const ROW1_SOURCES = [
  '/images/references-industry-manufacturing.png',
  '/images/references-industry-construction.png',
];

const ROW2_SOURCES = [
  '/images/references-industry-logistics.png',
  '/images/references-industry-semiconductor.png',
];

export async function ReferencesIndustriesSection() {
  const t = await getTranslations('referencesPage.industries');
  const row1Alts = t.raw('row1Alts') as string[];
  const row2Alts = t.raw('row2Alts') as string[];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{t('heading')}</h2>

        <div className={styles.row}>
          {ROW1_SOURCES.map((src, index) => (
            <div key={src} className={styles.item}>
              <Image
                src={src}
                alt={row1Alts[index]}
                width={600}
                height={400}
                className={styles.image}
                sizes="(max-width: 799px) 100vw, (max-width: 1279px) calc(50vw - 56px), 564px"
              />
            </div>
          ))}
        </div>

        <div className={styles.row}>
          {ROW2_SOURCES.map((src, index) => (
            <div key={src} className={styles.item}>
              <Image
                src={src}
                alt={row2Alts[index]}
                width={600}
                height={400}
                className={styles.image}
                sizes="(max-width: 799px) 100vw, (max-width: 1279px) calc(50vw - 56px), 564px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
