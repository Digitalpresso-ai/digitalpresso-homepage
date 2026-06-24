import Link from 'next/link';
import {
  getAdminArticles,
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

/**
 * GA 호출을 감싸 "진짜 실패"와 "데이터 없음"을 구분한다.
 * - ok: false  → API 호출 자체가 실패 (권한/네트워크/설정 오류) → 빨간 연결 오류
 * - ok: true   → 호출 성공 (data가 비어 있어도 정상. 새 속성이라 데이터가 0일 뿐)
 */
async function safeGA<T>(fn: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    return { ok: true, data: await fn() };
  } catch {
    return { ok: false };
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
  let gaEmpty = false;

  /* ─── Overview ─── */
  let overviewData: Awaited<ReturnType<typeof getOverviewMetrics>> | null = null;
  let timeline: Awaited<ReturnType<typeof getTimeSeries>> = [];
  let topPages: Awaited<ReturnType<typeof getTopPages>> = [];
  let conversions: Awaited<ReturnType<typeof getConversions>> = [];
  let articleStats = { total: 0 };

  /* ─── Content ─── */
  let contentItems: Awaited<ReturnType<typeof getContentPerformance>> = [];
  let allArticles: Awaited<ReturnType<typeof getAdminArticles>> = [];

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
    overviewData = ov.ok ? ov.data : null;
    timeline     = tl.ok ? tl.data : [];
    topPages     = tp.ok ? tp.data : [];
    conversions  = conv.ok ? conv.data : [];
    articleStats = stats;
    if (!ov.ok) gaError = 'GA 연결 오류';
    else if (overviewData && overviewData.sessions === 0 && overviewData.pageViews === 0) gaEmpty = true;
  } else if (activeTab === 'content') {
    const [ci, arts] = await Promise.all([
      safeGA(() => getContentPerformance(from, to)),
      getAdminArticles().catch(() => []),
    ]);
    contentItems = ci.ok ? ci.data : [];
    allArticles  = arts;
    if (!ci.ok) gaError = 'GA 연결 오류';
    else if (contentItems.length === 0) gaEmpty = true;
  } else if (activeTab === 'locale') {
    const ld = await safeGA(() => getLocaleBreakdown(from, to));
    localeData = ld.ok ? ld.data : [];
    if (!ld.ok) gaError = 'GA 연결 오류';
    else if (localeData.every(l => l.sessions === 0 && l.pageViews === 0)) gaEmpty = true;
  } else if (activeTab === 'traffic') {
    const [ch, sr] = await Promise.all([
      safeGA(() => getTrafficAcquisition(from, to)),
      safeGA(() => getTopSources(from, to)),
    ]);
    channels = ch.ok ? ch.data : [];
    sources  = sr.ok ? sr.data : [];
    if (!ch.ok) gaError = 'GA 연결 오류';
    else if (channels.length === 0) gaEmpty = true;
  }

  const totalConversions = conversions.reduce((s, c) => s + c.count, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <span className={styles.period}>{formatKo(from)} ~ {formatKo(to)}</span>
      </header>

      <DashboardTabs activeTab={activeTab} from={from} to={to} />

      {gaError ? (
        <div className={styles.gaError}>
          <strong>GA 연결 오류:</strong> {gaError}
          {!process.env.GA_PROPERTY_ID && (
            <span> — <code>.env.local</code>에 <code>GA_PROPERTY_ID</code>를 추가해주세요.</span>
          )}
        </div>
      ) : gaEmpty ? (
        <div className={styles.gaEmpty}>
          이 기간에는 아직 수집된 데이터가 없습니다. 새 GA 속성으로 전환한 직후라 데이터가
          쌓이기까지 하루 정도 걸릴 수 있어요.
        </div>
      ) : null}

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
  const articles = await getAdminArticles().catch(() => []);
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
