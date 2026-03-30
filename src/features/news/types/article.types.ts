export type ArticleStatus = 'draft' | 'published';

export interface Article {
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

export type ArticleFormData = Pick<
  Article,
  'title' | 'slug' | 'content' | 'excerpt' | 'category' | 'status' | 'cover_image_url'
>;
