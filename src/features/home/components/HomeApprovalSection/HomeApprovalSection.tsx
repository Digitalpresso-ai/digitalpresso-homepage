// src/features/home/components/HomeApprovalSection/HomeApprovalSection.tsx

import Image from 'next/image';
import styles from './HomeApprovalSection.module.css';

export function HomeApprovalSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section9-approval.png"
              alt="전자 결재 시스템 문서 작성 화면 캡처 이미지"
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.subtitle}>문서를 온라인으로 작성·검토·승인하는</p>
              <h2 className={styles.title}>전자 결재 시스템</h2>
            </div>
            <p className={styles.body}>
              문서를 온라인으로 처리해 결재 절차를 빠르게 진행할 수 있습니다.
            </p>
            <p className={styles.body}>
              또한 결재 현황을 한곳에서 확인하며 업무를 체계적으로 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
