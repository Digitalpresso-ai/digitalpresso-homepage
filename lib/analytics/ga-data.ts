import { BetaAnalyticsDataClient } from '@google-analytics/data';

function getClient() {
  const raw = process.env.GA_SERVICE_ACCOUNT_KEY_JSON;
  if (!raw) throw new Error('GA_SERVICE_ACCOUNT_KEY_JSON is not set');

  const credentials = JSON.parse(raw);
  return new BetaAnalyticsDataClient({ credentials });
}

function propertyId() {
  const id = process.env.GA_PROPERTY_ID;
  if (!id) throw new Error('GA_PROPERTY_ID is not set');
  return `properties/${id}`;
}

/** 최근 n일간 일별 페이지뷰 */
export async function getPageViewsTimeline(days = 30) {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  return (response.rows ?? []).map((row) => ({
    date: row.dimensionValues?.[0].value ?? '',
    views: Number(row.metricValues?.[0].value ?? 0),
  }));
}

/** 상위 페이지 (조회수 기준) */
export async function getTopPages(limit = 10) {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'bounceRate' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit,
  });

  return (response.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0].value ?? '',
    title: row.dimensionValues?.[1].value ?? '',
    views: Number(row.metricValues?.[0].value ?? 0),
    bounceRate: Math.round(Number(row.metricValues?.[1].value ?? 0) * 100),
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

  return (response.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0].value ?? '',
    views: Number(row.metricValues?.[0].value ?? 0),
  }));
}

/** 요약 지표 (총 세션, 사용자, 페이지뷰) */
export async function getOverviewMetrics() {
  const client = getClient();
  const [response] = await client.runReport({
    property: propertyId(),
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'bounceRate' },
    ],
  });

  const row = response.rows?.[0];
  return {
    sessions: Number(row?.metricValues?.[0].value ?? 0),
    users: Number(row?.metricValues?.[1].value ?? 0),
    pageViews: Number(row?.metricValues?.[2].value ?? 0),
    bounceRate: Math.round(Number(row?.metricValues?.[3].value ?? 0) * 100),
  };
}
