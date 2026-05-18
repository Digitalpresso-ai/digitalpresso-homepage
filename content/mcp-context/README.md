# MCP Context Guide

이 디렉토리는 디지털프레소 MCP 뉴스레터 생성 품질을 일정하게 유지하기 위한 컨텍스트 문서 모음입니다.

## 파일 구성

- `brand-voice.md`:
  - 뉴스레터 문체/톤앤매너 가이드
  - 권장/비권장 표현 관리
- `icp.md`:
  - 핵심 타깃 고객군 및 페인포인트 정의
  - 도입 판단 포인트 정리
- `proof-points.md`:
  - 활용 가능한 검증 포인트(정성/정량)
  - 수치 표현 안전 규칙
- `cta-policy.md`:
  - 뉴스레터 말미 CTA 정책
  - 문의 문구 표준화
- `claims-guard.md`:
  - 기사 출처/기자명 비노출 규칙
  - 과장/왜곡 방지 체크리스트

## 사용 위치

- `src/services/draft-generator.service.ts`
  - 초안 생성 시 본 디렉토리 문서를 참조하여 문체/메시지/CTA를 보정합니다.
- `src/mcp/create-server.ts`
  - MCP Resource(`brand-voice://content` 등)로 등록되어 필요 시 에이전트가 직접 참조할 수 있습니다.

## 운영 원칙

1. 먼저 정책을 문서에 반영한 뒤 코드 로직을 수정합니다.
2. 표현/수치/법적 리스크 관련 변경은 `claims-guard.md`를 우선 업데이트합니다.
3. 대외 톤 변경 시 `brand-voice.md`와 `cta-policy.md`를 함께 수정합니다.
4. 타깃 고객 전략이 바뀌면 `icp.md`를 먼저 갱신합니다.
5. 검증 수치 변경 시 출처와 내부 검증 상태를 확인한 뒤 `proof-points.md`에 반영합니다.

## 변경 시 체크리스트

- `~습니다/~입니다` 문체 유지 여부
- 기사 출처/언론사/기자명 비노출 여부
- 과장 표현 및 확정적 문구 사용 여부
- 문제 → 대응 → 시사점 흐름 유지 여부
- 문의 문구(`digitalpresso@digitalpresso.ai`) 유지 여부

## 권장 작업 순서

1. 컨텍스트 문서 수정
2. `npm run lint` 실행
3. `auto_upload_draft` 또는 `test:notion-draft -- --dry-run`으로 샘플 검증
4. 필요 시 문구 재조정

