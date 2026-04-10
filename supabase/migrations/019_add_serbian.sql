-- Add Serbian (sr) language columns to all content tables

-- Areas
ALTER TABLE areas ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
ALTER TABLE areas ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';

-- Beaches
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Activities
ALTER TABLE activities ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Blog articles
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS title_sr TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS excerpt_sr TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS content_sr TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS title_sr TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Sales
ALTER TABLE sales ADD COLUMN IF NOT EXISTS title_sr TEXT DEFAULT '';
ALTER TABLE sales ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE sales ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE sales ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Villages
ALTER TABLE villages ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
ALTER TABLE villages ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE villages ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE villages ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Monasteries
ALTER TABLE monasteries ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
ALTER TABLE monasteries ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';
ALTER TABLE monasteries ADD COLUMN IF NOT EXISTS highlights_sr TEXT DEFAULT '';
ALTER TABLE monasteries ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE monasteries ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';

-- Reviews
ALTER TABLE beach_reviews ADD COLUMN IF NOT EXISTS comment_sr TEXT DEFAULT '';
ALTER TABLE restaurant_reviews ADD COLUMN IF NOT EXISTS comment_sr TEXT DEFAULT '';
ALTER TABLE activity_reviews ADD COLUMN IF NOT EXISTS comment_sr TEXT DEFAULT '';

-- Business types
ALTER TABLE business_types ADD COLUMN IF NOT EXISTS name_sr TEXT DEFAULT '';
