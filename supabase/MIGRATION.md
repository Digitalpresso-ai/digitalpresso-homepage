# Supabase 프로젝트 이전 가이드

이 프로젝트는 데이터베이스 스키마를 [schema.sql](/Users/digitalpresso/Documents/02_digitalPresso/digitalpresso-homepage/supabase/schema.sql)로 관리하고 있습니다.

다른 Supabase 계정으로 옮기더라도 앱 동작을 그대로 유지하려면 아래 3가지를 함께 이전해야 합니다.

1. 데이터베이스 스키마
2. 데이터베이스 데이터
3. Storage 버킷 파일

## 이 프로젝트에 현재 존재하는 것

- 테이블
  - `articles`
  - `article_images`
- 관리자 에디터가 사용하는 Storage 버킷
  - `article-images`
- 앱이 사용하는 환경변수
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 권장 이전 순서

1. 새 Supabase 프로젝트 생성
2. 새 프로젝트 SQL Editor에서 `supabase/schema.sql` 실행
3. 새 프로젝트에 `article-images` Storage 버킷 생성
4. 기존 프로젝트의 테이블 데이터 복사
5. 기존 프로젝트의 Storage 파일 복사
6. 로컬 및 배포 환경의 환경변수 교체
7. 관리자 로그인, 게시글 목록, 상세 페이지, 이미지 업로드 동작 확인

## 1) 새 프로젝트에 스키마 만들기

새 Supabase 프로젝트에서 아래 순서로 진행합니다.

1. SQL Editor 열기
2. `supabase/schema.sql` 내용 붙여넣기
3. 실행

이 작업으로 아래 항목이 생성됩니다.

- `articles`
- `article_images`
- 인덱스
- RLS 정책

## 2) Storage 버킷 다시 만들기

새 Supabase 프로젝트에서 아래 순서로 진행합니다.

1. Storage 메뉴로 이동
2. `article-images` 이름으로 버킷 생성
3. 기존 버킷과 동일한 public/private 설정 적용

이 앱은 `getPublicUrl(...)`을 사용하므로, 현재 운영 환경이 공개 URL 기반으로 동작하고 있다면 새 버킷도 같은 접근 방식이 가능해야 합니다.

## 3) 데이터베이스 데이터 옮기기

이 프로젝트에서는 두 가지 방법이 현실적입니다.

### 방법 A: 단순 이전

데이터 양이 크지 않고, 현재 이 앱이 사용하는 테이블만 옮기면 되는 경우에 가장 안전합니다.

1. 기존 프로젝트에서 `articles` export
2. 기존 프로젝트에서 `article_images` export
3. 새 프로젝트에 아래 순서로 import
   - `articles`
   - `article_images`

이 순서가 중요한 이유:

- `article_images.article_id`가 `articles.id`를 참조하기 때문입니다.

### 방법 B: Postgres dump 사용

앱에서 현재 쓰는 테이블 외에 더 넓은 범위를 이전하고 싶을 때 사용합니다.

예시:

```bash
pg_dump --data-only --column-inserts "OLD_DB_URL" --table=public.articles --table=public.article_images > supabase/data.sql
psql "NEW_DB_URL" -f supabase/data.sql
```

주의:

- data-only dump를 복원하기 전에 먼저 새 프로젝트에 스키마를 생성해야 합니다.
- `--column-inserts`는 속도는 느리지만 환경 차이에 비교적 안전합니다.
- Auth 사용자, 권한, 기타 Supabase 플랫폼 관리 영역은 별도로 다뤄야 합니다.

## 4) Storage 파일 옮기기

관리자 에디터는 아래 위치로 이미지를 업로드합니다.

- 버킷: `article-images`
- 경로 패턴: `articles/<articleId>/<random>.<ext>`

그리고 데이터베이스에는 전체 public URL이 저장됩니다.

- `articles.cover_img_url`
- `article_images.image_url`

그래서 파일만 복사하면 끝나지 않습니다. 새 프로젝트는 Storage URL이 달라지므로, 파일 복사 후 DB에 저장된 URL도 함께 바꿔야 합니다.

### 권장 Storage 이전 흐름

1. 기존 프로젝트의 `article-images` 버킷 전체 파일을 새 프로젝트 `article-images` 버킷으로 복사
2. 새 프로젝트에 동일한 object key가 들어갔는지 확인
3. DB에 저장된 기존 Storage base URL을 새 프로젝트 URL로 치환

예시 형태:

- 기존
  - `https://OLD_PROJECT.supabase.co/storage/v1/object/public/article-images/articles/...`
- 새 프로젝트
  - `https://NEW_PROJECT.supabase.co/storage/v1/object/public/article-images/articles/...`

## 5) 저장된 이미지 URL 치환하기

Storage 파일 복사가 끝나면, 새 프로젝트에서 아래와 같은 SQL을 실행합니다.

실행 전 `OLD_PROJECT`, `NEW_PROJECT` 부분은 실제 값으로 교체하세요.

```sql
update articles
set cover_img_url = replace(
  cover_img_url,
  'https://OLD_PROJECT.supabase.co/storage/v1/object/public/article-images/',
  'https://NEW_PROJECT.supabase.co/storage/v1/object/public/article-images/'
)
where cover_img_url like 'https://OLD_PROJECT.supabase.co/storage/v1/object/public/article-images/%';

update article_images
set image_url = replace(
  image_url,
  'https://OLD_PROJECT.supabase.co/storage/v1/object/public/article-images/',
  'https://NEW_PROJECT.supabase.co/storage/v1/object/public/article-images/'
)
where image_url like 'https://OLD_PROJECT.supabase.co/storage/v1/object/public/article-images/%';
```

## 6) 앱 환경변수 바꾸기

앱이 실행되는 모든 환경에서 환경변수를 새 프로젝트 기준으로 교체해야 합니다.

- 로컬 `.env.local`
- Vercel 등 배포 환경

설정값:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

이 프로젝트에서 해당 값을 읽는 위치:

- [lib/supabase/client.ts](/Users/digitalpresso/Documents/02_digitalPresso/digitalpresso-homepage/lib/supabase/client.ts)
- [lib/supabase/server.ts](/Users/digitalpresso/Documents/02_digitalPresso/digitalpresso-homepage/lib/supabase/server.ts)
- [middleware.ts](/Users/digitalpresso/Documents/02_digitalPresso/digitalpresso-homepage/middleware.ts)

## 7) 이전 후 확인할 것

아래 순서대로 점검하는 것을 권장합니다.

1. 관리자 로그인 동작 여부
2. 게시글 목록 로딩 여부
3. 게시글 상세 페이지 렌더링 여부
4. 기존 커버 이미지 표시 여부
5. 본문 내부 이미지 표시 여부
6. 새 이미지 업로드 여부
7. 새 게시글 생성, 수정, 삭제 여부

## 꼭 알아둘 점

- Supabase Auth 사용자는 `schema.sql`만으로 이전되지 않습니다.
- Storage 버킷은 이 저장소의 SQL 파일만으로 생성되지 않습니다.
- 이 프로젝트는 이미지 URL을 전체 public URL로 저장하므로, 프로젝트를 바꾸면 URL 치환이 거의 항상 필요합니다.
- 기존 프로젝트와 새 프로젝트의 RLS 또는 Storage 정책이 다르면 별도로 다시 확인해야 합니다.

## 이 프로젝트에서 가장 안전한 이전 방식

현재 이 저장소는 스키마가 작고 명확하며, 이미지 URL도 직접 저장하고 있어서 아래 순서가 가장 안전합니다.

1. 새 프로젝트에서 `supabase/schema.sql` 실행
2. `article-images` 버킷 생성
3. `articles`, `article_images` 데이터 export/import
4. Storage 파일 복사
5. 기존 이미지 URL을 새 프로젝트 URL로 치환
6. 환경변수 교체

원하면 다음 단계로 이어서 아래 중 하나도 바로 만들어드릴 수 있습니다.

1. old/new 프로젝트 URL만 넣으면 되는 SQL 템플릿 파일
2. 이 저장소 기준 실제 이전 체크리스트
3. 배포 환경까지 포함한 이전 순서 문서
