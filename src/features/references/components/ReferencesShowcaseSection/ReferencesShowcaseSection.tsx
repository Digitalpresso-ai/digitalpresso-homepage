// src/features/references/components/ReferencesShowcaseSection/ReferencesShowcaseSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesShowcaseSection.module.css';

interface Props {
  namespace: string;
  imageSrc: string;
  reverse?: boolean;
  imageWidth?: number;
  imageHeight?: number;
}

export async function ReferencesShowcaseSection({
  namespace,
  imageSrc,
  reverse = false,
  imageWidth = 1120,
  imageHeight = 840,
}: Props) {
  const t = await getTranslations(namespace);

  return (
    <section className={styles.section}>
      <div className={`${styles.container} ${reverse ? styles.reverse : ''}`}>
        <div className={styles.textCol}>
          <div className={styles.textInner}>
            <h2 className={styles.heading}>{t('heading')}</h2>
            <p className={styles.body}>{t('bodyLine1')}</p>
            <p className={styles.body}>{t('bodyLine2')}</p>
          </div>
        </div>

        <div className={styles.imageCol}>
          <Image
            src={imageSrc}
            alt={t('imageAlt')}
            width={imageWidth}
            height={imageHeight}
            className={styles.image}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 100vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}
