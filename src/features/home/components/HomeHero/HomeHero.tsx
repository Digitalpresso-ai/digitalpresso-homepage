import Image, { getImageProps } from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import styles from './HomeHero.module.css';

export async function HomeHero() {
  const t = await getTranslations('home.hero');

  const common = { alt: '', quality: 90, sizes: '100vw' } as const;
  const { props: { srcSet: desktopSrcSet, ...desktopRest } } = getImageProps({
    ...common,
    src: '/images/bg_main_hero.png',
    width: 2560,
    height: 1048,
    priority: true,
  });
  const { props: { srcSet: tabletSrcSet } } = getImageProps({
    ...common,
    src: '/images/bg_main_hero_tablet.png',
    width: 1600,
    height: 1048,
  });
  const { props: { srcSet: mobileSrcSet } } = getImageProps({
    ...common,
    src: '/images/bg_main_hero_mobile.png',
    width: 640,
    height: 1278,
  });

  return (
    <section className={styles.section}>
      <picture className={styles.bgPicture}>
        <source media="(max-width: 799px)" srcSet={mobileSrcSet} />
        <source media="(max-width: 1279px)" srcSet={tabletSrcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...desktopRest} srcSet={desktopSrcSet} className={styles.bg} />
      </picture>
      <div className={styles.overlay} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.textGroup}>
            <div className={styles.headerContainer}>
              <h1 className={styles.heading}>{t('heading')}</h1>
              <div className={styles.logoWrapper}>
                <Image
                  src="/images/logos/dp_logo_eng_white.svg"
                  alt={t('logoAlt')}
                  width={370}
                  height={64}
                  priority
                />
              </div>
            </div>
            <p className={styles.body}>{t('body')}</p>
          </div>
          <Link href="/contact" className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}
