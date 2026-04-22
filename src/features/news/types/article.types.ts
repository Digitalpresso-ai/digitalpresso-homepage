export type NewsCategory = "company" | "construction" | "technology";

export interface ArticleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// CMS(Supabase) 엔티티 — DB 응답 기준
export interface ArticleEntity {
  id: string;
  title: string;
  title_en: string;
  title_ja: string;
  content: string;
  content_en: string;
  content_ja: string;
  category: string;
  created_at: string;
  cover_img_url: string | null;
}

// 회사 소식 정적 데이터 기준
export interface StaticCompanyArticle {
  id: string;
  title: string;
  description: string;
  category: NewsCategory;
  categoryLabel: string;
  publishedAt: string;
  thumbnail: string;
  thumbnailFit?: "cover" | "contain";
  thumbnailBorder?: boolean;
  mainImage: ArticleImage;
  bodyImages: ArticleImage[];
  bodyParagraphs: string[];
  sourceUrl?: string;
}

// UI 공통 렌더링 타입
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  category: NewsCategory;
  categoryLabel: string;
  publishedAt: string;
  publishedAtIso: string;
  thumbnail: string;
  thumbnailFit?: "cover" | "contain";
  thumbnailBorder?: boolean;
  mainImage: ArticleImage;
  bodyImages: ArticleImage[];
  bodyParagraphs: string[];
  sourceUrl?: string;
  isHtmlContent?: boolean;
}

export type ArticleFormData = Pick<
  ArticleEntity,
  | "title"
  | "title_en"
  | "title_ja"
  | "content"
  | "content_en"
  | "content_ja"
  | "cover_img_url"
  | "category"
>;
