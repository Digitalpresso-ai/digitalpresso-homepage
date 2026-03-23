// src/features/home/components/HomeNewsSection/HomeNewsSection.tsx

import { getTranslations } from 'next-intl/server';
import { HomeNewsCard } from './HomeNewsCard';
import styles from './HomeNewsSection.module.css';

const CARD_IMAGES = [
  { src: '/images/news-card-1.png', index: 0 },
  { src: '/images/news-card-2.png', index: 1 },
  { src: '/images/news-card-3.png', index: 2 },
] as const;

export async function HomeNewsSection() {
  const t = await getTranslations('home.news');

  const cardData = [
    {
      title: t('cards.0.title'),
      date: t('cards.0.date'),
      imageAlt: t('cards.0.imageAlt'),
    },
    {
      title: t('cards.1.title'),
      date: t('cards.1.date'),
      imageAlt: t('cards.1.imageAlt'),
    },
    {
      title: t('cards.2.title'),
      date: t('cards.2.date'),
      imageAlt: t('cards.2.imageAlt'),
    },
  ] as const;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.sectionHeading}>
          <span className={styles.accent}>{t('headingPart1')}</span>
          {','}
          <br className={styles.headingBreakNarrow} />
          {t('headingPart2a')}
          <br className={styles.headingBreak} />
          {t('headingPart2b')}
          <span className={styles.accent}>{t('headingPart3')}</span>
          {t('headingPart4')}
        </h2>

        <ul className={styles.cardList}>
          {CARD_IMAGES.map(({ src, index }) => (
            <li key={index}>
              <HomeNewsCard
                title={cardData[index].title}
                date={cardData[index].date}
                imageSrc={src}
                imageAlt={cardData[index].imageAlt}
              />
            </li>
          ))}
        </ul>

        <div className={styles.textBlock}>
          <h3 className={styles.subHeading}>
            {t('subHeadingPart1')}
            <span className={styles.accent}>{t('subHeadingPart2')}</span>
            {t('subHeadingPart3')}
          </h3>
          <p className={styles.bodyText}>{t('bodyLine1')}</p>
          <p className={styles.bodyText}>{t('bodyLine2')}</p>
          <p className={styles.bodyText}>{t('bodyLine3')}</p>
        </div>
      </div>
    </section>
  );
}
