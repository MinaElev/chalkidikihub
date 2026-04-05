-- User submissions table for restaurants, activities, blog suggestions
CREATE TABLE IF NOT EXISTS user_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'activity', 'blog')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_el TEXT,
  title_en TEXT,
  description_el TEXT,
  description_en TEXT,
  area TEXT,
  location_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  category TEXT,
  extra_data JSONB DEFAULT '{}',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_submissions_user ON user_submissions(user_id);
CREATE INDEX idx_submissions_status ON user_submissions(status);
CREATE INDEX idx_submissions_type ON user_submissions(type);

-- Enable RLS
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

-- Users can see their own submissions
CREATE POLICY "Users can view own submissions"
  ON user_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can create submissions"
  ON user_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions"
  ON user_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Users can delete their own pending submissions
CREATE POLICY "Users can delete own pending submissions"
  ON user_submissions FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Superadmin full access
CREATE POLICY "Superadmin full access on submissions"
  ON user_submissions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
  );

-- Create storage bucket for submission images
INSERT INTO storage.buckets (id, name, public) VALUES ('submission-images', 'submission-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: authenticated users can upload to their own folder
CREATE POLICY "Users can upload submission images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submission-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Public read access for submission images
CREATE POLICY "Public read submission images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'submission-images');

-- Superadmin can delete submission images
CREATE POLICY "Superadmin delete submission images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'submission-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));
