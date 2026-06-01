'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { LocaleStat } from '@/lib/analytics/ga-data';
import styles from './LocaleBreakdown.module.css';

interface Props { data: LocaleStat[] }

const LOCALE_LABELS: Record<string, string> = { ko: '한국어', en: 'English', ja: '日本語' };
const COLORS = ['#193cb8', '#2b7fff', '#63b3ed'];

export default function LocaleBreakdown({ data }: Props) {
  const total = data.reduce((s, d) => s + d.sessions, 0);

  const pieData = data
    .filter(d => d.sessions > 0)
    .map(d => ({ name: LOCALE_LABELS[d.locale], value: d.sessions }));

  if (total === 0) {
    return <p className={styles.empty}>다국어 데이터가 없습니다.</p>;
  }

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
              <th>언어</th>
              <th>세션</th>
              <th>사용자</th>
              <th>페이지뷰</th>
              <th>이탈률</th>
              <th>비중</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.locale}>
                <td className={styles.localeCell}>{LOCALE_LABELS[d.locale]}</td>
                <td>{d.sessions.toLocaleString()}</td>
                <td>{d.users.toLocaleString()}</td>
                <td>{d.pageViews.toLocaleString()}</td>
                <td>{d.bounceRate}%</td>
                <td>
                  <span className={styles.badge}>
                    {total > 0 ? Math.round((d.sessions / total) * 100) : 0}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
