import type {
  ArticleEntity,
  NewsArticle,
  NewsCategory,
  StaticCompanyArticle,
} from "../types/article.types";

export function mapStaticCompanyArticleToNewsArticle(
  article: StaticCompanyArticle
): NewsArticle {
  return { ...article };
}

export function mapCmsArticleToNewsArticle(
  entity: ArticleEntity
): NewsArticle {
  return {
    id: entity.id,
    title: entity.title,
    description: "",
    category: "company" as NewsCategory,
    categoryLabel: "DP News",
    publishedAt: entity.created_at,
    thumbnail: entity.cover_img_url ?? "",
    mainImage: {
      src: entity.cover_img_url ?? "",
      alt: entity.title,
      width: 800,
      height: 450,
    },
    bodyImages: [],
    bodyParagraphs: [entity.content],
    sourceUrl: undefined,
  };
}
