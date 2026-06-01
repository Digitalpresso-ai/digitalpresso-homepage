import { BetaAnalyticsDataClient } from '@google-analytics/data';

function parseServiceAccountKey(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith('{')
    ? trimmed
    : Buffer.from(trimmed, 'base64').toString('utf8');

  try {
    return JSON.parse(jsonText);
  } catch {
    const escaped = jsonText.replace(/\r/g, '').replace(/\n/g, '\\n');
    const parsed = JSON.parse(escaped) as Record<string, unknown>;
    if (typeof parsed.private_key === 'string') {
      parsed.private_key = (parsed.private_key as string).replace(/\\n/g, '\n');
    }
    return parsed;
  }
}

function getClient() {
  const raw = process.env.GA_SERVICE_ACCOUNT_KEY_JSON;
  if (!raw) throw new Error('GA_SERVICE_ACCOUNT_KEY_JSON is not set');
  const credentials = parseServiceAccountKey(raw);
  return new BetaAnalyticsDataClient({ credentials });
}

function propertyId() {
  const id = process.env.GA_PROPERTY_ID;
  if (!id) throw new Error('GA_PROPERTY_ID is not set');
  return `properties/${id}`;
}

function prevRange(days: number) {
  return { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` };
}

export interface OverviewMetrics {
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  engagementRate: number;
  avgSessionDuration: number;
  newUsers: number;
  prev: { sessions: number; users: number; pageViews: number; bounceRate: number };
}

/** 요약 지표 (현재 + 이전 기간 비교) */
export async function getOverviewMetrics(days = 30): Promise<OverviewMetrics> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [
      { startDate: `${days}daysAgo`, endDate: 'today' },
      prevRange(days),
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'bounceRate' },
      { name: 'engagementRate' },
      { name: 'userEngagementDuration' },
      { name: 'newUsers' },
    ],
  });

  const rows = response.rows ?? [];
  const cur = rows.find(r => r.dimensionValues?.[0]?.value === 'date_range_0') ?? rows[0];
  const prv = rows.find(r => r.dimensionValues?.[0]?.value === 'date_range_1') ?? rows[1];

  function n(row: typeof cur, i: number) {
    return Number(row?.metricValues?.[i]?.value ?? 0);
  }

  const duration = n(cur, 5);
  const sessions = n(cur, 0);

  return {
    sessions,
    users: n(cur, 1),
    pageViews: n(cur, 2),
    bounceRate: Math.round(n(cur, 3) * 100),
    engagementRate: Math.round(n(cur, 4) * 100),
    avgSessionDuration: sessions > 0 ? Math.round(duration / sessions) : 0,
    newUsers: n(cur, 6),
    prev: {
      sessions: n(prv, 0),
      users: n(prv, 1),
      pageViews: n(prv, 2),
      bounceRate: Math.round(n(prv, 3) * 100),
    },
  };
}

export interface TimelinePoint { date: string; views: number; sessions: number; users: number }

/** 최근 n일간 일별 지표 (pageViews / sessions / activeUsers) */
export async function getTimeSeries(days = 30): Promise<TimelinePoint[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  return (response.rows ?? []).map(row => ({
    date: row.dimensionValues?.[0].value ?? '',
    views: Number(row.metricValues?.[0].value ?? 0),
    sessions: Number(row.metricValues?.[1].value ?? 0),
    users: Number(row.metricValues?.[2].value ?? 0),
  }));
}

/** backward compat */
export const getPageViewsTimeline = getTimeSeries;

export interface TopPage { path: string; title: string; views: number; bounceRate: number }

/** 상위 페이지 (조회수 기준) */
export async function getTopPages(limit = 10, days = 30): Promise<TopPage[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'bounceRate' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit,
  });

  return (response.rows ?? []).map(row => ({
    path: row.dimensionValues?.[0].value ?? '',
    title: row.dimensionValues?.[1].value ?? '',
    views: Number(row.metricValues?.[0].value ?? 0),
    bounceRate: Math.round(Number(row.metricValues?.[1].value ?? 0) * 100),
  }));
}

export interface ContentItem {
  path: string;
  articleId: string | null;
  views: number;
  avgDuration: number;
  bounceRate: number;
  activeUsers: number;
}

/** 아티클 콘텐츠 성과 (/news/article/* 필터) */
export async function getContentPerformance(days = 30): Promise<ContentItem[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'userEngagementDuration' },
      { name: 'bounceRate' },
      { name: 'activeUsers' },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { matchType: 'CONTAINS', value: '/news/article/' },
      },
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20,
  });

  const uuidRe = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  return (response.rows ?? []).map(row => {
    const path = row.dimensionValues?.[0].value ?? '';
    const activeUsers = Number(row.metricValues?.[3].value ?? 0);
    const duration = Number(row.metricValues?.[1].value ?? 0);
    return {
      path,
      articleId: path.match(uuidRe)?.[0] ?? null,
      views: Number(row.metricValues?.[0].value ?? 0),
      avgDuration: activeUsers > 0 ? Math.round(duration / activeUsers) : 0,
      bounceRate: Math.round(Number(row.metricValues?.[2].value ?? 0) * 100),
      activeUsers,
    };
  });
}

export interface LocaleStat {
  locale: 'ko' | 'en' | 'ja';
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
}

/** 언어별(ko/en/ja) 트래픽 — URL 경로 prefix 기반 */
export async function getLocaleBreakdown(days = 30): Promise<LocaleStat[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'bounceRate' },
    ],
    limit: 500,
  });

  const buckets: Record<string, { sessions: number; users: number; pv: number; brSum: number; cnt: number }> = {
    ko: { sessions: 0, users: 0, pv: 0, brSum: 0, cnt: 0 },
    en: { sessions: 0, users: 0, pv: 0, brSum: 0, cnt: 0 },
    ja: { sessions: 0, users: 0, pv: 0, brSum: 0, cnt: 0 },
  };

  for (const row of response.rows ?? []) {
    const path = row.dimensionValues?.[0].value ?? '';
    const locale = path.startsWith('/en/') || path === '/en' ? 'en'
      : path.startsWith('/ja/') || path === '/ja' ? 'ja'
      : 'ko';
    const b = buckets[locale];
    b.sessions += Number(row.metricValues?.[0].value ?? 0);
    b.users    += Number(row.metricValues?.[1].value ?? 0);
    b.pv       += Number(row.metricValues?.[2].value ?? 0);
    b.brSum    += Number(row.metricValues?.[3].value ?? 0);
    b.cnt      += 1;
  }

  return (['ko', 'en', 'ja'] as const).map(locale => ({
    locale,
    sessions:  buckets[locale].sessions,
    users:     buckets[locale].users,
    pageViews: buckets[locale].pv,
    bounceRate: buckets[locale].cnt > 0
      ? Math.round((buckets[locale].brSum / buckets[locale].cnt) * 100)
      : 0,
  }));
}

export interface TrafficChannel {
  channel: string;
  sessions: number;
  users: number;
  engagementRate: number;
}

/** 채널별 트래픽 유입 */
export async function getTrafficAcquisition(days = 30): Promise<TrafficChannel[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'engagementRate' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  return (response.rows ?? []).map(row => ({
    channel: row.dimensionValues?.[0].value ?? '(none)',
    sessions: Number(row.metricValues?.[0].value ?? 0),
    users: Number(row.metricValues?.[1].value ?? 0),
    engagementRate: Math.round(Number(row.metricValues?.[2].value ?? 0) * 100),
  }));
}

export interface TopSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
}

/** 상위 유입 소스/미디엄 */
export async function getTopSources(days = 30, limit = 10): Promise<TopSource[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit,
  });

  return (response.rows ?? []).map(row => ({
    source: row.dimensionValues?.[0].value ?? '(direct)',
    medium: row.dimensionValues?.[1].value ?? '(none)',
    sessions: Number(row.metricValues?.[0].value ?? 0),
    users: Number(row.metricValues?.[1].value ?? 0),
  }));
}

export interface ConversionData { eventName: string; count: number }

/** 전환 이벤트 집계 (generate_lead / cta_click / contact_click) */
export async function getConversions(days = 30): Promise<ConversionData[]> {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: ['generate_lead', 'cta_click', 'contact_click'] },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });

  return (response.rows ?? []).map(row => ({
    eventName: row.dimensionValues?.[0].value ?? '',
    count: Number(row.metricValues?.[0].value ?? 0),
  }));
}

/** 아티클 페이지 (/news/*) 조회수 */
export async function getArticlePageViews() {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { matchType: 'BEGINS_WITH', value: '/news/' },
      },
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  });

  return (response.rows ?? []).map(row => ({
    path: row.dimensionValues?.[0].value ?? '',
    views: Number(row.metricValues?.[0].value ?? 0),
  }));
}
