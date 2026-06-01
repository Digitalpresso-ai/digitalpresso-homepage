'use client';

import { useMemo, useState } from 'react';
import type {
  DeviceStat,
  CountryStat,
  TopPage,
  PageDetailStat,
  ConversionData,
} from '@/lib/analytics/ga-data';
import styles from './AnalyticsTables.module.css';

type Dir = 'asc' | 'desc';

function sortArr<T extends object>(arr: T[], key: keyof T, dir: Dir): T[] {
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

function useSort<T extends object>(defaultKey: keyof T, defaultDir: Dir = 'desc') {
  const [key, setKey] = useState<keyof T>(defaultKey);
  const [dir, setDir] = useState<Dir>(defaultDir);

  function toggle(k: keyof T) {
    if (key === k) setDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setKey(k); setDir('desc'); }
  }

  function icon(k: keyof T) {
    if (key !== k) return <em className={styles.sortIcon}>↕</em>;
    return <em className={styles.sortIconActive}>{dir === 'asc' ? '↑' : '↓'}</em>;
  }

  return { key, dir, toggle, icon };
}

export function DeviceTable({ devices }: { devices: DeviceStat[] }) {
  const s = useSort<DeviceStat>('sessions');
  const rows = useMemo(() => sortArr(devices, s.key, s.dir), [devices, s.key, s.dir]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => s.toggle('device')}>기기{s.icon('device')}</th>
          <th onClick={() => s.toggle('sessions')}>세션{s.icon('sessions')}</th>
          <th onClick={() => s.toggle('users')}>사용자{s.icon('users')}</th>
          <th onClick={() => s.toggle('engagementRate')}>참여율{s.icon('engagementRate')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(d => (
          <tr key={d.device}>
            <td className={styles.boldCell}>{d.device}</td>
            <td>{d.sessions.toLocaleString()}</td>
            <td>{d.users.toLocaleString()}</td>
            <td>{d.engagementRate}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CountryTable({ countries }: { countries: CountryStat[] }) {
  const s = useSort<CountryStat>('sessions');
  const rows = useMemo(() => sortArr(countries, s.key, s.dir), [countries, s.key, s.dir]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => s.toggle('country')}>국가{s.icon('country')}</th>
          <th onClick={() => s.toggle('sessions')}>세션{s.icon('sessions')}</th>
          <th onClick={() => s.toggle('users')}>사용자{s.icon('users')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(c => (
          <tr key={c.country}>
            <td className={styles.boldCell}>{c.country}</td>
            <td>{c.sessions.toLocaleString()}</td>
            <td>{c.users.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TopPagesTable({ pages }: { pages: TopPage[] }) {
  const s = useSort<TopPage>('views');
  const rows = useMemo(() => sortArr(pages, s.key, s.dir), [pages, s.key, s.dir]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => s.toggle('path')}>경로{s.icon('path')}</th>
          <th onClick={() => s.toggle('views')}>페이지뷰{s.icon('views')}</th>
          <th onClick={() => s.toggle('bounceRate')}>이탈률{s.icon('bounceRate')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(p => (
          <tr key={p.path}>
            <td className={styles.pathCell}>{p.path}</td>
            <td>{p.views.toLocaleString()}</td>
            <td>{p.bounceRate}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function fmtSecs(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}분 ${r}초` : `${r}초`;
}

export function SortedPagesTable({
  pages,
  metric,
}: {
  pages: PageDetailStat[];
  metric: 'bounceRate' | 'engagementRate' | 'avgDuration';
}) {
  const metricKey: keyof PageDetailStat =
    metric === 'bounceRate' ? 'bounceRate' :
    metric === 'engagementRate' ? 'engagementRate' : 'avgDuration';

  const s = useSort<PageDetailStat>(metricKey);
  const rows = useMemo(() => sortArr(pages, s.key, s.dir), [pages, s.key, s.dir]);

  const metricLabel =
    metric === 'bounceRate' ? '이탈률' :
    metric === 'engagementRate' ? '참여율' : '평균 체류';

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => s.toggle('path')}>경로{s.icon('path')}</th>
          <th onClick={() => s.toggle('pageViews')}>페이지뷰{s.icon('pageViews')}</th>
          <th onClick={() => s.toggle('sessions')}>세션{s.icon('sessions')}</th>
          <th onClick={() => s.toggle(metricKey)}>{metricLabel}{s.icon(metricKey)}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(p => (
          <tr key={p.path}>
            <td className={styles.pathCell}>{p.path}</td>
            <td>{p.pageViews.toLocaleString()}</td>
            <td>{p.sessions.toLocaleString()}</td>
            <td>
              {metric === 'avgDuration'
                ? fmtSecs(p.avgDuration)
                : `${metric === 'bounceRate' ? p.bounceRate : p.engagementRate}%`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ConversionsTable({ conversions }: { conversions: ConversionData[] }) {
  const s = useSort<ConversionData>('count');
  const rows = useMemo(() => sortArr(conversions, s.key, s.dir), [conversions, s.key, s.dir]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => s.toggle('eventName')}>이벤트{s.icon('eventName')}</th>
          <th onClick={() => s.toggle('count')}>발생 횟수{s.icon('count')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(c => (
          <tr key={c.eventName}>
            <td className={styles.boldCell}>{c.eventName}</td>
            <td>{c.count.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
