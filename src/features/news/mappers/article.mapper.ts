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
};

function getCategoryLabel(category: string, locale: string): string {
  return CATEGORY_LABELS[locale]?.[category] ?? CATEGORY_LABELS["ko"]?.[category] ?? "DP News";
}

function formatPublishedAt(isoDate: string): string {
  const d = new Date(isoDate);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}.${month}`;
}

function getLocalizedTitle(entity: ArticleEntity, locale: string): string {
  if (locale === "en" && entity.title_en) return entity.title_en;
  if (locale === "ja" && entity.title_ja) return entity.title_ja;
  return entity.title;
}

function getLocalizedContent(entity: ArticleEntity, locale: string): string {
  if (locale === "en" && entity.content_en) return entity.content_en;
  if (locale === "ja" && entity.content_ja) return entity.content_ja;
  return entity.content;
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
    publishedAt: formatPublishedAt(entity.created_at),
    publishedAtIso: entity.created_at,
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
