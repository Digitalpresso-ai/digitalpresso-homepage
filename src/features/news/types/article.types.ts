export type NewsCategory = "company" | "construction" | "technology";

/** 탭 필터 값. 'all' 은 전체(카테고리 필터 없음)를 의미한다. */
export type NewsTab = NewsCategory | "all";

export interface ArticleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type { ArticleEntity } from '@/backend/article/domain/entities/ArticleEntity';
import type { ArticleEntity } from '@/backend/article/domain/entities/ArticleEntity';

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
