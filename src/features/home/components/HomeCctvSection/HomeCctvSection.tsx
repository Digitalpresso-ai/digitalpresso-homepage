// src/features/home/components/HomeCctvSection/HomeCctvSection.tsx

import Image from 'next/image';
import styles from './HomeCctvSection.module.css';

export function HomeCctvSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <h2 className={styles.subtitle}>AI가 자동으로 분석하는</h2>
              <p className={styles.title}>CCTV 실시간 위험 감지</p>
            </div>
            <p className={styles.body}>
              AI가 여러 CCTV 영상을 실시간으로 분석해 안전모 미착용, 위험 구역 침입 등 다양한 이상 상황을 빠르게 찾아냅니다.
            </p>
            <p className={styles.body}>
              또한 과거 영상과 이벤트 기록을 조회해 현장 안전 상태를 쉽게 파악할 수 있습니다.
            </p>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section12-cctv.png"
              alt="CCTV 실시간 위험 감지 화면"
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
