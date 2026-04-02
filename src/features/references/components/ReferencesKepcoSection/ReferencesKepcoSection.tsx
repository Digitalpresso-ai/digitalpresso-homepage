// src/features/references/components/ReferencesKepcoSection/ReferencesKepcoSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesKepcoSection.module.css';

export async function ReferencesKepcoSection() {
  const t = await getTranslations('referencesPage.kepco');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 이미지 열 (데스크탑: 좌측) */}
        <div className={styles.imageCol}>
          <Image
            src="/images/references-kepco-erp.png"
            alt={t('imageAlt')}
            width={1007}
            height={651}
            className={styles.image}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 100vw, 50vw"
          />
        </div>

        {/* 텍스트 열 (데스크탑: 우측) */}
        <div className={styles.textCol}>
          <div className={styles.textInner}>
            <div className={styles.headerGroup}>
              {/* 데스크탑: "한전 시공 사례  w/ Rename DP" 한 줄 */}
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>{t('eyebrow')}</span>
                <span className={styles.eyebrowSub}>{t('eyebrowSub')}</span>
              </div>
              <h2 className={styles.heading}>{t('heading')}</h2>
            </div>
            <p className={styles.body}>{t('body')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
