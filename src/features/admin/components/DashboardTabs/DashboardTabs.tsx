'use client';

import { useRouter } from 'next/navigation';
import styles from './DashboardTabs.module.css';

const TABS = [
  { key: 'overview', label: '개요' },
  { key: 'content',  label: '콘텐츠' },
  { key: 'locale',   label: '다국어' },
  { key: 'traffic',  label: '유입' },
] as const;

const RANGES = [7, 30, 90] as const;

interface Props {
  activeTab: string;
  activeRange: number;
}

export default function DashboardTabs({ activeTab, activeRange }: Props) {
  const router = useRouter();

  function go(tab: string, range: number) {
    router.push(`/admin/dashboard?tab=${tab}&range=${range}`);
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabs} aria-label="대시보드 탭">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
            onClick={() => go(t.key, activeRange)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.ranges}>
        {RANGES.map(r => (
          <button
            key={r}
            type="button"
            className={`${styles.rangeBtn} ${activeRange === r ? styles.rangeBtnActive : ''}`}
            onClick={() => go(activeTab, r)}
          >
            {r}일
          </button>
        ))}
      </div>
    </div>
  );
}
