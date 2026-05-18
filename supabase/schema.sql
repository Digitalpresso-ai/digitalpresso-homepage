-- Supabase에서 실행하세요 (SQL Editor)
-- =====================================================

CREATE TABLE IF NOT EXISTS articles (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT        NOT NULL,
  title_en       TEXT        NOT NULL DEFAULT '',
  title_ja       TEXT        NOT NULL DEFAULT '',
  content        TEXT        NOT NULL DEFAULT '',
  content_en     TEXT        NOT NULL DEFAULT '',
  content_ja     TEXT        NOT NULL DEFAULT '',
  cover_img_url  TEXT,
  category       TEXT        NOT NULL DEFAULT 'company',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles (category);

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

-- =====================================================
-- Storage bucket: article-images
-- 먼저 Supabase Dashboard > Storage 에서 'article-images' 버킷을 생성하고 Public 으로 설정하세요.
-- 그 다음 아래 정책을 실행해 storage.objects RLS 를 설정합니다.

CREATE POLICY "Public can read article-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can update article-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'article-images')
  WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can delete article-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'article-images');
