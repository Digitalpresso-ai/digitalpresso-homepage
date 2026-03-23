// src/features/home/components/HomeContactSection/HomeContactSection.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/src/components/Icon';
import styles from './HomeContactSection.module.css';

export function HomeContactSection() {
  return (
    <section className={styles.section}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/section14-contact.png"
          alt="RENAME DP 앱 화면 목업"
          width={2197}
          height={1702}
          className={styles.mockupImage}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.textGroup}>
          <h2 className={styles.heading}>
            RENAME DP 도입 상담,
            <br />
            바로 문의하세요
          </h2>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Icon name="mail" className={styles.icon} color="#1e2939" aria-hidden="true" />
              <span className={styles.contactText}>digitalpresso@digitalpresso.ai</span>
            </div>
            <div className={styles.contactItem}>
              <Icon name="phone" className={styles.icon} color="#1e2939" aria-hidden="true" />
              <span className={styles.contactText}>02-455-5796</span>
            </div>
          </div>
        </div>

        <Link href="/contact" className={styles.ctaButton}>
          지금 문의하기
        </Link>
      </div>
    </section>
  );
}
