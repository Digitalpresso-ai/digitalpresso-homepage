// src/features/references/components/ReferencesServiceSection/ReferencesServiceSection.tsx

import Image from 'next/image';
import styles from './ReferencesServiceSection.module.css';

export function ReferencesServiceSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 텍스트 열 */}
        <div className={styles.textCol}>
          <div className={styles.textInner}>
            <div className={styles.headerGroup}>
              <span className={styles.eyebrow}>Rename DP 서비스 로직</span>
              <h2 className={styles.heading}>
                촬영과 동시에 입력 및 저장으로{' '}
                <br className={styles.desktopBreak} />
                손쉬운 현장 사진 관리
              </h2>
            </div>
            <p className={styles.body}>
              구조물 번호를 자동으로 인식하고, 촬영 시점의 위치,
              <br className={styles.desktopBreak} />
              시간, 작업자 정보 등 메타데이터를 함께 저장하여
              <br className={styles.desktopBreak} />
              사진을 곧바로 구조화된 데이터로 전환합니다.
            </p>
          </div>
        </div>

        {/* 이미지 열 */}
        <div className={styles.imageCol}>
          <Image
            src="/images/references-service-logic.png"
            alt="Rename DP 서비스 로직 워크플로우"
            width={1279}
            height={374}
            className={styles.image}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
