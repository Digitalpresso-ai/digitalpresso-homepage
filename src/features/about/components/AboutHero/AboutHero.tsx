// src/features/about/components/AboutHero/AboutHero.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import styles from './AboutHero.module.css';

export async function AboutHero() {
  const t = await getTranslations('aboutPage.hero');

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
          {t('headingLine1')}
          <br />
          {t('headingLine2')}
        </h1>

        <div className={styles.body}>
          <p>{t('body1')}</p>
          <p>{t('body2')}</p>
        </div>

        <div className={styles.buttonGroup}>
          <Link href="/contact" className={styles.ctaButton}>
            {t('cta')}
          </Link>
          <Link href="/" className={styles.outlineButton}>
            {t('secondaryCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
