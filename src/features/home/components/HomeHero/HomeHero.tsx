// src/features/home/components/HomeHero/HomeHero.tsx

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import styles from './HomeHero.module.css';

export async function HomeHero() {
  const t = await getTranslations('home.hero');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.textGroup}>
            <h1 className={styles.heading}>{t('heading')}</h1>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/renamedp_logo_eng.svg"
                alt={t('logoAlt')}
                width={370}
                height={86}
                sizes="(max-width: 800px) 272px, (max-width: 1279px) 280px, 370px"
              />
            </div>
          </div>
          <p className={styles.body}>{t('body')}</p>
          <Link href="/contact" className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
        </div>

        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/hero-worker.png"
              alt={t('imageAlt')}
              width={576}
              height={486}
              sizes="(max-width: 799px) 100vw, (max-width: 1279px) 336px, 576px"
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
