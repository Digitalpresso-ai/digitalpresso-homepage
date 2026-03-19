// src/features/home/components/HomeProjectSection/HomeProjectSection.tsx

import Image from 'next/image';
import styles from './HomeProjectSection.module.css';

export function HomeProjectSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section5-project.png"
              alt="프로젝트 관리 화면 캡처 이미지"
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>

        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <p className={styles.subtitle}>
              도면에서 시공·하자 기록을 확인하는
            </p>
            <h2 className={styles.title}>프로젝트 관리</h2>
            <p className={styles.body}>
              프로젝트별 도면을 기준으로
              <br />
              시공 현황과 공정 기록을 체계적으로 관리합니다.
            </p>
            <p className={styles.body}>
              실시간 도면 조회를 통해 시공 기록과 하자·보수 내역을 한눈에
              확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
