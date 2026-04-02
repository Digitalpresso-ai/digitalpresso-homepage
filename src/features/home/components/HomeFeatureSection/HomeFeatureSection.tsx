// src/features/home/components/HomeFeatureSection/HomeFeatureSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeFeatureSection.module.css';

export async function HomeFeatureSection() {
  const t = await getTranslations('home.feature');
  const featureTags = t.raw('tags') as string[];

  return (
    <section className={styles.section}>
      <Image
        src="/images/section3-bg.png"
        alt=""
        fill
        className={styles.bgTexture}
        loading="lazy"
        aria-hidden
      />

      <div className={styles.inner}>
        <div className={styles.textContainer}>
          <h2 className={styles.heading}>
            {t('headingPre')}
            <br className={styles.brMobileOnly} />
            {t('headingPost')}
            <span className={styles.accent}>{t('headingAccent1')}</span>
            {','}
            <br />
            {t('headingMid')}
            <span className={styles.accent}>{t('headingAccent2')}</span>
            {','}
            <br className={styles.brTabletMobile} />
            {t('headingSuffix')}
            <span className={styles.accent}>{t('headingAccent3')}</span>
          </h2>

          <ul className={styles.tagList}>
            {featureTags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
            <li className={styles.dotIndicator} aria-hidden>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </li>
          </ul>
        </div>

        <div className={styles.workflowImageWrapper}>
          <Image
            src="/images/section3-workflow.png"
            alt={t('workflowAlt')}
            fill
            className={styles.workflowImage}
            loading="lazy"
          />
        </div>

        <div className={styles.flowImageWrapper}>
          <Image
            src="/images/section3-flow.png"
            alt={t('workflowAlt')}
            fill
            className={styles.flowImage}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
