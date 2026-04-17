-- ════════════════════════════════════════════════════════════════════════
-- Migration 030: listings.image_alt_{locale}
-- ════════════════════════════════════════════════════════════════════════
-- The single image_alt column (added in 021) wasn't localised. The rest of
-- the SEO surface is multi-language, so the admin brand editor now needs
-- per-locale alt text. Existing content in image_alt is backfilled into
-- image_alt_el.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS image_alt_el text,
  ADD COLUMN IF NOT EXISTS image_alt_en text,
  ADD COLUMN IF NOT EXISTS image_alt_de text,
  ADD COLUMN IF NOT EXISTS image_alt_bg text,
  ADD COLUMN IF NOT EXISTS image_alt_ru text,
  ADD COLUMN IF NOT EXISTS image_alt_ro text,
  ADD COLUMN IF NOT EXISTS image_alt_sr text;

-- One-time backfill of existing non-empty image_alt into image_alt_el
UPDATE listings
SET image_alt_el = image_alt
WHERE image_alt_el IS NULL
  AND image_alt IS NOT NULL
  AND image_alt <> '';
