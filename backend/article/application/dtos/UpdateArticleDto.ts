import { z } from 'zod';

export const UpdateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  title_en: z.string().optional(),
  title_ja: z.string().optional(),
  content: z.string().optional(),
  content_en: z.string().optional(),
  content_ja: z.string().optional(),
  cover_img_url: z.string().nullable().optional(),
  category: z.enum(['company', 'construction', 'technology']).optional(),
});

export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
