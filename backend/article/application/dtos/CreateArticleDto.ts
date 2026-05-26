import { z } from 'zod';

export const CreateArticleSchema = z.object({
  title: z.string().min(1),
  title_en: z.string().default(''),
  title_ja: z.string().default(''),
  content: z.string().default(''),
  content_en: z.string().default(''),
  content_ja: z.string().default(''),
  cover_img_url: z.string().nullable().default(null),
  category: z.enum(['company', 'construction', 'technology']).default('company'),
});

export type CreateArticleDto = z.infer<typeof CreateArticleSchema>;
