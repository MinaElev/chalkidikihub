-- Add status + user_id to existing review tables
ALTER TABLE beach_reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE beach_reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE restaurant_reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE restaurant_reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE activity_reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE activity_reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_article ON blog_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS: anyone can read approved
CREATE POLICY "Public read approved comments" ON blog_comments FOR SELECT USING (status = 'approved');
-- Authenticated users can insert pending
CREATE POLICY "Auth users insert comments" ON blog_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');
-- Superadmin full access
CREATE POLICY "Superadmin full comments" ON blog_comments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Update RLS on review tables: allow authenticated INSERT with pending status
CREATE POLICY "Auth users insert beach reviews" ON beach_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');
CREATE POLICY "Auth users insert restaurant reviews" ON restaurant_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');
CREATE POLICY "Auth users insert activity reviews" ON activity_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');
