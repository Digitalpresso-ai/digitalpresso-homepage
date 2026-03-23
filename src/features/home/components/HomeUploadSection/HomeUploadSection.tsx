// src/features/home/components/HomeUploadSection/HomeUploadSection.tsx

import Image from 'next/image';
import styles from './HomeUploadSection.module.css';

export function HomeUploadSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <p className={styles.subtitle}>공정별로 항목을 선택하여 기록하는</p>
            <h2 className={styles.title}>공정별 촬영 및 업로드</h2>
            <p className={styles.body}>
              공정 흐름에 맞춰 사진과 내용을 기록해 시공 현황과 품질 상태를 체계적으로 관리할 수 있습니다.
            </p>
            <p className={styles.body}>
              해당 공정 하자 발생 시 즉시 확인하고 대응할 수 있습니다.
            </p>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section6-upload.png"
              alt="공정 별 촬영 및 업로드 기능을 설명하는 앱 화면 캡처 이미지"
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
