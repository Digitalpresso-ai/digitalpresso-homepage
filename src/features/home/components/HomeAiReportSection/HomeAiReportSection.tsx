// src/features/home/components/HomeAiReportSection/HomeAiReportSection.tsx

import Image from 'next/image';
import styles from './HomeAiReportSection.module.css';

export function HomeAiReportSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section11-ai-report.png"
              alt="AI 보고서 자동 생성 화면 캡처 이미지"
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.subtitle}>적재된 데이터로 자동으로 작성되는</p>
              <h2 className={styles.title}>AI 보고서</h2>
            </div>
            <p className={styles.body}>
              적재된 데이터를 분석해 AI가 자동으로
              <br />
              보고서를 완성합니다.
            </p>
            <p className={styles.body}>
              사용자가 항목을 직접 설정하거나 파일을 첨부해 내용과 양식을 맞춤화할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
