// src/features/contact/types/contact.types.ts

import { z } from 'zod';

export enum InquiryType {
  INVESTMENT = 'INVESTMENT',
  SERVICE = 'SERVICE',
  FEATURE = 'FEATURE',
  ERROR = 'ERROR',
  OTHER = 'OTHER',
}

export enum SourceType {
  EXHIBITION = 'EXHIBITION',
  SNS = 'SNS',
  MARKETING = 'MARKETING',
  REFERRAL = 'REFERRAL',
  OTHER_CHANNEL = 'OTHER_CHANNEL',
}

export const contactFormSchema = z.object({
  inquiryType: z
    .enum(['INVESTMENT', 'SERVICE', 'FEATURE', 'ERROR', 'OTHER'] as const)
    .refine((val) => val !== undefined, { message: 'inquiryTypeRequired' }),
  organization: z.string().min(1, 'organizationRequired'),
  name: z.string().min(1, 'nameRequired'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  phone: z.string().optional(),
  source: z
    .enum(['EXHIBITION', 'SNS', 'MARKETING', 'REFERRAL', 'OTHER_CHANNEL'] as const)
    .refine((val) => val !== undefined, { message: 'sourceRequired' }),
  message: z.string().min(1, 'messageRequired'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'privacyRequired',
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
