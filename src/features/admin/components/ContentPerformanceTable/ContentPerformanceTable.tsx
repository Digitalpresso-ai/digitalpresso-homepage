'use client';

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { ContentItem } from '@/lib/analytics/ga-data';
import type { ArticleEntity } from '@/backend/article/domain/entities/ArticleEntity';
import styles from './ContentPerformanceTable.module.css';

interface Props {
  items: ContentItem[];
  articles: ArticleEntity[];
}

type Enriched = ContentItem & { title: string };
type SortKey = keyof Enriched;

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

function sortEnriched(arr: Enriched[], key: SortKey, dir: 'asc' | 'desc'): Enriched[] {
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

export default function ContentPerformanceTable({ items, articles }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const byId = new Map(articles.map(a => [a.id, a]));

  const rawEnriched = useMemo<Enriched[]>(() =>
    items
      .filter(item => item.articleId !== null)
      .map(item => ({
        ...item,
        title: byId.get(item.articleId!)?.title ?? item.path,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, articles],
  );

  const sorted = useMemo(
    () => sortEnriched(rawEnriched, sortKey, sortDir),
    [rawEnriched, sortKey, sortDir],
  );

  const chartData = rawEnriched.map(item => ({
    title: item.title.length > 20 ? item.title.slice(0, 20) + '…' : item.title,
    views: item.views,
  }));
  const chartHeight = Math.max(260, chartData.length * 36);

  function toggle(key: SortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function icon(key: SortKey) {
    if (sortKey !== key) return <em className={styles.sortIcon}>↕</em>;
    return <em className={styles.sortIconActive}>{sortDir === 'asc' ? '↑' : '↓'}</em>;
  }

  if (rawEnriched.length === 0) {
    return <p className={styles.empty}>아직 아티클 조회 데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>아티클 조회수</h3>
        <p className={styles.note}>선택 기간 내 GA에서 조회수가 집계된 아티클만 표시됩니다.</p>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#a0aec0' }} />
            <YAxis type="category" dataKey="title" tick={{ fontSize: 10, fill: '#718096' }} width={150} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              formatter={(v) => [(v as number).toLocaleString(), '조회수']}
            />
            <Bar dataKey="views" fill="#193cb8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>아티클 상세 성과</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sortableTh} onClick={() => toggle('title')}>아티클{icon('title')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('views')}>조회수{icon('views')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('avgDuration')}>평균 체류{icon('avgDuration')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('bounceRate')}>이탈률{icon('bounceRate')}</th>
              <th className={styles.sortableTh} onClick={() => toggle('activeUsers')}>방문자{icon('activeUsers')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => (
              <tr key={item.path}>
                <td className={styles.titleCell}>
                  {item.articleId ? (
                    <a
                      href={`/news/article/${item.articleId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.titleLink}
                    >
                      {item.title}
                    </a>
                  ) : item.title}
                </td>
                <td>{item.views.toLocaleString()}</td>
                <td>{fmtDuration(item.avgDuration)}</td>
                <td>{item.bounceRate}%</td>
                <td>{item.activeUsers.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
