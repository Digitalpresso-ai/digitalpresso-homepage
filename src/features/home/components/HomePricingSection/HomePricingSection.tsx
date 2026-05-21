// src/features/home/components/HomePricingSection/HomePricingSection.tsx

import { getTranslations } from 'next-intl/server';
import styles from './HomePricingSection.module.css';

type PlanId = 'setup' | 'monthly';

const PLANS: readonly PlanId[] = ['setup', 'monthly'];

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path
        d="M7 12.5L10.5 16L17 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PricingCard({
  plan,
  t,
}: {
  plan: PlanId;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const features = t.raw(`${plan}.features`) as string[];
  const cardClass = plan === 'monthly' ? styles.cardMonthly : styles.cardSetup;

  return (
    <div className={`${styles.card} ${cardClass}`}>
      <div className={styles.cardHeader}>
        <div className={styles.titleBlock}>
          <p className={styles.label}>{t(`${plan}.label`)}</p>
          <h3 className={styles.title}>{t(`${plan}.title`)}</h3>
        </div>
        <div className={styles.priceBlock}>
          <p className={styles.price}>{t(`${plan}.price`)}</p>
          <p className={styles.unit}>{t(`${plan}.unit`)}</p>
        </div>
      </div>
      <hr className={styles.divider} />
      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature} className={styles.featureItem}>
            <span className={styles.checkIcon}>
              <CheckIcon />
            </span>
            <span className={styles.featureText}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function HomePricingSection() {
  const t = await getTranslations('home.pricing');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            {t.rich('heading', {
              accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
            })}
          </h2>
          <p className={styles.subheading}>{t('subheading')}</p>
        </div>
        <div className={styles.cards}>
          {PLANS.map((plan) => (
            <PricingCard key={plan} plan={plan} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
