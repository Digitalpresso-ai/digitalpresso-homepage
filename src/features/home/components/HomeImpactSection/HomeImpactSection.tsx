import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Icon, type IconName } from '@/src/components/Icon';
import { StepBadge } from '@/src/components/StepBadge';
import styles from './HomeImpactSection.module.css';

type CardKey = 'reportTime' | 'disputeLeadTime' | 'fastOnboarding';

interface CardConfig {
  key: CardKey;
  icon: IconName;
  hasArrow: boolean;
  suffixSize: 'large' | 'small';
}

const CARDS: readonly CardConfig[] = [
  { key: 'reportTime', icon: 'camera', hasArrow: true, suffixSize: 'large' },
  { key: 'disputeLeadTime', icon: 'shield-minus', hasArrow: true, suffixSize: 'large' },
  { key: 'fastOnboarding', icon: 'hard-hat', hasArrow: false, suffixSize: 'small' },
];

export async function HomeImpactSection() {
  const t = await getTranslations('home.impact');

  return (
    <section className={styles.section}>
      <div className={styles.background} aria-hidden="true">
        <Image
          src="/images/bg_main_score.jpg"
          alt=""
          fill
          sizes="100vw"
          className={styles.backgroundImage}
          loading="lazy"
        />
      </div>

      <div className={styles.inner}>
        <h2 className={styles.heading}>
          {t.rich('heading', {
            accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
            br: () => <br />,
          })}
        </h2>

        <ul className={styles.cardList}>
          {CARDS.map((card) => (
            <li key={card.key} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardHeading}>
                  <StepBadge variant="sky" size="small">
                    <Icon name={card.icon} size={24} />
                  </StepBadge>
                  <p className={styles.cardTitle}>{t(`cards.${card.key}.title`)}</p>
                </div>
                <div className={styles.cardMetric}>
                  <span className={styles.metricValue}>{t(`cards.${card.key}.value`)}</span>
                  <span
                    className={
                      card.suffixSize === 'large' ? styles.metricSuffixLarge : styles.metricSuffixSmall
                    }
                  >
                    {t(`cards.${card.key}.suffix`)}
                  </span>
                  {card.hasArrow && (
                    <Icon
                      name="arrow-down"
                      size={24}
                      className={styles.metricArrow}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
              <p className={styles.cardDescription}>{t(`cards.${card.key}.description`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
