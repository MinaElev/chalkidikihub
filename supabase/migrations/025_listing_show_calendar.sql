-- ════════════════════════════════════════════════════════════════════════
-- Migration 025: Listings — show_calendar toggle
-- ════════════════════════════════════════════════════════════════════════
-- Owner controls whether the availability calendar is shown on the
-- public listing page. Default = false (hidden) so existing listings
-- are not affected unless the owner explicitly opts in.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS show_calendar boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN listings.show_calendar IS
  'If true, the availability calendar is displayed on the public listing page.';
