// src/features/home/components/HomeFeatureSection/HomeFeatureSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeFeatureSection.module.css';

const FEATURE_TAGS = [
  '중대재해 예방 점검표',
  '안전관리 계획서',
  '시공검측 확인서',
  '주/월간 공정표',
  '공사일보',
  '시공사진 관리대장',
  '준공검사보고서',
  '일일 안전점검 일지',
  'PPE 착용점검',
  '하자보수 이행보고서',
  '현장점검 결과보고서',
  '주간 안전/품질보고',
] as const;

export async function HomeFeatureSection() {
  const t = await getTranslations('home.feature');

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
            {FEATURE_TAGS.map((tag) => (
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
