import type { ArticleEntity } from '../entities/ArticleEntity';

export interface FindAllOptions {
  category?: string;
  limit?: number;
  offset?: number;
}

export interface IArticleRepository {
  findAll(options?: FindAllOptions): Promise<ArticleEntity[]>;
  findById(id: string): Promise<ArticleEntity | null>;
  findAdjacentByCategory(
    id: string,
    category: string,
    createdAt: Date
  ): Promise<{ prev: ArticleEntity | null; next: ArticleEntity | null }>;
  findByContentPattern(pattern: string): Promise<ArticleEntity | null>;
  count(category?: string): Promise<number>;
  countByCategories(): Promise<Record<string, number>>;
  create(data: Omit<ArticleEntity, 'id' | 'created_at'>): Promise<ArticleEntity>;
  update(id: string, data: Partial<Omit<ArticleEntity, 'id' | 'created_at'>>): Promise<ArticleEntity | null>;
  delete(id: string): Promise<boolean>;
}
