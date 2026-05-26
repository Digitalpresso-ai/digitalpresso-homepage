import type { InferSelectModel } from 'drizzle-orm';
import type { articles } from '@/backend/shared/db/schema';

export type ArticleEntity = InferSelectModel<typeof articles>;
