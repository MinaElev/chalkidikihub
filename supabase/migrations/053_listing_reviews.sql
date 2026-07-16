-- Guest reviews for accommodation listings — same pattern as beach/restaurant/
-- activity reviews (003 + 012), but SELECT is restricted to approved rows from
-- day one so pending/rejected reviews never leak to the public API.
CREATE TABLE IF NOT EXISTS listing_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment_el TEXT DEFAULT '',
  comment_en TEXT DEFAULT '',
  comment_de TEXT DEFAULT '',
  comment_bg TEXT DEFAULT '',
  comment_ru TEXT DEFAULT '',
  comment_ro TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_reviews_listing_id ON listing_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reviews_status ON listing_reviews(status);

ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved listing reviews are viewable by everyone" ON listing_reviews
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Superadmin can manage listing reviews" ON listing_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- Aggregate columns on listings, kept in sync by the admin moderation endpoint
-- (same recalculation flow as beaches/restaurants/activities). Feed the
-- LodgingBusiness aggregateRating in JSON-LD.
ALTER TABLE listings ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
