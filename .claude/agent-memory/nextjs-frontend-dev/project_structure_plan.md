---
name: Directory structure and i18n architecture plan
description: Agreed directory structure for the digitalpresso homepage including i18n routing, feature organization, and tech choices
type: project
---

Planned directory structure uses `app/[locale]/` (next-intl) for multilingual routing (ko/en/ja), `src/features/` for domain code, `src/shared/` for cross-feature utilities, and `messages/` at root for translation dictionaries.

**Why:** Site has 8 pages across 3 locales with a contact form and dynamic news articles. FSD was explicitly ruled out — keeping structure flat and simple.

**How to apply:** When implementing any page or component, follow this structure:
- Pages go in `app/[locale]/[route]/page.tsx`
- Feature-scoped components/actions/types go in `src/features/[feature]/`
- Shared layout components (Header, Footer) go in `src/shared/components/` with `App` prefix
- Translation files go in `messages/ko.json`, `messages/en.json`, `messages/ja.json`
- i18n config lives in `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`
- Contact form uses a Server Action in `src/features/contact/actions/sendInquiry.ts` (not an API route)
- News data fetching uses plain async functions in `src/features/news/api/news.api.ts` (no TanStack Query — server components only)
- No Zustand, no TanStack Query at this project scope

Planned packages: `next-intl`, `resend` (email), `@supabase/supabase-js` (news articles), `zod` (form validation).

**Scaffold status (2026-03-17):** All stub files have been created. The existing `app/layout.tsx` and `app/page.tsx` are kept as-is (create-next-app defaults). The locale-aware equivalents live under `app/[locale]/`. `middleware.ts` is a stub awaiting `next-intl` installation.
