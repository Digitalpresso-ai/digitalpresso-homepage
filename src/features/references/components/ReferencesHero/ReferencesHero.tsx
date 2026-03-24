// src/features/references/components/ReferencesHero/ReferencesHero.tsx

import styles from './ReferencesHero.module.css';

export function ReferencesHero() {
  return (
    <section className={styles.section}>
      {/* LCP: fetchPriority="high" */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/references-hero-bg.png"
        alt=""
        aria-hidden="true"
        className={styles.bgImage}
        fetchPriority="high"
        decoding="async"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.textGroup}>
              <span className={styles.eyebrow}>고객사례</span>
              <h1 className={styles.heading}>
                Innovating with Partners Across Industries
              </h1>
            </div>
            <p className={styles.body}>
              고객의 문제를 해결하고 가치를 더하는 프로젝트,
              <br />
              그 여정에 함께한 기업들의 이야기를 소개합니다.
            </p>
          </div>
          {/* 태블릿+ 에서 텍스트를 좌측으로 밀어주는 우측 스페이서 */}
          <div className={styles.spacer} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
