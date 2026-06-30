import { and, eq, ne, desc, lt, gt, ilike, count as drizzleCount, sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '@/backend/shared/db/schema';
import { articles } from '@/backend/shared/db/schema';
import type { IArticleRepository, FindAllOptions, ArticleStatus } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

type DB = PostgresJsDatabase<typeof schema>;

export class DrArticleRepository implements IArticleRepository {
  constructor(private readonly db: DB) {}

  async findAll(options: FindAllOptions = {}): Promise<ArticleEntity[]> {
    const { category, limit, offset, status } = options;

    const conditions = [
      ...(category ? [eq(articles.category, category)] : []),
      ...(status ? [eq(articles.status, status)] : []),
    ];
    const where = conditions.length ? and(...conditions) : undefined;

    return this.db
      .select({
        id: articles.id,
        title: articles.title,
        title_en: articles.title_en,
        title_ja: articles.title_ja,
        content: sql<string>`left(${articles.content}, 500)`,
        content_en: sql<string>`left(${articles.content_en}, 500)`,
        content_ja: sql<string>`left(${articles.content_ja}, 500)`,
        cover_img_url: articles.cover_img_url,
        category: articles.category,
        status: articles.status,
        published_at: articles.published_at,
        pinned_at: articles.pinned_at,
        created_at: articles.created_at,
      })
      .from(articles)
      .where(where)
      // 고정글(pinned_at 최신순) 먼저, 그다음 작성일 최신순
      .orderBy(sql`${articles.pinned_at} DESC NULLS LAST`, desc(articles.created_at))
      .limit(limit ?? 10000)
      .offset(offset ?? 0);
  }

  async findById(id: string): Promise<ArticleEntity | null> {
    const rows = await this.db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async findAdjacentByCategory(
    id: string,
    category: string,
    createdAt: Date
  ): Promise<{ prev: ArticleEntity | null; next: ArticleEntity | null }> {
    const [prevRows, nextRows] = await Promise.all([
      this.db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.category, category),
            eq(articles.status, 'published'),
            ne(articles.id, id),
            lt(articles.created_at, createdAt)
          )
        )
        .orderBy(desc(articles.created_at))
        .limit(1),
      this.db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.category, category),
            eq(articles.status, 'published'),
            ne(articles.id, id),
            gt(articles.created_at, createdAt)
          )
        )
        .orderBy(articles.created_at)
        .limit(1),
    ]);
    return { prev: prevRows[0] ?? null, next: nextRows[0] ?? null };
  }

  async findByContentPattern(pattern: string): Promise<ArticleEntity | null> {
    const rows = await this.db
      .select()
      .from(articles)
      .where(ilike(articles.content, pattern))
      .orderBy(desc(articles.created_at))
      .limit(1);
    return rows[0] ?? null;
  }

  async count(category?: string, status?: ArticleStatus): Promise<number> {
    const conditions = [
      ...(category ? [eq(articles.category, category)] : []),
      ...(status ? [eq(articles.status, status)] : []),
    ];
    const where = conditions.length ? and(...conditions) : undefined;
    const rows = await this.db
      .select({ value: drizzleCount() })
      .from(articles)
      .where(where);
    return Number(rows[0]?.value ?? 0);
  }

  async countByCategories(status?: ArticleStatus): Promise<Record<string, number>> {
    const where = status ? eq(articles.status, status) : undefined;
    const rows = await this.db
      .select({ category: articles.category, value: drizzleCount() })
      .from(articles)
      .where(where)
      .groupBy(articles.category);
    return Object.fromEntries(rows.map((r) => [r.category, Number(r.value)]));
  }

  async setStatus(
    id: string,
    status: ArticleStatus,
    publishedAt: Date | null
  ): Promise<ArticleEntity | null> {
    const rows = await this.db
      .update(articles)
      .set({ status, published_at: publishedAt })
      .where(eq(articles.id, id))
      .returning();
    return rows[0] ?? null;
  }

  async setPinned(id: string, pinnedAt: Date | null): Promise<ArticleEntity | null> {
    const rows = await this.db
      .update(articles)
      .set({ pinned_at: pinnedAt })
      .where(eq(articles.id, id))
      .returning();
    return rows[0] ?? null;
  }

  async create(
    data: Omit<ArticleEntity, 'id' | 'created_at' | 'status' | 'published_at' | 'pinned_at'> &
      Partial<Pick<ArticleEntity, 'status' | 'published_at' | 'pinned_at'>>
  ): Promise<ArticleEntity> {
    const rows = await this.db.insert(articles).values(data).returning();
    return rows[0];
  }

  async update(
    id: string,
    data: Partial<Omit<ArticleEntity, 'id' | 'created_at'>>
  ): Promise<ArticleEntity | null> {
    const rows = await this.db
      .update(articles)
      .set(data)
      .where(eq(articles.id, id))
      .returning();
    return rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning({ id: articles.id });
    return rows.length > 0;
  }
}
