// src/features/references/components/ReferencesIndustriesSection/ReferencesIndustriesSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesIndustriesSection.module.css';

const SOURCES = [
  '/images/references-industry-manufacturing.png',
  '/images/references-industry-construction.png',
  '/images/references-industry-logistics.png',
  '/images/references-industry-semiconductor.png',
];

export async function ReferencesIndustriesSection() {
  const t = await getTranslations('referencesPage.industries');
  const alts = t.raw('alts') as string[];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{t('heading')}</h2>

        <div className={styles.row}>
          {SOURCES.map((src, index) => (
            <div key={src} className={styles.item}>
              <Image
                src={src}
                alt={alts[index]}
                width={600}
                height={400}
                className={styles.image}
                sizes="(max-width: 799px) calc(100vw - 40px), (max-width: 1279px) calc((100vw - 96px - 24px) / 4), 278px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
