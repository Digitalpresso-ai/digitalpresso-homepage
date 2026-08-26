import { ArrowDown, ArrowRight, BookOpen, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeCtaCardsSection.module.css';

const CARDS = [
  { key: 'contact', Icon: Mail, ActionIcon: ArrowRight },
  { key: 'brochure', Icon: BookOpen, ActionIcon: ArrowDown, download: true },
] as const;

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

        <div className={styles.cards}>
          {CARDS.map((card, index) => {
            const { key, Icon, ActionIcon } = card;
            const isDownload = 'download' in card && card.download;
            return (
            <RevealOnScroll key={key} order={index + 1} className={styles.cardReveal}>
              <article className={styles.card}>
                <span className={styles.hoverBar} aria-hidden />
                <div className={styles.cardBody}>
                  <span className={styles.iconBox}>
                    <Icon size={60} strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  <h3 className={styles.cardTitle}>{t(`cards.${key}.title`)}</h3>
                  <p className={styles.cardDesc}>{t(`cards.${key}.desc`)}</p>
                </div>
                <a
                  className={styles.button}
                  href={t(`cards.${key}.href`)}
                  {...(isDownload
                    ? { download: t(`cards.${key}.filename`) }
                    : {})}
                >
                  <span>{t(`cards.${key}.button`)}</span>
                  <ActionIcon size={24} strokeWidth={2.2} aria-hidden="true" />
                </a>
              </article>
            </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
