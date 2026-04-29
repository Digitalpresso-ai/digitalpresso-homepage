# Deploy Guide

## Site URL Policy

모든 절대 URL 기준은 `NEXT_PUBLIC_SITE_URL` 하나로 통일합니다.

- Development/Preview 예시: `https://digitalpresso-homepage.vercel.app`
- Production 예시: `https://digitalpresso.ai`

적용 위치:
- `app/layout.tsx` (`metadataBase`, `openGraph.url`)
- `app/sitemap.ts`
- `app/robots.ts`

## Required Environment Variables

### Public
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server
- `SUPABASE_SERVICE_ROLE_KEY`
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `MCP_API_KEY`

## MCP Remote Connector

권장 URL:
- `https://digitalpresso.ai/api/mcp?key=<MCP_API_KEY>`

가능하면 헤더 기반(`x-mcp-api-key`)을 우선 사용합니다.

## Security

- 노출된 키는 즉시 rotate(재발급)
- 환경별 키를 분리(Dev/Preview/Prod)
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출 금지

## Post-deploy Verification

```bash
npm run verify:deploy
```

또는 커스텀 URL:

```bash
SITE_URL=https://digitalpresso.ai npm run verify:deploy
```

검증 항목:
- `/sitemap.xml` 200 + 올바른 도메인 포함
- `/robots.txt` 200 + sitemap URL 정합성
