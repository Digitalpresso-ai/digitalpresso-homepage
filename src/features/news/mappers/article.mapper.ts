import type {
  ArticleEntity,
  NewsArticle,
  NewsCategory,
} from "../types/article.types";

function extractDescription(html: string, maxLength = 120): string {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  ko: { company: "DP News", construction: "건설소식", technology: "기술소식" },
  en: { company: "DP News", construction: "Construction", technology: "Technology" },
  ja: { company: "DP News", construction: "建設ニュース", technology: "技術ニュース" },
  zh: { company: "DP News", construction: "建筑资讯", technology: "技术资讯" },
};

function getCategoryLabel(category: string, locale: string): string {
  return CATEGORY_LABELS[locale]?.[category] ?? CATEGORY_LABELS["ko"]?.[category] ?? "DP News";
}

const DATE_LOCALE_TAGS: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

function formatPublishedAt(date: Date | string, locale: string): string {
  const d = date instanceof Date ? date : new Date(date);
  const localeTag = DATE_LOCALE_TAGS[locale] ?? DATE_LOCALE_TAGS["ko"];

  if (localeTag === "en-US") {
    return new Intl.DateTimeFormat(localeTag, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }

  // ko/ja/zh 는 관용적인 "YYYY. MM. DD." 형태를 공통으로 사용한다.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}

const LOCALIZED_TITLE_FIELDS: Partial<Record<string, keyof ArticleEntity>> = {
  en: "title_en",
  ja: "title_ja",
  zh: "title_zh",
};

const LOCALIZED_CONTENT_FIELDS: Partial<Record<string, keyof ArticleEntity>> = {
  en: "content_en",
  ja: "content_ja",
  zh: "content_zh",
};

function getLocalizedTitle(entity: ArticleEntity, locale: string): string {
  const field = LOCALIZED_TITLE_FIELDS[locale];
  const value = field ? entity[field] : undefined;
  return (typeof value === "string" && value) || entity.title;
}

function getLocalizedContent(entity: ArticleEntity, locale: string): string {
  const field = LOCALIZED_CONTENT_FIELDS[locale];
  const value = field ? entity[field] : undefined;
  return (typeof value === "string" && value) || entity.content;
}

export function mapCmsArticleToNewsArticle(
  entity: ArticleEntity,
  locale: string = "ko"
): NewsArticle {
  const title = getLocalizedTitle(entity, locale);
  const content = getLocalizedContent(entity, locale);

  return {
    id: entity.id,
    title,
    description: extractDescription(content),
    category: (entity.category || "company") as NewsCategory,
    categoryLabel: getCategoryLabel(entity.category, locale),
    publishedAt: formatPublishedAt(entity.created_at, locale),
    thumbnail: entity.cover_img_url ?? "",
    mainImage: {
      src: entity.cover_img_url ?? "",
      alt: title,
      width: 800,
      height: 450,
    },
    bodyImages: [],
    bodyParagraphs: [content],
    isHtmlContent: true,
  };
}
