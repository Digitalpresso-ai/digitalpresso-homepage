// src/features/references/components/ReferencesHero/ReferencesHero.tsx

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './ReferencesHero.module.css';

export async function ReferencesHero() {
  const t = await getTranslations('referencesPage.hero');

  return (
    <section className={styles.section}>
      <Image
        src="/images/references-hero-bg.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className={styles.bgImage}
        priority
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.textGroup}>
              <span className={styles.eyebrow}>{t('eyebrow')}</span>
              <h1 className={styles.heading}>{t('heading')}</h1>
            </div>
            <p className={styles.body}>
              {t('bodyLine1')}
              <br />
              {t('bodyLine2')}
            </p>
          </div>
          {/* 태블릿+ 에서 텍스트를 좌측으로 밀어주는 우측 스페이서 */}
          <div className={styles.spacer} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
