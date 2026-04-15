// src/features/references/components/ReferencesElectricalSection/ReferencesElectricalSection.tsx

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import styles from './ReferencesElectricalSection.module.css';
import { YoutubeEmbed } from '../YoutubeEmbed/YoutubeEmbed';

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

// 5점 별점 — outer r=8, inner r=3.4, spacing 22px
const STAR_POINTS =
  '0,-8 1.97,-2.71 7.61,-2.47 3.27,0.97 4.7,6.47 0,3.4 -4.7,6.47 -3.27,0.97 -7.61,-2.47 -1.97,-2.71';

function StarRating({ label }: { label: string }) {
  return (
    <svg
      width="110"
      height="18"
      viewBox="0 0 110 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      className={styles.stars}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon
          key={i}
          points={STAR_POINTS}
          transform={`translate(${9 + i * 22}, 9)`}
          fill="#FBBF24"
        />
      ))}
    </svg>
  );
}

export async function ReferencesElectricalSection() {
  const t = await getTranslations('referencesPage.electrical');
  const testimonials = t.raw('testimonials') as Testimonial[];

  return (
    <section className={styles.section}>
      {/* ── 전기시공 버전: 태블릿+ 2열 (텍스트 좌 / 비디오 우) ── */}
      <div className={styles.featureRow}>
        <div className={styles.featureTextCol}>
          <div className={styles.headerGroup}>
            <div className={styles.badgeRow}>
              <Image
                src="/images/dp_logo_kor.svg"
                alt={t('logoAlt')}
                width={102}
                height={35}
                className={styles.renameLogo}
              />
              <span className={styles.eyebrow}>{t('eyebrow')}</span>
            </div>
            <h2 className={styles.heading}>
              {t('headingLine1')}
              <br />
              {t('headingLine2')}
            </h2>
          </div>
          <p className={styles.body}>{t('body')}</p>
        </div>

        <div className={styles.videoWrapper}>
          <YoutubeEmbed videoId="rKuLBoQXQEw" title={t('videoTitle')} />
        </div>
      </div>

      {/* ── Our Partners 후기 (단일 열, 좌측 정렬) ── */}
      <div className={styles.partnersContainer}>
        <div className={styles.partnersHeader}>
          <span className={styles.partnersEyebrow}>{t('partnersEyebrow')}</span>
          <h2 className={styles.partnersHeading}>{t('partnersHeading')}</h2>
        </div>

        <ul className={styles.cardList}>
          {testimonials.map((item, idx) => (
            <li key={idx} className={styles.card}>
              <div className={styles.cardContent}>
                <StarRating label={t('ratingAria')} />
                <p className={styles.cardText}>{item.text}</p>
              </div>
              <div className={styles.cardCustomer}>
                <span className={styles.cardAuthor}>{item.author}</span>
                <span className={styles.cardRole}>{item.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
