export interface ArticleDto {
  id: string;
  title: string;
  title_en: string;
  title_ja: string;
  content: string;
  content_en: string;
  content_ja: string;
  cover_img_url: string | null;
  category: string;
  created_at: string;
}

export interface ArticleListItemDto {
  id: string;
  title: string;
  category: string;
  created_at: string;
  cover_img_url: string | null;
}
