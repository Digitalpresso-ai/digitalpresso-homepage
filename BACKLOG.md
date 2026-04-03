# BACKLOG

## 배포 전 체크 (실서비스 전환)

- [ ] 개발 도메인 `https://digitalpresso-homepage.vercel.app` 를 실서비스 도메인 `https://digitalpresso.ai` 로 변경
- [ ] 변경 파일:
  - `app/layout.tsx` (`metadataBase`, `openGraph.url`)
  - `app/sitemap.ts` (`BASE_URL`)
  - `public/robots.txt` (`Sitemap`)
- [ ] 배포 후 확인:
  - `https://digitalpresso.ai/sitemap.xml` 접근 가능
  - `https://digitalpresso.ai/robots.txt` 의 Sitemap 경로 정상
  - 주요 페이지의 canonical/hreflang 정상 출력
