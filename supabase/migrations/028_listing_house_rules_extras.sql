-- ════════════════════════════════════════════════════════════════════════
-- Migration 028: House rules, practical info, photo captions, extras
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. listings: house rules + practical info columns ──────────────────
ALTER TABLE listings
  -- House rules (structured)
  ADD COLUMN IF NOT EXISTS check_in_time text,
  ADD COLUMN IF NOT EXISTS check_out_time text,
  ADD COLUMN IF NOT EXISTS rule_smoking text CHECK (rule_smoking IS NULL OR rule_smoking IN ('allowed','outside','not_allowed')),
  ADD COLUMN IF NOT EXISTS rule_pets text CHECK (rule_pets IS NULL OR rule_pets IN ('allowed','on_request','not_allowed')),
  ADD COLUMN IF NOT EXISTS rule_parties text CHECK (rule_parties IS NULL OR rule_parties IN ('allowed','not_allowed')),
  ADD COLUMN IF NOT EXISTS rule_kids text CHECK (rule_kids IS NULL OR rule_kids IN ('welcome','not_suitable','on_request')),
  ADD COLUMN IF NOT EXISTS quiet_hours_from text,
  ADD COLUMN IF NOT EXISTS quiet_hours_to text,
  -- Free-text extras per locale
  ADD COLUMN IF NOT EXISTS house_rules_extra_el text,
  ADD COLUMN IF NOT EXISTS house_rules_extra_en text,
  ADD COLUMN IF NOT EXISTS house_rules_extra_de text,
  ADD COLUMN IF NOT EXISTS house_rules_extra_bg text,
  ADD COLUMN IF NOT EXISTS house_rules_extra_ru text,
  ADD COLUMN IF NOT EXISTS house_rules_extra_ro text,
  ADD COLUMN IF NOT EXISTS house_rules_extra_sr text,
  -- Practical info — how to reach
  ADD COLUMN IF NOT EXISTS how_to_reach_el text,
  ADD COLUMN IF NOT EXISTS how_to_reach_en text,
  ADD COLUMN IF NOT EXISTS how_to_reach_de text,
  ADD COLUMN IF NOT EXISTS how_to_reach_bg text,
  ADD COLUMN IF NOT EXISTS how_to_reach_ru text,
  ADD COLUMN IF NOT EXISTS how_to_reach_ro text,
  ADD COLUMN IF NOT EXISTS how_to_reach_sr text,
  -- Practical info — Wi-Fi / network
  ADD COLUMN IF NOT EXISTS wifi_info_el text,
  ADD COLUMN IF NOT EXISTS wifi_info_en text,
  ADD COLUMN IF NOT EXISTS wifi_info_de text,
  ADD COLUMN IF NOT EXISTS wifi_info_bg text,
  ADD COLUMN IF NOT EXISTS wifi_info_ru text,
  ADD COLUMN IF NOT EXISTS wifi_info_ro text,
  ADD COLUMN IF NOT EXISTS wifi_info_sr text,
  -- Practical info — parking
  ADD COLUMN IF NOT EXISTS parking_info_el text,
  ADD COLUMN IF NOT EXISTS parking_info_en text,
  ADD COLUMN IF NOT EXISTS parking_info_de text,
  ADD COLUMN IF NOT EXISTS parking_info_bg text,
  ADD COLUMN IF NOT EXISTS parking_info_ru text,
  ADD COLUMN IF NOT EXISTS parking_info_ro text,
  ADD COLUMN IF NOT EXISTS parking_info_sr text,
  -- Practical info — check-in instructions
  ADD COLUMN IF NOT EXISTS check_in_info_el text,
  ADD COLUMN IF NOT EXISTS check_in_info_en text,
  ADD COLUMN IF NOT EXISTS check_in_info_de text,
  ADD COLUMN IF NOT EXISTS check_in_info_bg text,
  ADD COLUMN IF NOT EXISTS check_in_info_ru text,
  ADD COLUMN IF NOT EXISTS check_in_info_ro text,
  ADD COLUMN IF NOT EXISTS check_in_info_sr text;

-- ── 2. listing_images: captions ─────────────────────────────────────────
ALTER TABLE listing_images
  ADD COLUMN IF NOT EXISTS caption_el text,
  ADD COLUMN IF NOT EXISTS caption_en text,
  ADD COLUMN IF NOT EXISTS caption_de text,
  ADD COLUMN IF NOT EXISTS caption_bg text,
  ADD COLUMN IF NOT EXISTS caption_ru text,
  ADD COLUMN IF NOT EXISTS caption_ro text,
  ADD COLUMN IF NOT EXISTS caption_sr text;

-- ── 3. listing_extras — owner-priced add-ons (breakfast, transfer…) ────
CREATE TABLE IF NOT EXISTS listing_extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  icon_key text NOT NULL DEFAULT 'sparkle',  -- breakfast, transfer, cleaning, spa, bike, boat…
  price numeric,
  currency text NOT NULL DEFAULT 'EUR',
  price_unit text,  -- 'per_stay', 'per_night', 'per_day', 'per_person', 'per_use'
  included boolean NOT NULL DEFAULT false,  -- true = free / already included
  label_el text, label_en text, label_de text, label_bg text,
  label_ru text, label_ro text, label_sr text,
  description_el text, description_en text, description_de text, description_bg text,
  description_ru text, description_ro text, description_sr text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_extras_listing
  ON listing_extras(listing_id, sort_order);

ALTER TABLE listing_extras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "extras_public_read" ON listing_extras;
CREATE POLICY "extras_public_read"
  ON listing_extras FOR SELECT USING (true);

DROP POLICY IF EXISTS "extras_owner_write" ON listing_extras;
CREATE POLICY "extras_owner_write"
  ON listing_extras FOR ALL
  USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_extras.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_extras.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  );

DROP TRIGGER IF EXISTS trg_listing_extras_touch ON listing_extras;
CREATE TRIGGER trg_listing_extras_touch
  BEFORE UPDATE ON listing_extras
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
