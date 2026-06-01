'use client';

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TrafficChannel, TopSource } from '@/lib/analytics/ga-data';
import styles from './TrafficAcquisition.module.css';

interface Props {
  channels: TrafficChannel[];
  sources: TopSource[];
}

function sortArr<T extends object>(arr: T[], key: keyof T, dir: 'asc' | 'desc'): T[] {
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

export default function TrafficAcquisition({ channels, sources }: Props) {
  const [chKey, setChKey] = useState<keyof TrafficChannel>('sessions');
  const [chDir, setChDir] = useState<'asc' | 'desc'>('desc');
  const [srcKey, setSrcKey] = useState<keyof TopSource>('sessions');
  const [srcDir, setSrcDir] = useState<'asc' | 'desc'>('desc');

  const sortedChannels = useMemo(() => sortArr(channels, chKey, chDir), [channels, chKey, chDir]);
  const sortedSources  = useMemo(() => sortArr(sources, srcKey, srcDir), [sources, srcKey, srcDir]);

  function toggleCh(key: keyof TrafficChannel) {
    if (chKey === key) setChDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setChKey(key); setChDir('desc'); }
  }

  function toggleSrc(key: keyof TopSource) {
    if (srcKey === key) setSrcDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSrcKey(key); setSrcDir('desc'); }
  }

  function chIcon(key: keyof TrafficChannel) {
    if (chKey !== key) return <em className={styles.sortIcon}>↕</em>;
    return <em className={styles.sortIconActive}>{chDir === 'asc' ? '↑' : '↓'}</em>;
  }

  function srcIcon(key: keyof TopSource) {
    if (srcKey !== key) return <em className={styles.sortIcon}>↕</em>;
    return <em className={styles.sortIconActive}>{srcDir === 'asc' ? '↑' : '↓'}</em>;
  }

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
              <th className={styles.sortableTh} onClick={() => toggleCh('channel')}>채널{chIcon('channel')}</th>
              <th className={styles.sortableTh} onClick={() => toggleCh('sessions')}>세션{chIcon('sessions')}</th>
              <th className={styles.sortableTh} onClick={() => toggleCh('users')}>사용자{chIcon('users')}</th>
              <th className={styles.sortableTh} onClick={() => toggleCh('engagementRate')}>참여율{chIcon('engagementRate')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedChannels.map(c => (
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
              <th className={styles.sortableTh} onClick={() => toggleSrc('source')}>소스{srcIcon('source')}</th>
              <th className={styles.sortableTh} onClick={() => toggleSrc('medium')}>미디엄{srcIcon('medium')}</th>
              <th className={styles.sortableTh} onClick={() => toggleSrc('sessions')}>세션{srcIcon('sessions')}</th>
              <th className={styles.sortableTh} onClick={() => toggleSrc('users')}>사용자{srcIcon('users')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedSources.map((s, i) => (
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
