import type { InferSelectModel } from 'drizzle-orm';
import type { articleImages } from '@/backend/shared/db/schema';

export type ArticleImageEntity = InferSelectModel<typeof articleImages>;
