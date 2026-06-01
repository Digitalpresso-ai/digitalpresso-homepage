'use client';

import { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { LocaleStat } from '@/lib/analytics/ga-data';
import styles from './LocaleBreakdown.module.css';

interface Props { data: LocaleStat[] }

type LocaleWithShare = LocaleStat & { share: number };
type SortKey = keyof LocaleWithShare;

const LOCALE_LABELS: Record<string, string> = { ko: '한국어', en: 'English', ja: '日本語' };
const COLORS = ['#193cb8', '#2b7fff', '#63b3ed'];

function sortData(arr: LocaleWithShare[], key: SortKey, dir: 'asc' | 'desc'): LocaleWithShare[] {
  return [...arr].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'number' && typeof bv === 'number') {
      return dir === 'asc' ? av - bv : bv - av;
    }
    return dir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}

export default function LocaleBreakdown({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('sessions');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [enriched, total] = useMemo(() => {
    const t = data.reduce((s, d) => s + d.sessions, 0);
    return [
      data.map(d => ({ ...d, share: t > 0 ? Math.round((d.sessions / t) * 100) : 0 })),
      t,
    ] as const;
  }, [data]);

  const sorted = useMemo(
    () => sortData(enriched, sortKey, sortDir),
    [enriched, sortKey, sortDir],
  );

  function toggle(key: SortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function icon(key: SortKey) {
    if (sortKey !== key) return <em className={styles.sortIcon}>↕</em>;
    return <em className={styles.sortIconActive}>{sortDir === 'asc' ? '↑' : '↓'}</em>;
  }

  if (total === 0) {
    return <p className={styles.empty}>다국어 데이터가 없습니다.</p>;
  }

  const pieData = enriched
    .filter(d => d.sessions > 0)
    .map(d => ({ name: LOCALE_LABELS[d.locale], value: d.sessions }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>언어별 세션 비중</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              formatter={(v) => [(v as number).toLocaleString(), '세션']}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ fontSize: '0.8125rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>언어별 상세 지표</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sortableTh} onClick={() => toggle('locale')}>언어{icon('locale')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('sessions')}>세션{icon('sessions')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('users')}>사용자{icon('users')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('pageViews')}>페이지뷰{icon('pageViews')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('bounceRate')}>이탈률{icon('bounceRate')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('share')}>비중{icon('share')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(d => (
              <tr key={d.locale}>
                <td className={styles.localeCell}>{LOCALE_LABELS[d.locale]}</td>
                <td>{d.sessions.toLocaleString()}</td>
                <td>{d.users.toLocaleString()}</td>
                <td>{d.pageViews.toLocaleString()}</td>
                <td>{d.bounceRate}%</td>
                <td>
                  <span className={styles.badge}>{d.share}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
