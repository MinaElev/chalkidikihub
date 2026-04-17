-- Track Social Media Kit ZIP downloads for admin analytics.
-- One row per user-click on "Κατέβασε όλο το kit" button.

CREATE TABLE IF NOT EXISTS social_kit_downloads (
  id          BIGSERIAL PRIMARY KEY,
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS social_kit_downloads_listing_idx ON social_kit_downloads (listing_id);
CREATE INDEX IF NOT EXISTS social_kit_downloads_user_idx    ON social_kit_downloads (user_id);
CREATE INDEX IF NOT EXISTS social_kit_downloads_created_idx ON social_kit_downloads (created_at DESC);

ALTER TABLE social_kit_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone logged-in can insert a download event (only for themselves).
CREATE POLICY "users can log their own download"
  ON social_kit_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Only admins (role='admin' in profiles) can read the table.
CREATE POLICY "only admins can read downloads"
  ON social_kit_downloads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

NOTIFY pgrst, 'reload schema';
