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
  /** 고정/고정해제. pinnedAt 에 시각을 주면 고정, null 이면 해제 */
  setPinned(id: string, pinnedAt: Date | null): Promise<ArticleEntity | null>;
  create(
    data: Omit<ArticleEntity, 'id' | 'created_at' | 'status' | 'published_at' | 'pinned_at'> &
      Partial<Pick<ArticleEntity, 'status' | 'published_at' | 'pinned_at'>>
  ): Promise<ArticleEntity>;
  update(id: string, data: Partial<Omit<ArticleEntity, 'id' | 'created_at'>>): Promise<ArticleEntity | null>;
  delete(id: string): Promise<boolean>;
}
