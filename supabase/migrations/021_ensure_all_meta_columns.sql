-- Ensure ALL tables have meta_title/meta_description in ALL 7 languages + image_alt
-- Some tables were created before meta columns were standard

-- LISTINGS (was missing meta columns entirely)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_el TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_en TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_de TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_bg TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_ru TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_ro TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_el TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_en TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_de TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_bg TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_ru TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_ro TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS title_sr TEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS description_sr TEXT DEFAULT '';

-- BEACHES (ensure all meta + sr)
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_el TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_en TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_de TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_bg TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_ru TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_ro TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_el TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_en TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_de TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_bg TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_ru TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_ro TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';
ALTER TABLE beaches ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT '';

-- RESTAURANTS
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_el TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_en TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_de TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_bg TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_ru TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_ro TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_el TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_en TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_de TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_bg TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_ru TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_ro TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT '';

-- ACTIVITIES
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_el TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_en TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_de TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_bg TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_ru TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_ro TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_el TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_en TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_de TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_bg TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_ru TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_ro TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT '';

-- BLOG_ARTICLES
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_el TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_en TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_de TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_bg TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_ru TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_ro TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_title_sr TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_el TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_en TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_de TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_bg TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_ru TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_ro TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS meta_description_sr TEXT DEFAULT '';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT '';
