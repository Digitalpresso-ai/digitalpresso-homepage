import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { RevealOnScroll } from '@/src/components/motion/RevealOnScroll';
import styles from './HomeResultSection.module.css';

const RESULTS = ['reportTime', 'duplicateWork', 'documentPrep', 'sameDayDraft'] as const;

export async function HomeResultSection() {
  const t = await getTranslations('home.results');

  return (
    <section className={styles.section} aria-labelledby="home-results-title">
      <Image
        src="/images/main-result-1920.jpg"
        alt=""
        fill
        sizes="100vw"
        className={styles.backgroundImage}
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <RevealOnScroll className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.badge}>{t('eyebrow')}</p>
          <h2 id="home-results-title" className={styles.title}>
            {t.rich('title', {
              accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
              br: () => <br />,
              mobileBr: () => <br className={styles.mobileBreak} />,
            })}
          </h2>
        </div>

        <ul className={styles.cardList}>
          {RESULTS.map((result) => (
            <li key={result} className={styles.card}>
              <strong className={styles.metric}>{t(`cards.${result}.metric`)}</strong>
              <p className={styles.cardText}>{t(`cards.${result}.text`)}</p>
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </section>
  );
}
