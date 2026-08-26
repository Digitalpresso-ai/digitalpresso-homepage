// src/features/home/types/brochure.types.ts

import { z } from 'zod';

export const brochureRequestSchema = z.object({
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'privacyRequired',
  }),
});

export type BrochureRequestData = z.infer<typeof brochureRequestSchema>;
