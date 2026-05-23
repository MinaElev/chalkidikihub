-- ════════════════════════════════════════════════════════════════════════
-- Migration 042: Public host pages
-- ════════════════════════════════════════════════════════════════════════
-- Adds public-facing fields to `profiles` so owners with ≥2 listings can
-- have a dedicated /host/[slug] page showing their portfolio + bio.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS public_page_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS public_display_name TEXT,
  ADD COLUMN IF NOT EXISTS public_email TEXT,
  ADD COLUMN IF NOT EXISTS public_phone TEXT,
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_website TEXT,
  ADD COLUMN IF NOT EXISTS bio_el TEXT,
  ADD COLUMN IF NOT EXISTS bio_en TEXT,
  ADD COLUMN IF NOT EXISTS bio_de TEXT,
  ADD COLUMN IF NOT EXISTS bio_bg TEXT,
  ADD COLUMN IF NOT EXISTS bio_ru TEXT,
  ADD COLUMN IF NOT EXISTS bio_ro TEXT,
  ADD COLUMN IF NOT EXISTS bio_sr TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_public_slug
  ON profiles(public_slug) WHERE public_slug IS NOT NULL;

-- ── Public read policy ───────────────────────────────────────────────────
-- The existing policy "Users can view their own profile" only lets users
-- read their OWN profile. We need a complementary policy so anonymous
-- visitors can read profiles flagged as public.
-- (RLS is permissive: ANY matching policy grants access.)
DROP POLICY IF EXISTS "Public host profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public host profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (public_page_enabled = true AND public_slug IS NOT NULL);
