# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

No test runner is configured yet.

## Architecture

Next.js 16 app using the **App Router** with React 19 and TypeScript. React Compiler is enabled (`next.config.ts`) for automatic memoization.

**Styling:** CSS Modules (no Tailwind). Global tokens live in `app/globals.css` as CSS custom properties with dark mode via `prefers-color-scheme`.

**Path alias:** `@/*` maps to the project root.

**Fonts:** Geist and Geist Mono loaded via `next/font/google` in the root layout.

The project is freshly scaffolded from `create-next-app` — the `app/` directory currently only contains the default home page.
