-- 아티클 고정(pin) 기능: 고정한 글을 카테고리 목록 최상단에 노출
-- pinned_at: null 이면 고정 안 됨. 값이 있으면 고정 시각이며, 여러 고정글은 최신 고정순으로 정렬.
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "pinned_at" timestamp with time zone;--> statement-breakpoint

-- 고정글 우선 정렬 성능을 위한 인덱스 (고정된 행만)
CREATE INDEX IF NOT EXISTS "articles_pinned_at_idx" ON "articles" ("pinned_at" DESC) WHERE "pinned_at" IS NOT NULL;
