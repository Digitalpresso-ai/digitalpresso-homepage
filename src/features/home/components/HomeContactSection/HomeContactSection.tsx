// src/features/home/components/HomeContactSection/HomeContactSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import TrackedLink from '@/components/analytics/TrackedLink';
import { Icon } from '@/src/components/Icon';
import styles from './HomeContactSection.module.css';

export async function HomeContactSection() {
  const t = await getTranslations('home.contactSection');

  return (
    <section className={styles.section}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/section-contact.png"
          alt={t('imageAlt')}
          width={2197}
          height={1702}
          className={styles.mockupImage}
          priority
        />
      </div>

      <div className={styles.content}>
        <div className={styles.textGroup}>
          <h2 className={styles.heading}>
            {t('headingLine1')}
            <br />
            {t('headingLine2')}
          </h2>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Icon name="mail" className={styles.icon} color="#1e2939" aria-hidden="true" />
              <a href="mailto:digitalpresso@digitalpresso.ai" className={styles.contactText}>digitalpresso@digitalpresso.ai</a>
            </div>
            <div className={styles.contactItem}>
              <Icon name="phone" className={styles.icon} color="#1e2939" aria-hidden="true" />
              <a href="tel:0244555796" className={styles.contactText}>02-455-5796</a>
            </div>
          </div>
        </div>

        <TrackedLink href="/contact" location="home_contact" className={styles.ctaButton}>
          {t('cta')}
        </TrackedLink>
      </div>
    </section>
  );
}
