'use client';

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

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

export default function ContentPerformanceTable({ items, articles }: Props) {
  const byId = new Map(articles.map(a => [a.id, a]));

  const enriched = items
    .filter(item => item.articleId !== null)
    .map(item => ({
      ...item,
      title: byId.get(item.articleId!)?.title ?? item.path,
    }));

  const chartData = enriched.slice(0, 8).map(item => ({
    title: item.title.length > 20 ? item.title.slice(0, 20) + '…' : item.title,
    views: item.views,
  }));

  if (enriched.length === 0) {
    return <p className={styles.empty}>아직 아티클 조회 데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>아티클 조회수 Top {chartData.length}</h3>
        <ResponsiveContainer width="100%" height={260}>
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
              <th>아티클</th>
              <th>조회수</th>
              <th>평균 체류</th>
              <th>이탈률</th>
              <th>방문자</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(item => (
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
