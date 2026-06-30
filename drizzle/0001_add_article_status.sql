-- 아티클 임시저장(draft) / 게시(published) 상태 컬럼 추가
-- status: 'draft' = 임시저장(공개 안 됨), 'published' = 실서버 게시
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "published_at" timestamp with time zone;--> statement-breakpoint

-- 기존 아티클은 이미 공개돼 있던 것이므로 모두 published 로 백필 (사이트에서 사라지지 않도록)
UPDATE "articles" SET "status" = 'published', "published_at" = "created_at" WHERE "status" = 'draft';--> statement-breakpoint

-- 공개 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS "articles_status_idx" ON "articles" ("status");
