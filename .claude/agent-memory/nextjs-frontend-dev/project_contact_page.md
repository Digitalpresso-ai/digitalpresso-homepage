---
name: Contact page implementation
description: /contact 페이지 구현 완료 — 패키지, 파일 구조, 에러 처리 패턴
type: project
---

react-hook-form + zod + @hookform/resolvers 패키지가 설치되어 있음 (package.json에 반영).

**Why:** 문의 폼 유효성 검사를 위해 zod 스키마와 react-hook-form을 결합.

**How to apply:** 다른 폼 컴포넌트에서도 동일 패턴(zod schema → ContactFormData 타입 → zodResolver) 재사용.

주요 구현 패턴:
- Zod 에러 메시지 키를 i18n 키 이름 그대로 사용 (`'nameRequired'`, `'emailInvalid'` 등)하고, `getErrorMessage` 함수에서 switch문으로 `t('errors.X')` 호출 — next-intl 동적 키 타입 문제 회피
- `ContactInfoCard`는 Server Component (next/image, useTranslations 서버용)
- `ContactForm`은 `'use client'` — react-hook-form 사용
- 성공 상태는 별도 JSX 분기로 분리 (조건부 early return 패턴)
