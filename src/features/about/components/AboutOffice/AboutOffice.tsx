// src/features/about/components/AboutOffice/AboutOffice.tsx

import Image from "next/image";
import styles from "./AboutOffice.module.css";

const GALLERY_ITEMS = [
  { src: "/images/about-section1.png", caption: "Office" },
  { src: "/images/about-section2.png", caption: "Cafeteria" },
  { src: "/images/about-section3.png", caption: "Tea Room" },
  { src: "/images/about-section4.png", caption: "Testbed Zone" },
] as const;

export function AboutOffice() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textGroup}>
          <h2 className={styles.title}>Our office</h2>
          <div className={styles.body}>
            <p>
              우리는 초기 단계에서도 작은 발걸음 하나하나가 앞으로 나아가고
              있다는 확신을 받으며 일합니다.
            </p>
            <p>
              자유와 책임 속에서 각자의 업무를 주도적으로 이끌고, 창의성과
              협업이
              <br className={styles.brDesktop} />
              자유롭게 발휘되는 유연한 환경을 제공합니다.
            </p>
            <p>
              함께 혁신을 만들어 가며, 매일 회사의 성장과 발전에 기여하고
              있다는
              <br className={styles.brDesktop} />
              자부심을 가지고 있습니다.
            </p>
          </div>
        </div>

        <div className={styles.gallery}>
          {GALLERY_ITEMS.map((item) => (
            <div key={item.caption} className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className={styles.image}
                  sizes="(max-width: 799px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              <span className={styles.caption}>{item.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
