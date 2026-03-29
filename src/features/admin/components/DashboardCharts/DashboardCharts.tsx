'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import styles from './DashboardCharts.module.css';

interface TimelinePoint { date: string; views: number }
interface TopPage { path: string; views: number; bounceRate: number }

interface Props {
  timeline: TimelinePoint[];
  topPages: TopPage[];
}

function formatDate(raw: string) {
  // raw: "20240101" → "1/1"
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  return `${parseInt(m)}/${parseInt(d)}`;
}

export default function DashboardCharts({ timeline, topPages }: Props) {
  const chartData = timeline.map((d) => ({ ...d, date: formatDate(d.date) }));
  const barData = topPages.slice(0, 8).map((p) => ({
    path: p.path.length > 28 ? p.path.slice(0, 28) + '…' : p.path,
    views: p.views,
  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>페이지뷰 추이 (최근 30일)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a0aec0' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#a0aec0' }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              formatter={(v) => [(v as number).toLocaleString(), '페이지뷰']}
            />
            <Line
              type="monotone" dataKey="views"
              stroke="#193cb8" strokeWidth={2}
              dot={false} activeDot={{ r: 4 }}
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
