// src/features/home/components/HomePricingSection/HomePricingSection.tsx

import { getTranslations } from 'next-intl/server';
import styles from './HomePricingSection.module.css';

interface PricingPlan {
  id: 'basic' | 'premium' | 'enterprise';
  tier: string;
  colorClass: string;
  cardClass: string;
  checkClass: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    tier: 'BASIC',
    colorClass: styles.colorBlue,
    cardClass: styles.cardBlue,
    checkClass: styles.checkBlue,
  },
  {
    id: 'premium',
    tier: 'PREMIUM',
    colorClass: styles.colorOrange,
    cardClass: styles.cardOrange,
    checkClass: styles.checkOrange,
  },
  {
    id: 'enterprise',
    tier: 'ENTERPRISE',
    colorClass: styles.colorGreen,
    cardClass: styles.cardGreen,
    checkClass: styles.checkGreen,
  },
];

function CheckIcon({ className }: { className: string }) {
  return (
    <span className={`${styles.checkIcon} ${className}`} aria-hidden="true">
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.5 5.5L5.5 9.5L12.5 1.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PricingCard({ plan, t }: { plan: PricingPlan; t: Awaited<ReturnType<typeof getTranslations>> }) {
  const features = t.raw(`plans.${plan.id}.features`) as string[];

  return (
    <div className={`${styles.card} ${plan.cardClass}`}>
      <h3 className={`${styles.cardTitle} ${plan.colorClass}`}>
        {plan.tier} - {t(`plans.${plan.id}.name`)}
      </h3>

      <div className={styles.recommendSection}>
        <p className={styles.label}>{t('labels.recommendation')}</p>
        <p className={`${styles.recommendText} ${styles.indented}`}>
          {t(`plans.${plan.id}.recommendation`)}
        </p>
      </div>

      <div className={styles.featureSection}>
        <p className={styles.label}>{t('labels.features')}</p>
        <ul className={styles.featureList}>
          {features.map((feature) => (
            <li key={feature} className={styles.featureItem}>
              <CheckIcon className={plan.checkClass} />
              <span className={styles.featureText}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function HomePricingSection() {
  const t = await getTranslations('home.pricing');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <p className={styles.headerLine1}>{t('headingLine1')}</p>
          <p className={styles.headerLine2}>
            <span className={styles.headerAccent}>RENAME DP</span>
            {t('headingLine2')}
          </p>
        </div>

        <div className={styles.cardsContainer}>
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
