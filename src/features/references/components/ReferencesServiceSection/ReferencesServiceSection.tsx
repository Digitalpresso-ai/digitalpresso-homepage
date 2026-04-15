// src/features/references/components/ReferencesServiceSection/ReferencesServiceSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesServiceSection.module.css';

export async function ReferencesServiceSection() {
  const t = await getTranslations('referencesPage.service');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 텍스트 열 */}
        <div className={styles.textCol}>
          <div className={styles.textInner}>
            <div className={styles.headerGroup}>
              <span className={styles.eyebrow}>{t('eyebrow')}</span>
              <h2 className={styles.heading}>{t('heading')}</h2>
            </div>
            <p className={styles.body}>{t('body')}</p>
          </div>
        </div>

        {/* 이미지 열 */}
        <div className={styles.imageCol}>
          <Image
            src="/images/references-service-logic.png"
            alt={t('imageAlt')}
            width={1279}
            height={374}
            className={styles.image}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
