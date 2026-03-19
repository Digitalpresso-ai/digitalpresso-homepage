// src/features/home/components/HomeMessengerSection/HomeMessengerSection.tsx

import Image from 'next/image';
import styles from './HomeMessengerSection.module.css';

export function HomeMessengerSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section7-messenger.png"
              alt="AI 메신저 시공톡 앱 화면 캡처 이미지"
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.planLabel}>PREMIUM PLAN +</p>
              <div className={styles.titleGroup}>
                <p className={styles.subtitle}>현장의 대화를 자동으로 정리하는</p>
                <div className={styles.titleRow}>
                  <h2 className={styles.title}>AI 메신저</h2>
                  <div className={styles.logoWrapper}>
                    <Image
                      src="/images/sigongtalk-logo.png"
                      alt="시공톡"
                      fill
                      className={styles.logoImage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.body}>
              각 공정의 TBM 내용과 공정별 주요 사항을 현장에서 바로 기록하고 공유할 수 있습니다.
            </p>
            <p className={styles.body}>
              현장의 대화는 자동으로 정리되어 매일 일일보고의 형식으로 제공됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
