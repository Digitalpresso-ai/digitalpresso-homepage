// src/features/references/components/ReferencesKepcoSection/ReferencesKepcoSection.tsx

import Image from 'next/image';
import styles from './ReferencesKepcoSection.module.css';

export function ReferencesKepcoSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 이미지 열 (데스크탑: 좌측) */}
        <div className={styles.imageCol}>
          <Image
            src="/images/references-kepco-erp.png"
            alt="한전 시공 사례 ERP 대시보드 화면"
            width={1007}
            height={651}
            className={styles.image}
            sizes="(max-width: 799px) 100vw, (max-width: 1279px) 100vw, 50vw"
          />
        </div>

        {/* 텍스트 열 (데스크탑: 우측) */}
        <div className={styles.textCol}>
          <div className={styles.textInner}>
            <div className={styles.headerGroup}>
              {/* 데스크탑: "한전 시공 사례  w/ Rename DP" 한 줄 */}
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>한전 시공 사례</span>
                <span className={styles.eyebrowSub}>w/ Rename DP</span>
              </div>
              <h2 className={styles.heading}>
                재고관리의 효율성 및 재무 흐름
                <br />
                파악에 최적화된 ERP
              </h2>
            </div>
            <p className={styles.body}>
              자재의 입출고와 재고 현황을 실시간으로 파악하여
              <br className={styles.desktopBreak} />
              자재 흐름 및 재무 흐름을 한 눈에 보여주는 대시보드를
              <br className={styles.desktopBreak} />
              제공합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
