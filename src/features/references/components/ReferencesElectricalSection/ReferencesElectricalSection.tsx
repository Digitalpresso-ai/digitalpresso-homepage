// src/features/references/components/ReferencesElectricalSection/ReferencesElectricalSection.tsx

import Image from 'next/image';
import styles from './ReferencesElectricalSection.module.css';
import { YoutubeEmbed } from '../YoutubeEmbed/YoutubeEmbed';

const TESTIMONIALS = [
  {
    text: '시제품을 통해 실시간 시공 데이터 수집이 원활하게 이루어졌고, 현장에서 필요로 하는 기능고도화에 대한 대응이 빠르게 이루어져 관리가 훨씬 수월해졌습니다.',
    author: 'H 전기감리사',
    role: '데이터 검수, 42세',
  },
  {
    text: '도입 후 프로젝트 일정 관리가 개선되었고, 사용자 피드백을 반영한 빠른 고도화 작업 덕분에 실무에 바로 적용할 수 있었습니다. 원청에서 시도때도 없이 제출하라는 하드카피 문서에 들어가는 업무 리소스가 거의 사라졌습니다.',
    author: '전기시공사H',
    role: '현장 매니저, 38세',
  },
  {
    text: '시공 과정의 데이터를 쉽게 시각화하여 프로젝트 상태를 한눈에 파악할 수 있어 업무 효율이 높아졌습니다. 게다가 추가 기능 요청에 대한 대응 속도도 빨라서 매우 만족스러웠습니다.',
    author: '제조업 S사',
    role: '대표이사, 61세',
  },
  {
    text: '시제품으로 재고 관리 자동화를 경험해봤는데, 필요한 기능 고도화도 빠르게 반영되어 실제 운영에 큰 도움이 되었습니다. 향후 확장성에도 기대가 큽니다.',
    author: 'N유업',
    role: '물류팀장, 43세',
  },
];

// 5점 별점 — outer r=8, inner r=3.4, spacing 22px
const STAR_POINTS =
  '0,-8 1.97,-2.71 7.61,-2.47 3.27,0.97 4.7,6.47 0,3.4 -4.7,6.47 -3.27,0.97 -7.61,-2.47 -1.97,-2.71';

function StarRating() {
  return (
    <svg
      width="110"
      height="18"
      viewBox="0 0 110 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="별점 5점"
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

export function ReferencesElectricalSection() {
  return (
    <section className={styles.section}>
      {/* ── 전기시공 버전: 태블릿+ 2열 (텍스트 좌 / 비디오 우) ── */}
      <div className={styles.featureRow}>
        <div className={styles.featureTextCol}>
          <div className={styles.headerGroup}>
            <div className={styles.badgeRow}>
              <Image
                src="/images/dp_logo_kor.svg"
                alt="리네임 DP"
                width={102}
                height={35}
                className={styles.renameLogo}
              />
              <span className={styles.eyebrow}>전기시공 버전</span>
            </div>
            <h2 className={styles.heading}>
              전산화 번호 추출로
              <br />
              전기 시공 기록 자동화
            </h2>
          </div>
          <p className={styles.body}>
            수기 입력 없이 빠르고 정확한 데이터 후처리를 통해 전기시공 업무를
            효율적으로 지원하는 맞춤형 솔루션입니다.
          </p>
        </div>

        <div className={styles.videoWrapper}>
          <YoutubeEmbed videoId="rKuLBoQXQEw" title="Rename DP 전기시공 버전 소개" />
        </div>
      </div>

      {/* ── Our Partners 후기 (단일 열, 좌측 정렬) ── */}
      <div className={styles.partnersContainer}>
        <div className={styles.partnersHeader}>
          <span className={styles.partnersEyebrow}>Our Partners</span>
          <h2 className={styles.partnersHeading}>
            긍정적인 고객의 평가를 확인해보세요.
          </h2>
        </div>

        <ul className={styles.cardList}>
          {TESTIMONIALS.map((t, idx) => (
            <li key={idx} className={styles.card}>
              <div className={styles.cardContent}>
                <StarRating />
                <p className={styles.cardText}>{t.text}</p>
              </div>
              <div className={styles.cardCustomer}>
                <span className={styles.cardAuthor}>{t.author}</span>
                <span className={styles.cardRole}>{t.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
