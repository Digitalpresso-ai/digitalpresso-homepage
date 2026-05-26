import type { ArticleImageEntity } from '../entities/ArticleImageEntity';

export interface IArticleImageRepository {
  create(data: Omit<ArticleImageEntity, 'id' | 'created_at'>): Promise<ArticleImageEntity>;
}
