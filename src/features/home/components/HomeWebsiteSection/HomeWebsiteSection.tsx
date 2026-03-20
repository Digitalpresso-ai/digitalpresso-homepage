// src/features/home/components/HomeWebsiteSection/HomeWebsiteSection.tsx

import Image from 'next/image';
import styles from './HomeWebsiteSection.module.css';

export function HomeWebsiteSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageAlign}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/section13-website.jpg"
                alt="웹사이트 구축 서비스를 소개하는 캡처 화면"
                fill
                className={styles.image}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.badge}>PREMIUM PLAN +</p>
              <div className={styles.titleGroup}>
                <h2 className={styles.subtitle}>기업을 소개하고 홍보하는</h2>
                <p className={styles.title}>웹사이트 구축</p>
              </div>
            </div>
            <p className={styles.body}>
              Pro 플랜 이상 고객을 대상으로 기업 브랜딩과 요청 내용을 반영한 웹사이트를 제작합니다.
            </p>
            <p className={styles.body}>
              전문 디자인과 웹 구축으로 기업을 효과적으로 홍보합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
