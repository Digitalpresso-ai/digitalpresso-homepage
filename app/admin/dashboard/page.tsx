import Link from 'next/link';
import {
  getPublishedArticles,
  getArticleStats,
} from '@/backend/article/application/server-facade';
import { parseDateRange, formatKo } from '@/lib/analytics/date-utils';
import {
  getOverviewMetrics,
  getTimeSeries,
  getTopPages,
  getContentPerformance,
  getLocaleBreakdown,
  getTrafficAcquisition,
  getTopSources,
  getConversions,
} from '@/lib/analytics/ga-data';
import DashboardTabs from '@/src/features/admin/components/DashboardTabs/DashboardTabs';
import StatCard from '@/src/features/admin/components/StatCard/StatCard';
import DashboardCharts from '@/src/features/admin/components/DashboardCharts/DashboardCharts';
import ContentPerformanceTable from '@/src/features/admin/components/ContentPerformanceTable/ContentPerformanceTable';
import LocaleBreakdown from '@/src/features/admin/components/LocaleBreakdown/LocaleBreakdown';
import TrafficAcquisition from '@/src/features/admin/components/TrafficAcquisition/TrafficAcquisition';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

async function safeGA<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

function calcDelta(current: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((current - prev) / prev) * 100;
}

function fmtSeconds(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; from?: string; to?: string }>;
}) {
  const { tab: tabParam = 'overview', from: fromParam, to: toParam } = await searchParams;
  const activeTab = ['overview', 'content', 'locale', 'traffic'].includes(tabParam) ? tabParam : 'overview';
  const { from, to } = parseDateRange(fromParam, toParam);

  let gaError: string | null = null;

  /* ─── Overview ─── */
  let overviewData: Awaited<ReturnType<typeof getOverviewMetrics>> | null = null;
  let timeline: Awaited<ReturnType<typeof getTimeSeries>> = [];
  let topPages: Awaited<ReturnType<typeof getTopPages>> = [];
  let conversions: Awaited<ReturnType<typeof getConversions>> = [];
  let articleStats = { total: 0 };

  /* ─── Content ─── */
  let contentItems: Awaited<ReturnType<typeof getContentPerformance>> = [];
  let allArticles: Awaited<ReturnType<typeof getPublishedArticles>> = [];

  /* ─── Locale ─── */
  let localeData: Awaited<ReturnType<typeof getLocaleBreakdown>> = [];

  /* ─── Traffic ─── */
  let channels: Awaited<ReturnType<typeof getTrafficAcquisition>> = [];
  let sources: Awaited<ReturnType<typeof getTopSources>> = [];

  if (activeTab === 'overview') {
    const [ov, tl, tp, conv, stats] = await Promise.all([
      safeGA(() => getOverviewMetrics(from, to)),
      safeGA(() => getTimeSeries(from, to)),
      safeGA(() => getTopPages(8, from, to)),
      safeGA(() => getConversions(from, to)),
      getArticleStats().catch(() => ({ total: 0 })),
    ]);
    overviewData = ov;
    timeline     = tl ?? [];
    topPages     = tp ?? [];
    conversions  = conv ?? [];
    articleStats = stats;
    if (!ov) gaError = 'GA 연결 오류';
  } else if (activeTab === 'content') {
    const [ci, arts] = await Promise.all([
      safeGA(() => getContentPerformance(from, to)),
      getPublishedArticles().catch(() => []),
    ]);
    contentItems = ci ?? [];
    allArticles  = arts;
  } else if (activeTab === 'locale') {
    const ld = await safeGA(() => getLocaleBreakdown(from, to));
    localeData = ld ?? [];
    if (!ld) gaError = 'GA 연결 오류';
  } else if (activeTab === 'traffic') {
    const [ch, sr] = await Promise.all([
      safeGA(() => getTrafficAcquisition(from, to)),
      safeGA(() => getTopSources(from, to)),
    ]);
    channels = ch ?? [];
    sources  = sr ?? [];
    if (!ch) gaError = 'GA 연결 오류';
  }

  const totalConversions = conversions.reduce((s, c) => s + c.count, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <span className={styles.period}>{formatKo(from)} ~ {formatKo(to)}</span>
      </header>

      <DashboardTabs activeTab={activeTab} from={from} to={to} />

      {gaError && (
        <div className={styles.gaError}>
          <strong>GA 연결 오류:</strong> {gaError}
          {!process.env.GA_PROPERTY_ID && (
            <span> — <code>.env.local</code>에 <code>GA_PROPERTY_ID</code>를 추가해주세요.</span>
          )}
        </div>
      )}

      {/* ── 개요 탭 ── */}
      {activeTab === 'overview' && overviewData && (
        <>
          <section className={styles.statsGrid}>
            <StatCard
              label="세션"
              value={overviewData.sessions.toLocaleString()}
              delta={calcDelta(overviewData.sessions, overviewData.prev.sessions)}
              href={`/admin/analytics?metric=sessions&from=${from}&to=${to}`}
            />
            <StatCard
              label="활성 사용자"
              value={overviewData.users.toLocaleString()}
              delta={calcDelta(overviewData.users, overviewData.prev.users)}
              href={`/admin/analytics?metric=users&from=${from}&to=${to}`}
            />
            <StatCard
              label="페이지뷰"
              value={overviewData.pageViews.toLocaleString()}
              delta={calcDelta(overviewData.pageViews, overviewData.prev.pageViews)}
              href={`/admin/analytics?metric=pageViews&from=${from}&to=${to}`}
            />
            <StatCard
              label="이탈률"
              value={`${overviewData.bounceRate}%`}
              delta={calcDelta(overviewData.bounceRate, overviewData.prev.bounceRate)}
              lowerIsBetter
              href={`/admin/analytics?metric=bounceRate&from=${from}&to=${to}`}
            />
            <StatCard
              label="참여율"
              value={`${overviewData.engagementRate}%`}
              color="green"
              href={`/admin/analytics?metric=engagementRate&from=${from}&to=${to}`}
            />
            <StatCard
              label="평균 체류"
              value={fmtSeconds(overviewData.avgSessionDuration)}
              color="gray"
              href={`/admin/analytics?metric=avgDuration&from=${from}&to=${to}`}
            />
            <StatCard
              label="신규 사용자"
              value={overviewData.newUsers.toLocaleString()}
              color="green"
              href={`/admin/analytics?metric=newUsers&from=${from}&to=${to}`}
            />
            <StatCard
              label="전환"
              value={totalConversions.toLocaleString()}
              color="green"
              href={`/admin/analytics?metric=conversions&from=${from}&to=${to}`}
            />
            <StatCard
              label="전체 아티클"
              value={String(articleStats.total)}
              color="gray"
              href="/admin/articles"
            />
          </section>

          {timeline.length > 0 && (
            <DashboardCharts timeline={timeline} topPages={topPages} />
          )}

          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최근 아티클</h2>
              <Link href="/admin/articles/new" className={styles.newBtn}>+ 새 아티클</Link>
            </div>
            <RecentArticleTable />
          </section>
        </>
      )}

      {/* ── 콘텐츠 탭 ── */}
      {activeTab === 'content' && (
        <ContentPerformanceTable items={contentItems} articles={allArticles} />
      )}

      {/* ── 다국어 탭 ── */}
      {activeTab === 'locale' && !gaError && (
        <LocaleBreakdown data={localeData} />
      )}

      {/* ── 유입 탭 ── */}
      {activeTab === 'traffic' && !gaError && (
        <TrafficAcquisition channels={channels} sources={sources} />
      )}
    </div>
  );
}

async function RecentArticleTable() {
  const articles = await getPublishedArticles().catch(() => []);
  const recent = articles.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className={styles.empty}>
        <p>아직 아티클이 없습니다.</p>
        <Link href="/admin/articles/new" className={styles.emptyLink}>첫 번째 아티클 작성하기 →</Link>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>제목</th>
          <th>작성일</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {recent.map(article => (
          <tr key={article.id} className={styles.clickableRow}>
            <td className={styles.titleCell}>
              <Link href={`/news/article/${article.id}`} className={styles.rowLink} aria-label={article.title} target="_blank" rel="noopener noreferrer" />
              {article.title}
            </td>
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
  );
}
