// i18n/routing.ts — next-intl routing configuration (stub)

export const locales = ['ko', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ko';
