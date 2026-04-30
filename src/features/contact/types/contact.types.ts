// src/features/contact/types/contact.types.ts

import { z } from 'zod';

export enum InquiryType {
  INVESTMENT = 'INVESTMENT',
  SERVICE_INTRODUCE = 'SERVICE_INTRODUCE',
  FUNCTION = 'FUNCTION',
  SERVICE_ERROR = 'SERVICE_ERROR',
  ETC = 'ETC',
}

export enum SourceType {
  EXHIBITION = 'EXHIBITION',
  SNS = 'SNS',
  MARKETING = 'MARKETING',
  REFERRAL = 'REFERRAL',
  OTHER_CHANNEL = 'OTHER_CHANNEL',
}

export const contactFormSchema = z.object({
  inquiryType: z.enum(
    ['INVESTMENT', 'SERVICE_INTRODUCE', 'FUNCTION', 'SERVICE_ERROR', 'ETC'] as const,
    { message: 'inquiryTypeRequired' },
  ),
  organization: z.string().min(1, 'organizationRequired'),
  name: z.string().min(1, 'nameRequired'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  phone: z.string().optional(),
  source: z.enum(
    ['EXHIBITION', 'SNS', 'MARKETING', 'REFERRAL', 'OTHER_CHANNEL'] as const,
    { message: 'sourceRequired' },
  ),
  message: z.string().min(1, 'messageRequired'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'privacyRequired',
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
