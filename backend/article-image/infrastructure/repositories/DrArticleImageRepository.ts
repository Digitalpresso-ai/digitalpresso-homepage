import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '@/backend/shared/db/schema';
import { articleImages } from '@/backend/shared/db/schema';
import type { IArticleImageRepository } from '../../domain/repositories/IArticleImageRepository';
import type { ArticleImageEntity } from '../../domain/entities/ArticleImageEntity';

type DB = PostgresJsDatabase<typeof schema>;

export class DrArticleImageRepository implements IArticleImageRepository {
  constructor(private readonly db: DB) {}

  async create(data: Omit<ArticleImageEntity, 'id' | 'created_at'>): Promise<ArticleImageEntity> {
    const rows = await this.db.insert(articleImages).values(data).returning();
    return rows[0];
  }
}
