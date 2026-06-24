import type { ArticleEntity } from '../entities/ArticleEntity';

export type ArticleStatus = 'draft' | 'published';

export interface FindAllOptions {
  category?: string;
  limit?: number;
  offset?: number;
  /** 지정 시 해당 상태만 조회. 생략 시 전체(draft+published) — admin 용 */
  status?: ArticleStatus;
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
  count(category?: string, status?: ArticleStatus): Promise<number>;
  countByCategories(status?: ArticleStatus): Promise<Record<string, number>>;
  /** draft → published 또는 published → draft 전환 */
  setStatus(id: string, status: ArticleStatus, publishedAt: Date | null): Promise<ArticleEntity | null>;
  create(
    data: Omit<ArticleEntity, 'id' | 'created_at' | 'status' | 'published_at'> &
      Partial<Pick<ArticleEntity, 'status' | 'published_at'>>
  ): Promise<ArticleEntity>;
  update(id: string, data: Partial<Omit<ArticleEntity, 'id' | 'created_at'>>): Promise<ArticleEntity | null>;
  delete(id: string): Promise<boolean>;
}
