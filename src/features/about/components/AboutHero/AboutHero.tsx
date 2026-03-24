// src/features/about/components/AboutHero/AboutHero.tsx

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import styles from "./AboutHero.module.css";

export function AboutHero() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Image
          src="/images/dp_logo_eng.svg"
          alt="Digital Presso"
          width={234}
          height={58}
          className={styles.logo}
          priority
        />

        <h1 className={styles.heading}>
          Dynamic Integration,
          <br />
          Pragmatic Innovation
        </h1>

        <div className={styles.body}>
          <p>
            데이터 구축과 데이터 관리 혁신을 통해 기업 간 정보 활용의
            비대칭성을 해소하고자 설립되었습니다. 우리의 기술은 시공 정보,
            물류, 유통 데이터 트래킹 뿐만 아니라 기업 내외의 유형 자산
            데이터화가 필요한 모든 산업에서 확장성을 지니고 있습니다.
          </p>
          <p>
            특히, 데이터를 기반으로 한 효율적 의사결정과 자원 관리를 지원하여
            다양한 산업 분야에서 경쟁력을 높일 수 있는 솔루션을 제공합니다.
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Link href="/contact" className={styles.ctaButton}>
            문의하기
          </Link>
          <Link href="/" className={styles.outlineButton}>
            제품 소개
          </Link>
        </div>
      </div>
    </section>
  );
}
