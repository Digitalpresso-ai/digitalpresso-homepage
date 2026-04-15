import Link from 'next/link';
import { getArticles, getArticleStats } from '@/src/features/admin/actions/article.actions';
import {
  getOverviewMetrics,
  getPageViewsTimeline,
  getTopPages,
} from '@/lib/analytics/ga-data';
import DashboardCharts from '@/src/features/admin/components/DashboardCharts/DashboardCharts';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

async function fetchGaData() {
  try {
    const [overview, timeline, topPages] = await Promise.all([
      getOverviewMetrics(),
      getPageViewsTimeline(30),
      getTopPages(8),
    ]);
    return { overview, timeline, topPages, error: null };
  } catch (e) {
    return {
      overview: null,
      timeline: [],
      topPages: [],
      error: e instanceof Error ? e.message : 'GA 데이터를 불러오지 못했습니다.',
    };
  }
}

export default async function DashboardPage() {
  const [articleStats, articles, ga] = await Promise.all([
    getArticleStats(),
    getArticles(),
    fetchGaData(),
  ]);
  const recentArticles = articles.slice(0, 5);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <span className={styles.period}>최근 30일</span>
      </header>

      {/* GA 요약 지표 */}
      {ga.error ? (
        <div className={styles.gaError}>
          <strong>GA 연결 오류:</strong> {ga.error}
          {!process.env.GA_PROPERTY_ID && (
            <span> — <code>.env.local</code>에 <code>GA_PROPERTY_ID</code>를 추가해주세요.</span>
          )}
        </div>
      ) : ga.overview && (
        <section className={styles.statsGrid}>
          <StatCard label="세션" value={ga.overview.sessions.toLocaleString()} />
          <StatCard label="활성 사용자" value={ga.overview.users.toLocaleString()} />
          <StatCard label="페이지뷰" value={ga.overview.pageViews.toLocaleString()} />
          <StatCard label="이탈률" value={`${ga.overview.bounceRate}%`} />
          <StatCard label="전체 아티클" value={String(articleStats.total)} />
        </section>
      )}

      {/* 차트 */}
      {ga.timeline.length > 0 && (
        <DashboardCharts timeline={ga.timeline} topPages={ga.topPages} />
      )}

      {/* 최근 아티클 */}
      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>최근 아티클</h2>
          <Link href="/admin/articles/new" className={styles.newBtn}>+ 새 아티클</Link>
        </div>
        {recentArticles.length === 0 ? (
          <div className={styles.empty}>
            <p>아직 아티클이 없습니다.</p>
            <Link href="/admin/articles/new" className={styles.emptyLink}>첫 번째 아티클 작성하기 →</Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>작성일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((article) => (
                <tr key={article.id}>
                  <td className={styles.titleCell}>{article.title}</td>
                  <td className={styles.dateCell}>
                    {new Date(article.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td>
                    <Link href={`/admin/articles/${article.id}/edit`} className={styles.editLink}>
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className={`${styles.statCard} ${color === 'green' ? styles.statCard_green : styles.statCard_blue}`}>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
