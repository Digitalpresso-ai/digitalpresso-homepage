-- Supabase에서 실행하세요 (SQL Editor)
-- =====================================================

CREATE TABLE IF NOT EXISTS articles (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT        NOT NULL,
  content        TEXT        NOT NULL DEFAULT '',
  cover_img_url  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 로그인한 사용자만 전체 CRUD 가능
CREATE POLICY "Authenticated users can manage articles"
  ON articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 비로그인 사용자는 published 아티클만 조회 가능
CREATE POLICY "Public can read articles"
  ON articles FOR SELECT
  TO anon
  USING (true);

-- =====================================================
-- Article images (TipTap uploads)
CREATE TABLE IF NOT EXISTS article_images (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id) on delete cascade,
  image_url text not null,
  alt text,
  width integer,
  height integer,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS article_images_article_id_idx
  ON article_images (article_id);
CREATE INDEX IF NOT EXISTS article_images_sort_order_idx
  ON article_images (article_id, sort_order);

ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage article_images"
  ON article_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
