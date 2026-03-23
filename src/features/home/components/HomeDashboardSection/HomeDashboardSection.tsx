// src/features/home/components/HomeDashboardSection/HomeDashboardSection.tsx

import Image from 'next/image';
import styles from './HomeDashboardSection.module.css';

export function HomeDashboardSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.subtitle}>프로젝트 상태를 한 눈에 보여주는</p>
              <h2 className={styles.title}>전사 현황판</h2>
            </div>
            <p className={styles.body}>
              공정, 일정, 자금 현황, 이슈 등 프로젝트 핵심 지표와 흐름을 한눈에 파악할 수 있습니다.
            </p>
            <p className={styles.body}>
              빠른 이해를 통해 원활한 의사 결정을 돕습니다.
            </p>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section8-dashboard.png"
              alt="전사 현황판 대시보드 화면 캡처 이미지"
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
