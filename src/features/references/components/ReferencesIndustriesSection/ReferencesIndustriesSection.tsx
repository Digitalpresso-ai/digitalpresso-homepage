// src/features/references/components/ReferencesIndustriesSection/ReferencesIndustriesSection.tsx

import Image from 'next/image';
import styles from './ReferencesIndustriesSection.module.css';

const ROW1 = [
  { src: '/images/references-industry-manufacturing.png', alt: '제조업 현장을 보여주는 배경' },
  { src: '/images/references-industry-construction.png',  alt: '건설자재 현장을 보여주는 배경' },
];

const ROW2 = [
  { src: '/images/references-industry-logistics.png',     alt: '물류 현장을 보여주는 배경' },
  { src: '/images/references-industry-semiconductor.png', alt: '반도체 현장을 보여주는 배경' },
];

export function ReferencesIndustriesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          제조, 물류, 건설자재, 불량검출 등 다양한 산업 영역에서 적용 가능하여,
          <br />
          운영 효율성과 품질 관리를 동시에 향상 시킬 수 있습니다.
        </h2>

        <div className={styles.row}>
          {ROW1.map((img) => (
            <div key={img.src} className={styles.item}>
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className={styles.image}
                sizes="(max-width: 799px) 100vw, (max-width: 1279px) calc(50vw - 56px), 564px"
              />
            </div>
          ))}
        </div>

        <div className={styles.row}>
          {ROW2.map((img) => (
            <div key={img.src} className={styles.item}>
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className={styles.image}
                sizes="(max-width: 799px) 100vw, (max-width: 1279px) calc(50vw - 56px), 564px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
