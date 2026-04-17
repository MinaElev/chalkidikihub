-- ════════════════════════════════════════════════════════════════════════
-- Migration 029: "Temporarily closed" flag for listings
-- ════════════════════════════════════════════════════════════════════════
-- Lets owners mark a property as currently unavailable (seasonal closure,
-- renovation, personal reasons, …) without deleting or unpublishing it.
-- Default: is_closed = false (property is open).
-- When true, the public /stay page shows a closed-state banner; contact
-- actions and the availability calendar remain visible so guests can
-- still plan future stays.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS is_closed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reopening_date date,
  ADD COLUMN IF NOT EXISTS closed_reason_el text,
  ADD COLUMN IF NOT EXISTS closed_reason_en text,
  ADD COLUMN IF NOT EXISTS closed_reason_de text,
  ADD COLUMN IF NOT EXISTS closed_reason_bg text,
  ADD COLUMN IF NOT EXISTS closed_reason_ru text,
  ADD COLUMN IF NOT EXISTS closed_reason_ro text,
  ADD COLUMN IF NOT EXISTS closed_reason_sr text;

COMMENT ON COLUMN listings.is_closed IS
  'If true, the property is temporarily not accepting guests. The public pages show a closed-state banner. Different from status=draft which hides the listing entirely.';

COMMENT ON COLUMN listings.reopening_date IS
  'Optional date when the property re-opens. Shown to guests as "Reopening <date>". NULL = no known reopening date.';
