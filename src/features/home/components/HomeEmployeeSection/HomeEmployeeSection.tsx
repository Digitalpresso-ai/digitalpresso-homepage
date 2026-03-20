// src/features/home/components/HomeEmployeeSection/HomeEmployeeSection.tsx

import Image from 'next/image';
import styles from './HomeEmployeeSection.module.css';

export function HomeEmployeeSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <h2 className={styles.subtitle}>직원 정보를 통합해 관리하는</h2>
              <p className={styles.title}>직원 관리 시스템</p>
            </div>
            <p className={styles.body}>
              직원 정보를 한곳에 모아 근태와 인사 현황을 손쉽게 확인할 수 있습니다.
            </p>
            <p className={styles.body}>
              또한 필요한 데이터를 체계적으로 정리해 효율적인 인력 관리를 지원합니다.
            </p>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section10-employee.png"
              alt="직원 관리 시스템 화면"
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
