-- ============================================
-- BEACHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS beaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_el TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  name_de TEXT DEFAULT '',
  name_bg TEXT DEFAULT '',
  name_ru TEXT DEFAULT '',
  name_ro TEXT DEFAULT '',
  description_el TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_de TEXT DEFAULT '',
  description_bg TEXT DEFAULT '',
  description_ru TEXT DEFAULT '',
  description_ro TEXT DEFAULT '',
  area TEXT NOT NULL CHECK (area IN ('kassandra', 'sithonia', 'athos', 'mainland')),
  location_name TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION DEFAULT 0,
  longitude DOUBLE PRECISION DEFAULT 0,
  image_url TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE beaches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Beaches are viewable by everyone" ON beaches FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage beaches" ON beaches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- BEACH REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS beach_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beach_id UUID NOT NULL REFERENCES beaches(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment_el TEXT DEFAULT '',
  comment_en TEXT DEFAULT '',
  comment_de TEXT DEFAULT '',
  comment_bg TEXT DEFAULT '',
  comment_ru TEXT DEFAULT '',
  comment_ro TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE beach_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Beach reviews are viewable by everyone" ON beach_reviews FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage beach reviews" ON beach_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- RESTAURANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_el TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  name_de TEXT DEFAULT '',
  name_bg TEXT DEFAULT '',
  name_ru TEXT DEFAULT '',
  name_ro TEXT DEFAULT '',
  description_el TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_de TEXT DEFAULT '',
  description_bg TEXT DEFAULT '',
  description_ru TEXT DEFAULT '',
  description_ro TEXT DEFAULT '',
  area TEXT NOT NULL CHECK (area IN ('kassandra', 'sithonia', 'athos', 'mainland')),
  location_name TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION DEFAULT 0,
  longitude DOUBLE PRECISION DEFAULT 0,
  image_url TEXT DEFAULT '',
  cuisine JSONB DEFAULT '[]',
  price_level TEXT DEFAULT 'moderate',
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  phone TEXT DEFAULT '',
  hours TEXT DEFAULT '',
  has_sea_view BOOLEAN DEFAULT false,
  has_live_music BOOLEAN DEFAULT false,
  accepts_reservations BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurants are viewable by everyone" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage restaurants" ON restaurants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- RESTAURANT REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment_el TEXT DEFAULT '',
  comment_en TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE restaurant_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurant reviews are viewable by everyone" ON restaurant_reviews FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage restaurant reviews" ON restaurant_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_el TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  name_de TEXT DEFAULT '',
  name_bg TEXT DEFAULT '',
  name_ru TEXT DEFAULT '',
  name_ro TEXT DEFAULT '',
  description_el TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_de TEXT DEFAULT '',
  description_bg TEXT DEFAULT '',
  description_ru TEXT DEFAULT '',
  description_ro TEXT DEFAULT '',
  area TEXT NOT NULL CHECK (area IN ('kassandra', 'sithonia', 'athos', 'mainland')),
  location_name TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION DEFAULT 0,
  longitude DOUBLE PRECISION DEFAULT 0,
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'nature',
  price_range TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities are viewable by everyone" ON activities FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage activities" ON activities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- ACTIVITY REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment_el TEXT DEFAULT '',
  comment_en TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE activity_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activity reviews are viewable by everyone" ON activity_reviews FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage activity reviews" ON activity_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- BLOG ARTICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_el TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_de TEXT DEFAULT '',
  title_bg TEXT DEFAULT '',
  title_ru TEXT DEFAULT '',
  title_ro TEXT DEFAULT '',
  excerpt_el TEXT DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  content_el TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  content_de TEXT DEFAULT '',
  content_bg TEXT DEFAULT '',
  content_ru TEXT DEFAULT '',
  content_ro TEXT DEFAULT '',
  category TEXT DEFAULT 'guides',
  image_url TEXT DEFAULT '',
  author TEXT DEFAULT 'Halkidiki Hub',
  read_time_min INTEGER DEFAULT 5,
  tags JSONB DEFAULT '[]',
  related_area_slugs JSONB DEFAULT '[]',
  related_beach_slugs JSONB DEFAULT '[]',
  related_listing_slugs JSONB DEFAULT '[]',
  related_article_slugs JSONB DEFAULT '[]',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blog articles are viewable by everyone" ON blog_articles FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage blog articles" ON blog_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER beaches_updated_at BEFORE UPDATE ON beaches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blog_articles_updated_at BEFORE UPDATE ON blog_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
