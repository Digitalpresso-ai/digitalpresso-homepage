export type NewsCategory = "company" | "construction" | "technology";

export interface ArticleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type ArticleStatus = "draft" | "published";

// CMS(Supabase) 엔티티 — DB 응답 기준
export interface ArticleEntity {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  status: ArticleStatus;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
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
  thumbnail: string;
  thumbnailFit?: "cover" | "contain";
  thumbnailBorder?: boolean;
  mainImage: ArticleImage;
  bodyImages: ArticleImage[];
  bodyParagraphs: string[];
  sourceUrl?: string;
}

export type ArticleFormData = Pick<
  ArticleEntity,
  | "title"
  | "slug"
  | "content"
  | "excerpt"
  | "category"
  | "status"
  | "cover_image_url"
>;
