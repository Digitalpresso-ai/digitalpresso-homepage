// src/features/about/components/AboutTeam/AboutTeam.tsx

import styles from './AboutTeam.module.css';

const DIVISIONS = [
  {
    name: 'CEO Division',
    departments: [
      {
        title: 'Management',
        items: [
          '전략 수립 및 전반적인 운영 감독',
          '회사 비전과 목표 설정',
          '주요 경영 지표 분석 및 관리',
          '성과 평가와 개선 방향 제시',
        ],
      },
      {
        title: 'Sales',
        items: [
          '판매 전략 수립 및 실행',
          '고객 관리 및 신규 고객 발굴',
          '매출 목표 설정 및 성과 추적',
          '시장 및 경쟁 분석을 통한 기회 발굴',
        ],
      },
      {
        title: 'CX·CS·Marketing',
        items: [
          '고객 경험(CX) 설계 및 접점 최적화',
          '고객 서비스(CS) 품질 관리',
          '마케팅 전략 기획 및 실행',
          '데이터 기반 성과 분석 및 최적화',
        ],
      },
    ],
  },
  {
    name: 'CAIO Division',
    className: 'caio',
    departments: [
      {
        title: 'Dev',
        mobileOrder: 3,
        items: [
          '소프트웨어 및 시스템 개발',
          '코드 작성, 테스트 및 디버깅',
          '기술 요구 사항 분석 및 해결책 제시',
          '최적화된 성능을 위한 시스템 개선',
        ],
      },
      {
        title: 'R&D',
        mobileOrder: 1,
        items: [
          '신기술 연구 및 도입',
          '제품 및 서비스 혁신을 위한 실험과 개발',
          '시장 요구에 맞춘 신제품 프로토타입 제작',
          'AI 및 최신 기술 동향 분석 및 적용',
        ],
      },
      {
        title: 'BX·UX·UI Design',
        mobileOrder: 2,
        items: [
          '브랜드 경험 설계 및 일관성 유지',
          '인터페이스 디자인 가이드 관리',
          '사용자 여정 기반 서비스 경험 개발',
          '인사이트 기반 디자인 최적화',
        ],
      },
    ],
  },
] as const;

export function AboutTeam() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Our Team</h2>

        {DIVISIONS.map((division) => (
          <div key={division.name} className={styles.division}>
            <div className={styles.divisionLabel}>{division.name}</div>
            <div className={styles.departments}>
              {division.departments.map((dept) => (
                <div
                  key={dept.title}
                  className={styles.department}
                  style={
                    'mobileOrder' in dept
                      ? ({ '--mobile-order': dept.mobileOrder } as React.CSSProperties)
                      : undefined
                  }
                >
                  <h3 className={styles.deptTitle}>{dept.title}</h3>
                  <ul className={styles.deptList}>
                    {dept.items.map((item) => (
                      <li key={item} className={styles.deptItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
