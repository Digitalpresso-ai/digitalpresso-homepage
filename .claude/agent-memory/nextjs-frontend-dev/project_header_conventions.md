---
name: Header component conventions
description: Design tokens, responsive breakpoints, font setup, and component location established when building the site Header
type: project
---

Header component lives at `components/layout/Header/` (not inside `src/features/`).

**Design tokens in `app/globals.css`:**
- `--color-brand: #193cb8`
- `--shadow-header: 0px 10px 15px 0px rgba(0,0,0,0.1), 0px 4px 6px 0px rgba(0,0,0,0.05)`

**Fonts:** Noto_Sans_KR (weight 400 & 700) loaded in `app/layout.tsx` as CSS variable `--font-noto-sans-kr`. All UI text in Korean uses this font via `var(--font-noto-sans-kr), 'Noto Sans KR', 'Noto Sans', sans-serif`.

**Responsive breakpoints (service-wide):**
- Desktop: >= 1280px — padding 64px, full nav
- Tablet: 800px–1279px — padding 40px, full nav
- Mobile: < 800px — padding 24px, hamburger menu
- Small mobile: <= 320px — padding 16px

**Logo:** Currently using Figma local server URL `http://localhost:3845/assets/060d2d3361ff5f66a7cbef9231f9b362119d5819.png`. Marked with TODO comment for replacement with real asset.

**Navigation Link import:** Always import `Link` from `@/i18n/navigation` (not `next/link`) for locale-aware routing.

**Why:** Header is a layout-level shared component, not feature-specific. Breakpoints are locked service-wide to maintain consistent grid behavior.

**How to apply:** Use these breakpoints (1280/800/320) for all future responsive layouts. Place layout-level shared components under `components/layout/`. Always use `@/i18n/navigation` Link.
