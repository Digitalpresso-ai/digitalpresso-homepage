'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import type { TimelinePoint, TopPage } from '@/lib/analytics/ga-data';
import styles from './DashboardCharts.module.css';

interface Props {
  timeline: TimelinePoint[];
  topPages: TopPage[];
}

type Metric = 'views' | 'sessions' | 'users';

const METRIC_OPTIONS: { key: Metric; label: string }[] = [
  { key: 'views',    label: '페이지뷰' },
  { key: 'sessions', label: '세션' },
  { key: 'users',    label: '사용자' },
];

function formatDate(raw: string) {
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  return `${parseInt(m)}/${parseInt(d)}`;
}

export default function DashboardCharts({ timeline, topPages }: Props) {
  const [metric, setMetric] = useState<Metric>('views');

  const chartData = timeline.map(d => ({
    date: formatDate(d.date),
    views: d.views,
    sessions: d.sessions,
    users: d.users,
  }));

  const barData = topPages.slice(0, 8).map(p => ({
    path: p.path.length > 28 ? p.path.slice(0, 28) + '…' : p.path,
    views: p.views,
  }));

  const activeLabel = METRIC_OPTIONS.find(m => m.key === metric)!.label;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>추이 (최근 기간)</h3>
          <div className={styles.metricToggle}>
            {METRIC_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                className={`${styles.metricBtn} ${metric === opt.key ? styles.metricBtnActive : ''}`}
                onClick={() => setMetric(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a0aec0' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#a0aec0' }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              formatter={(v) => [(v as number).toLocaleString(), activeLabel]}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#193cb8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>상위 페이지 (30일 기준)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#a0aec0' }} />
            <YAxis type="category" dataKey="path" tick={{ fontSize: 10, fill: '#718096' }} width={140} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              formatter={(v) => [(v as number).toLocaleString(), '페이지뷰']}
            />
            <Bar dataKey="views" fill="#2b7fff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
