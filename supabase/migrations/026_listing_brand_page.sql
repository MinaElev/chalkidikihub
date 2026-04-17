-- ════════════════════════════════════════════════════════════════════════
-- Migration 026: Listing "brand page" content
-- ════════════════════════════════════════════════════════════════════════
-- Tier-1 fields for richer public listing pages:
--   · tagline_{locale}        — short hook ~60 chars shown in hero
--   · owner_story_{locale}    — "Η ιστορία μας" section (markdown/plain)
--   · listing_faqs             — per-listing custom Q&A (FAQPage schema)
--   · listing_nearby_overrides — owner can hide / reorder / annotate the
--                                auto-suggested nearby POIs
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Tagline + owner story columns ─────────────────────────────────────
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS tagline_el text,
  ADD COLUMN IF NOT EXISTS tagline_en text,
  ADD COLUMN IF NOT EXISTS tagline_de text,
  ADD COLUMN IF NOT EXISTS tagline_bg text,
  ADD COLUMN IF NOT EXISTS tagline_ru text,
  ADD COLUMN IF NOT EXISTS tagline_ro text,
  ADD COLUMN IF NOT EXISTS tagline_sr text,
  ADD COLUMN IF NOT EXISTS owner_story_el text,
  ADD COLUMN IF NOT EXISTS owner_story_en text,
  ADD COLUMN IF NOT EXISTS owner_story_de text,
  ADD COLUMN IF NOT EXISTS owner_story_bg text,
  ADD COLUMN IF NOT EXISTS owner_story_ru text,
  ADD COLUMN IF NOT EXISTS owner_story_ro text,
  ADD COLUMN IF NOT EXISTS owner_story_sr text;

-- ── 2. Custom FAQs table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  question_el text, answer_el text,
  question_en text, answer_en text,
  question_de text, answer_de text,
  question_bg text, answer_bg text,
  question_ru text, answer_ru text,
  question_ro text, answer_ro text,
  question_sr text, answer_sr text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_faqs_listing
  ON listing_faqs(listing_id, sort_order);

ALTER TABLE listing_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faqs_public_read" ON listing_faqs;
CREATE POLICY "faqs_public_read"
  ON listing_faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "faqs_owner_write" ON listing_faqs;
CREATE POLICY "faqs_owner_write"
  ON listing_faqs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_faqs.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_faqs.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  );

-- ── 3. Nearby overrides (owner can hide / re-sort / annotate) ───────────
CREATE TABLE IF NOT EXISTS listing_nearby_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('beach','restaurant','activity','village')),
  entity_id uuid NOT NULL,
  is_hidden boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  note_el text, note_en text, note_de text, note_bg text, note_ru text, note_ro text, note_sr text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(listing_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_nearby_listing
  ON listing_nearby_overrides(listing_id);

ALTER TABLE listing_nearby_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nearby_public_read" ON listing_nearby_overrides;
CREATE POLICY "nearby_public_read"
  ON listing_nearby_overrides FOR SELECT USING (true);

DROP POLICY IF EXISTS "nearby_owner_write" ON listing_nearby_overrides;
CREATE POLICY "nearby_owner_write"
  ON listing_nearby_overrides FOR ALL
  USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_nearby_overrides.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_nearby_overrides.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  );

-- ── 4. updated_at triggers (reuse existing function if present) ─────────
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listing_faqs_touch ON listing_faqs;
CREATE TRIGGER trg_listing_faqs_touch BEFORE UPDATE ON listing_faqs
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_listing_nearby_overrides_touch ON listing_nearby_overrides;
CREATE TRIGGER trg_listing_nearby_overrides_touch BEFORE UPDATE ON listing_nearby_overrides
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
