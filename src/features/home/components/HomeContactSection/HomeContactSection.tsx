// src/features/home/components/HomeContactSection/HomeContactSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/src/components/Icon';
import styles from './HomeContactSection.module.css';

export async function HomeContactSection() {
  const t = await getTranslations('home.contactSection');

  return (
    <section className={styles.section}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/section14-contact.png"
          alt={t('imageAlt')}
          width={2197}
          height={1702}
          className={styles.mockupImage}
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
              <span className={styles.contactText}>digitalpresso@digitalpresso.ai</span>
            </div>
            <div className={styles.contactItem}>
              <Icon name="phone" className={styles.icon} color="#1e2939" aria-hidden="true" />
              <span className={styles.contactText}>02-455-5796</span>
            </div>
          </div>
        </div>

        <Link href="/contact" className={styles.ctaButton}>
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
