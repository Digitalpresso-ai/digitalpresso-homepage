import Link from 'next/link';
import {
  getTimeSeries,
  getDeviceBreakdown,
  getCountryBreakdown,
  getTopPages,
  getPageDetails,
  getConversions,
  type PageSortMetric,
} from '@/lib/analytics/ga-data';
import { parseDateRange, formatKo } from '@/lib/analytics/date-utils';
import AnalyticsTrendChart from '@/src/features/admin/components/AnalyticsTrendChart/AnalyticsTrendChart';
import {
  DeviceTable,
  CountryTable,
  TopPagesTable,
  SortedPagesTable,
  ConversionsTable,
} from './TableClients';
import AnalyticsRanges from './AnalyticsRanges';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const METRIC_META: Record<string, { title: string; subtitle: string }> = {
  sessions:       { title: '세션',         subtitle: '방문자가 사이트에서 시작한 세션 수' },
  users:          { title: '활성 사용자',   subtitle: '사이트를 방문한 고유 사용자 수' },
  pageViews:      { title: '페이지뷰',      subtitle: '페이지 조회 총 횟수' },
  bounceRate:     { title: '이탈률',        subtitle: '단일 페이지만 보고 이탈한 세션 비율' },
  engagementRate: { title: '참여율',        subtitle: '참여 세션 비율 (10초 이상 체류 또는 전환 발생)' },
  avgDuration:    { title: '평균 체류시간', subtitle: '사용자 1명당 평균 세션 체류 시간' },
  newUsers:       { title: '신규 사용자',   subtitle: '처음 방문한 신규 사용자 수' },
  conversions:    { title: '전환',          subtitle: '주요 전환 이벤트(문의·CTA·연락처 클릭) 횟수' },
};

const TREND_KEY: Record<string, 'views' | 'sessions' | 'users'> = {
  sessions:  'sessions',
  users:     'users',
  pageViews: 'views',
  newUsers:  'users',
};

const PAGE_SORT: Record<string, PageSortMetric> = {
  bounceRate:     'bounceRate',
  engagementRate: 'engagementRate',
  avgDuration:    'userEngagementDuration',
};

async function safeGA<T>(fn: () => Promise<T>): Promise<T | null> {
  try { return await fn(); } catch { return null; }
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ metric?: string; from?: string; to?: string }>;
}) {
  const { metric: mp = 'sessions', from: fromParam, to: toParam } = await searchParams;
  const metric = Object.keys(METRIC_META).includes(mp) ? mp : 'sessions';
  const { from, to } = parseDateRange(fromParam, toParam);

  const meta      = METRIC_META[metric];
  const trendKey  = TREND_KEY[metric];
  const hasTrend  = !!trendKey;
  const sortKey   = PAGE_SORT[metric];
  const hasSorted = !!sortKey;

  const [timeline, devices, countries, topPages, sortedPages, conversions] = await Promise.all([
    hasTrend                                    ? safeGA(() => getTimeSeries(from, to))                    : Promise.resolve(null),
    metric === 'sessions' || metric === 'users'  ? safeGA(() => getDeviceBreakdown(from, to))               : Promise.resolve(null),
    metric === 'sessions' || metric === 'users'  ? safeGA(() => getCountryBreakdown(from, to))              : Promise.resolve(null),
    metric === 'pageViews'                       ? safeGA(() => getTopPages(20, from, to))                  : Promise.resolve(null),
    hasSorted                                    ? safeGA(() => getPageDetails(from, to, sortKey, 20))      : Promise.resolve(null),
    metric === 'conversions'                     ? safeGA(() => getConversions(from, to))                   : Promise.resolve(null),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb}>
          <Link href={`/admin/dashboard?tab=overview&from=${from}&to=${to}`} className={styles.backLink}>
            ← 대시보드
          </Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>{meta.title}</span>
        </nav>
        <AnalyticsRanges metric={metric} from={from} to={to} />
      </header>

      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.subtitle}>{meta.subtitle}</p>
      </div>

      {/* 추이 차트 */}
      {hasTrend && timeline && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{meta.title} 추이 ({formatKo(from)} ~ {formatKo(to)})</h2>
          <AnalyticsTrendChart data={timeline} metricKey={trendKey!} label={meta.title} />
        </div>
      )}

      {/* 기기 + 국가 */}
      {(metric === 'sessions' || metric === 'users') && (
        <div className={styles.grid2}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>기기별 현황</h2>
            {devices && devices.length > 0
              ? <DeviceTable devices={devices} />
              : <p className={styles.empty}>데이터가 없습니다.</p>}
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>국가별 상위 10</h2>
            {countries && countries.length > 0
              ? <CountryTable countries={countries} />
              : <p className={styles.empty}>데이터가 없습니다.</p>}
          </div>
        </div>
      )}

      {/* 페이지뷰 — 상위 페이지 */}
      {metric === 'pageViews' && topPages && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>상위 페이지 (20개)</h2>
          <TopPagesTable pages={topPages} />
        </div>
      )}

      {/* 이탈률 / 참여율 / 체류시간 — 페이지 정렬 */}
      {hasSorted && sortedPages && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {metric === 'bounceRate'     && '이탈률이 높은 페이지'}
            {metric === 'engagementRate' && '참여율이 높은 페이지'}
            {metric === 'avgDuration'    && '체류시간이 긴 페이지'}
          </h2>
          <SortedPagesTable
            key={metric}
            pages={sortedPages}
            metric={metric as 'bounceRate' | 'engagementRate' | 'avgDuration'}
          />
        </div>
      )}

      {/* 신규 사용자 */}
      {metric === 'newUsers' && (
        <div className={styles.card}>
          <p className={styles.note}>
            위 추이 그래프는 활성 사용자 기준입니다. 신규/재방문 비율은 GA4 콘솔의 &quot;사용자 획득&quot; 보고서에서 확인하세요.
          </p>
        </div>
      )}

      {/* 전환 */}
      {metric === 'conversions' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>전환 이벤트 집계</h2>
          {conversions && conversions.length > 0 ? (
            <ConversionsTable conversions={conversions} />
          ) : (
            <p className={styles.empty}>
              아직 전환 이벤트 데이터가 없습니다.
              GA4 콘솔에서 <code>generate_lead</code>, <code>cta_click</code>, <code>contact_click</code>을 키 이벤트로 등록하세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
