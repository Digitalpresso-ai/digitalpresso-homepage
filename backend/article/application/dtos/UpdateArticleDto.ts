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
  // 게시일. 정렬·표시가 모두 created_at 기준이므로 이 값으로 created_at 을 조정한다.
  // 'YYYY-MM-DD' 형식만 허용한다. (새 글은 자동으로 오늘 날짜가 들어가며, 이 필드로 옛 글의 게시일만 조정)
  published_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '게시일은 YYYY-MM-DD 형식이어야 합니다.')
    .optional(),
});

export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
