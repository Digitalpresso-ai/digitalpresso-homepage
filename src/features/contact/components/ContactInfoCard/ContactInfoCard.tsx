// src/features/contact/components/ContactInfoCard/ContactInfoCard.tsx

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icon } from '@/src/components/Icon';
import styles from './ContactInfoCard.module.css';

export function ContactInfoCard() {
  const t = useTranslations('contact');

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>

        <ul className={styles.infoList}>
          <li className={`${styles.infoItem} ${styles.infoItemCenter}`}>
            <Icon name="mail" size={24} className={styles.infoIcon} />
            <span className={styles.infoText}>{t('email')}</span>
          </li>
          <li className={`${styles.infoItem} ${styles.infoItemStart}`}>
            <Icon name="building" size={24} className={`${styles.infoIcon} `} />
            <span className={styles.infoText}>{t('address')}</span>
          </li>
        </ul>
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/contact-building.png"
          alt={t('buildingImageAlt')}
          fill
          className={styles.buildingImage}
          sizes="(max-width: 800px) 100vw, 420px"
          priority
        />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.logoWrapper}>
        <Image
          src="/images/dp_logo_eng.svg"
          alt={t('logoAlt')}
          width={241}
          height={69}
          className={styles.logo}
        />
      </div>
    </div>
  );
}
