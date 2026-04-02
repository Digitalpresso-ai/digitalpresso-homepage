// src/features/home/components/HomeMessengerSection/HomeMessengerSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './HomeMessengerSection.module.css';

export async function HomeMessengerSection() {
  const t = await getTranslations('home.messenger');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/section7-messenger.png"
              alt={t('imageAlt')}
              fill
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textBlock}>
            <div className={styles.headerContainer}>
              <p className={styles.planLabel}>{t('planLabel')}</p>
              <div className={styles.titleGroup}>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                <div className={styles.titleRow}>
                  <h2 className={styles.title}>{t('title')}</h2>
                  <div className={styles.logoWrapper}>
                    <Image
                      src="/images/sigongtalk-logo.png"
                      alt={t('logoAlt')}
                      fill
                      className={styles.logoImage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.body}>{t('body1')}</p>
            <p className={styles.body}>{t('body2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
