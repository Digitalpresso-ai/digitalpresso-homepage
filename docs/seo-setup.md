# SEO 설정 가이드 (digitalpresso.ai)

> 최초 작성: 2026-06-17
> 배경: Vercel 기본 도메인 → 정식 도메인(`digitalpresso.ai`) 이전 후 구글·네이버 검색에
> 노출되지 않던 문제를 진단·해결하며 정리한 문서.

---

## 1. 문제와 진단 결과

### 증상
- "디지털프레소 / digitalpresso / renameDP" 검색 시 사이트가 안 나옴.
- 도메인을 `digitalpresso.ai`로 옮긴 시점부터 발생.

### 근본 원인 (코드 문제가 아니었음)
- 도메인 이전 = 검색엔진 입장에서 **새 사이트** → 신뢰도(도메인 권위) 0부터 시작.
- **Google Search Console에 등록된 적이 없어** 구글이 사이트를 제대로 발견·색인하지 못함.
- robots/sitemap/메타 등 **코드 SEO 설정 자체는 정상**이었음.

### 진단 중 밝혀진 사실
- `about-us`의 "noindex 제외" = **과거 크롤링 데이터**. 현재는 noindex 없음(정상).
- 기사 수 = **28개** (회사 11 + 건설 12 + 기술 5). 사이트맵 URL은 한/영/일 3언어로 **84개**.
- 죽은 `vercel.app` 주소 404 = Vercel이 옛 주소 형식을 회수한 것. 우리 제어 밖.

---

## 2. 검색엔진 등록 현황

| 검색엔진 | 도구 | 등록 | 사이트맵 | URL 제출 |
|----------|------|:---:|:---:|:---:|
| 구글 | [Search Console](https://search.google.com/search-console) | ✅ | ✅ | ✅ |
| Bing (Edge) | [Bing Webmaster Tools](https://www.bing.com/webmasters) | ✅ | ✅ | ✅ |
| 네이버 | [서치어드바이저](https://searchadvisor.naver.com) | ✅ | ✅ | ✅ |

### 등록 정보
- **사이트맵 URL**: `https://digitalpresso.ai/sitemap.xml` (URL 105개 = 페이지 21 + 기사 84)
- **구글 등록 계정**: 회사 계정 (`digitalpresso@digitalpresso.ai`), **도메인 속성** 방식
  - 검증: Vercel DNS에 TXT 레코드 추가
    `google-site-verification=LmCqDy9qJkvd-027OYfd0viCUaiDivU5ygo3_yz2rCw`
- **네이버 검증**: HTML 태그 (`naver-site-verification`), 코드에 포함
  - 현재 값: `0ca72e1f05ccb55a1fc98ffb753510b4858e798a` (app/layout.tsx)
- **DNS 관리**: Vercel 네임서버 (`ns1/ns2.vercel-dns.com`)
- **프로젝트**: `digitalpresso-homepage` (Vercel 팀 `digitalpressos-projects`)

> 참고: Bing은 Google Search Console "가져오기(Import)" 기능으로 빠르게 등록 가능.

---

## 3. 코드 SEO 작업 (모두 배포 완료)

| 작업 | 파일 | 효과 |
|------|------|------|
| 기사 `NewsArticle` JSON-LD 추가 | `app/[locale]/news/article/[id]/page.tsx` | 구글이 "뉴스 기사"로 인식 → 색인·리치 노출 향상 |
| 기사 제목 중복 제거 | 동일 | `제목 \| digitalPresso \| digitalPresso` → `제목 \| digitalPresso` |
| vercel.app → 정식 도메인 301 | `middleware.ts` | 살아있는 `*.vercel.app` 접속 시 경로 보존하며 301 리다이렉트 |
| 한글 브랜드명 강화 | `app/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/about-us/page.tsx` | "디지털프레소" 한글 검색 노출 개선 |
| `Organization` JSON-LD | `app/layout.tsx` | `alternateName: ["디지털프레소", ...]`로 한글 브랜드명을 영문명과 연결 |
| 네이버 검증값 갱신 | `app/layout.tsx` | 옛 값 → 신규 발급 값으로 교체 (네이버 소유확인 통과) |

### 핵심 SEO 파일
- `lib/seo.ts` — 페이지 메타데이터 빌더 (`buildPageMetadata`), hreflang 다국어 대체 URL
- `lib/site-url.ts` — 정식 도메인 헬퍼 (`SITE_URL` env 없으면 `https://digitalpresso.ai`)
- `app/sitemap.ts` — 사이트맵 (정적 페이지 + 발행 기사, 3언어)
- `app/robots.ts` — robots.txt (admin/api/private 차단, 사이트맵 명시)

---

## 4. 검색 노출을 높이는 운영 작업 (검색엔진 콘솔에서 직접)

1. **사이트맵 제출** — 각 콘솔에 `sitemap.xml` 1회 제출 (가장 중요).
2. **색인/URL 제출 요청** — 핵심 페이지·기사를 콕 집어 우선 색인 요청.
   - 구글: 하루 할당량 약 10개 → 홈·about-us·products·핵심 기사 위주.
   - Bing: 할당량 넉넉 → 더 많이 제출 가능.
   - 네이버: 요청 > 웹페이지 수집.
3. **"수정사항 검증"** — "noindex 제외" 등 과거 데이터 리포트는 검증 시작 또는 URL 재요청으로 해제.

---

## 5. 예상 타임라인 (신생 도메인)

| 시점 | 기대 |
|------|------|
| 1~2일 | 각 콘솔에서 사이트맵 상태 "성공" + 발견 URL 수 표시 |
| 3~7일 | 색인 요청한 핵심 페이지 "등록됨"으로 전환 시작 |
| 1~2주 | `site:digitalpresso.ai` 결과 증가, "디지털프레소" 한글 검색 노출 시작 |
| 2~4주 | 기사 색인 확대, 죽은 vercel.app URL 검색에서 감소 |

> 신생 도메인은 신뢰도 누적에 시간이 걸림. 색인 추이는 각 콘솔의 "페이지/색인 생성" 리포트에서 확인.

---

## 6. 점검 도구

- 구글 리치 결과 테스트: https://search.google.com/test/rich-results (기사 URL → NewsArticle 감지 확인)
- 색인 여부 확인: 각 검색엔진에서 `site:digitalpresso.ai` 검색
- vercel.app 잔재 확인: `site:digitalpresso-homepage.vercel.app` (점차 0으로 줄어야 정상)
