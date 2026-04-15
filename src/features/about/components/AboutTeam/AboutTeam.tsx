// src/features/about/components/AboutTeam/AboutTeam.tsx

import { getTranslations } from 'next-intl/server';
import styles from './AboutTeam.module.css';

interface AboutTeamDepartment {
  title: string;
  items: string[];
  mobileOrder?: number;
}

interface AboutTeamDivision {
  name: string;
  departments: AboutTeamDepartment[];
}

export async function AboutTeam() {
  const t = await getTranslations('aboutPage.team');
  const divisions = t.raw('divisions') as AboutTeamDivision[];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t('title')}</h2>

        {divisions.map((division) => (
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
