// src/features/admin/components/ContentPerformanceTable/mergeContentItems.ts

import type { ContentItem } from '@/lib/analytics/ga-data';

type Locale = 'ko' | 'en' | 'ja' | 'zh';

const LOCALE_LABEL: Record<Locale, string> = { ko: '한국어', en: '영어', ja: '일본어', zh: '중국어' };
const LOCALE_ORDER: Locale[] = ['ko', 'en', 'ja', 'zh'];

/** 같은 기사의 언어별 URL을 합친 한 줄. */
export interface Enriched {
  articleId: string;
  title: string;
  views: number;
  avgDuration: number;
  bounceRate: number;
  activeUsers: number;
  /** 언어별 조회수 (툴팁 표시용) */
  viewsByLocale: Partial<Record<Locale, number>>;
}

function localeOf(path: string): Locale {
  const m = path.match(/^\/(en|ja|zh)(\/|$)/);
  return (m?.[1] as Locale | undefined) ?? 'ko';
}

/**
 * GA는 /news/article/{id}, /en/news/article/{id} … 를 서로 다른 페이지로
 * 집계한다. 이 화면에서만 기사 ID 기준으로 합친다.
 * 조회수·방문자는 더하고, 평균 체류·이탈률은 방문자 수로 가중평균한다.
 */
export function mergeByArticle(items: ContentItem[], titleOf: (id: string) => string | undefined): Enriched[] {
  const groups = new Map<string, ContentItem[]>();
  for (const item of items) {
    if (!item.articleId) continue;
    const group = groups.get(item.articleId);
    if (group) group.push(item);
    else groups.set(item.articleId, [item]);
  }

  return [...groups].map(([articleId, group]) => {
    const views = group.reduce((sum, i) => sum + i.views, 0);
    const activeUsers = group.reduce((sum, i) => sum + i.activeUsers, 0);
    const weighted = (pick: (i: ContentItem) => number) =>
      activeUsers > 0
        ? Math.round(group.reduce((sum, i) => sum + pick(i) * i.activeUsers, 0) / activeUsers)
        : 0;

    const viewsByLocale: Enriched['viewsByLocale'] = {};
    for (const i of group) {
      const locale = localeOf(i.path);
      viewsByLocale[locale] = (viewsByLocale[locale] ?? 0) + i.views;
    }

    return {
      articleId,
      title: titleOf(articleId) ?? group[0].path,
      views,
      avgDuration: weighted(i => i.avgDuration),
      bounceRate: weighted(i => i.bounceRate),
      activeUsers,
      viewsByLocale,
    };
  });
}

export function formatLocaleBreakdown(viewsByLocale: Enriched['viewsByLocale']): string {
  return LOCALE_ORDER
    .filter(locale => viewsByLocale[locale])
    .map(locale => `${LOCALE_LABEL[locale]} ${viewsByLocale[locale]!.toLocaleString()}`)
    .join(' · ');
}
