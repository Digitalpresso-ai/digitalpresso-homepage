-- Supabase에서 실행하세요 (SQL Editor)
-- =====================================================

CREATE TABLE IF NOT EXISTS articles (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT        NOT NULL,
  slug           TEXT        NOT NULL UNIQUE,
  content        TEXT        NOT NULL DEFAULT '',
  excerpt        TEXT,
  category       TEXT        NOT NULL DEFAULT 'news',
  status         TEXT        NOT NULL DEFAULT 'draft'
                             CHECK (status IN ('draft', 'published')),
  cover_image_url TEXT,
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status);
CREATE INDEX IF NOT EXISTS articles_slug_idx   ON articles (slug);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (published_at DESC);

-- RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 로그인한 사용자만 전체 CRUD 가능
CREATE POLICY "Authenticated users can manage articles"
  ON articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 비로그인 사용자는 published 아티클만 조회 가능
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  TO anon
  USING (status = 'published');
