'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TrafficChannel, TopSource } from '@/lib/analytics/ga-data';
import styles from './TrafficAcquisition.module.css';

interface Props {
  channels: TrafficChannel[];
  sources: TopSource[];
}

export default function TrafficAcquisition({ channels, sources }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>채널별 세션</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={channels} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#a0aec0' }} />
            <YAxis
              type="category"
              dataKey="channel"
              tick={{ fontSize: 10, fill: '#718096' }}
              width={120}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              formatter={(v) => [(v as number).toLocaleString(), '세션']}
            />
            <Bar dataKey="sessions" fill="#2b7fff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>채널 상세</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>채널</th>
              <th>세션</th>
              <th>사용자</th>
              <th>참여율</th>
            </tr>
          </thead>
          <tbody>
            {channels.map(c => (
              <tr key={c.channel}>
                <td className={styles.channelCell}>{c.channel}</td>
                <td>{c.sessions.toLocaleString()}</td>
                <td>{c.users.toLocaleString()}</td>
                <td>{c.engagementRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`${styles.card} ${styles.fullWidth}`}>
        <h3 className={styles.cardTitle}>상위 유입 소스/미디엄</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>소스</th>
              <th>미디엄</th>
              <th>세션</th>
              <th>사용자</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={i}>
                <td className={styles.channelCell}>{s.source}</td>
                <td>{s.medium}</td>
                <td>{s.sessions.toLocaleString()}</td>
                <td>{s.users.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
