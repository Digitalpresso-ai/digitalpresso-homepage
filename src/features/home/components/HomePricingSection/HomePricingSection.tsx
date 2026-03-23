// src/features/home/components/HomePricingSection/HomePricingSection.tsx

import styles from './HomePricingSection.module.css';

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  tier: string;
  name: string;
  colorClass: string;
  cardClass: string;
  checkClass: string;
  recommendation: string;
  features: PlanFeature[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    tier: 'BASIC',
    name: '기본형',
    colorClass: styles.colorBlue,
    cardClass: styles.cardBlue,
    checkClass: styles.checkBlue,
    recommendation: '단일 프로젝트 진행자, 소규모 시공사',
    features: [
      { text: '프로젝트 현황·진척 관리' },
      { text: '프로젝트 행정·문서 관리' },
      { text: '품질·하자 관리' },
    ],
  },
  {
    id: 'premium',
    tier: 'PREMIUM',
    name: '고급형',
    colorClass: styles.colorOrange,
    cardClass: styles.cardOrange,
    checkClass: styles.checkOrange,
    recommendation: '복수 프로젝트, 중견 건설사',
    features: [
      { text: '기본형 주요 기능 탑재' },
      { text: '현장 커뮤니케이션' },
      { text: '안전 관리' },
      { text: 'AI 자동 작성 전자 결재 시스템' },
    ],
  },
  {
    id: 'enterprise',
    tier: 'ENTERPRISE',
    name: '기업맞춤형',
    colorClass: styles.colorGreen,
    cardClass: styles.cardGreen,
    checkClass: styles.checkGreen,
    recommendation: '대형 건설사, 공공기관 등',
    features: [
      { text: '고급형 주요 기능 탑재' },
      { text: 'AI 위험관리 시스템' },
      { text: '고객 맞춤형 기능' },
    ],
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

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className={`${styles.card} ${plan.cardClass}`}>
      <h3 className={`${styles.cardTitle} ${plan.colorClass}`}>
        {plan.tier} - {plan.name}
      </h3>

      <div className={styles.recommendSection}>
        <p className={styles.label}>이런 분들에게 추천해요:</p>
        <p className={`${styles.recommendText} ${styles.indented}`}>
          {plan.recommendation}
        </p>
      </div>

      <div className={styles.featureSection}>
        <p className={styles.label}>주요 기능:</p>
        <ul className={styles.featureList}>
          {plan.features.map((feature) => (
            <li key={feature.text} className={styles.featureItem}>
              <CheckIcon className={plan.checkClass} />
              <span className={styles.featureText}>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HomePricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <p className={styles.headerLine1}>최적의 요금제로</p>
          <p className={styles.headerLine2}>
            <span className={styles.headerAccent}>RENAME DP</span>
            를 만나보세요.
          </p>
        </div>

        <div className={styles.cardsContainer}>
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
