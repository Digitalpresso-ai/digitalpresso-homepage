import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import { HomeCtaCards } from './HomeCtaCards';
import styles from './HomeCtaCardsSection.module.css';

export async function HomeCtaCardsSection() {
  const t = await getTranslations('home.ctaCards');

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <header className={styles.header}>
            <h2 className={styles.title}>
              {t.rich('title', { mobileBr: () => <br className={styles.mobileBreak} /> })}
            </h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </header>
        </RevealOnScroll>

        <HomeCtaCards />
      </div>
    </section>
  );
}
