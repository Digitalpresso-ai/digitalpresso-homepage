'use client';

import { useRouter } from 'next/navigation';
import DateRangePicker from '@/src/features/admin/components/DateRangePicker/DateRangePicker';
import styles from './DashboardTabs.module.css';

const TABS = [
  { key: 'overview', label: '개요' },
  { key: 'content',  label: '콘텐츠' },
  { key: 'locale',   label: '다국어' },
  { key: 'traffic',  label: '유입' },
] as const;

interface Props {
  activeTab: string;
  from: string;
  to: string;
}

export default function DashboardTabs({ activeTab, from, to }: Props) {
  const router = useRouter();

  function goTab(tab: string) {
    router.push(`/admin/dashboard?tab=${tab}&from=${from}&to=${to}`);
  }

  function onDateChange(f: string, t: string) {
    router.push(`/admin/dashboard?tab=${activeTab}&from=${f}&to=${t}`);
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabs} aria-label="대시보드 탭">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
            onClick={() => goTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <DateRangePicker from={from} to={to} onChange={onDateChange} />
    </div>
  );
}
