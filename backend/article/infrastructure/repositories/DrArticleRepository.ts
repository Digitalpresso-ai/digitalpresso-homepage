import { and, eq, desc, lt, gt, ilike, count as drizzleCount } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '@/backend/shared/db/schema';
import { articles } from '@/backend/shared/db/schema';
import type { IArticleRepository, FindAllOptions } from '../../domain/repositories/IArticleRepository';
import type { ArticleEntity } from '../../domain/entities/ArticleEntity';

type DB = PostgresJsDatabase<typeof schema>;

export class DrArticleRepository implements IArticleRepository {
  constructor(private readonly db: DB) {}

  async findAll(options: FindAllOptions = {}): Promise<ArticleEntity[]> {
    const { category, limit, offset } = options;

    const conditions = category ? [eq(articles.category, category)] : [];
    const where = conditions.length ? and(...conditions) : undefined;

    return this.db
      .select()
      .from(articles)
      .where(where)
      .orderBy(desc(articles.created_at))
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
    _id: string,
    category: string,
    createdAt: Date
  ): Promise<{ prev: ArticleEntity | null; next: ArticleEntity | null }> {
    const [prevRows, nextRows] = await Promise.all([
      this.db
        .select()
        .from(articles)
        .where(and(eq(articles.category, category), lt(articles.created_at, createdAt)))
        .orderBy(desc(articles.created_at))
        .limit(1),
      this.db
        .select()
        .from(articles)
        .where(and(eq(articles.category, category), gt(articles.created_at, createdAt)))
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

  async count(category?: string): Promise<number> {
    const where = category ? eq(articles.category, category) : undefined;
    const rows = await this.db
      .select({ value: drizzleCount() })
      .from(articles)
      .where(where);
    return Number(rows[0]?.value ?? 0);
  }

  async create(data: Omit<ArticleEntity, 'id' | 'created_at'>): Promise<ArticleEntity> {
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
