-- ════════════════════════════════════════════════════════════════════════
-- Migration 039: PMS global kill-switch (per owner)
-- ════════════════════════════════════════════════════════════════════════
-- A single ON/OFF toggle the owner controls from /dashboard/pms.
-- When pms_enabled = false:
--   • Public booking endpoints (quote/book/checkout) reject new reservations
--   • The /book/[slug] page surfaces the "not accepting bookings" state
--   • The PMS dashboard stays fully accessible (owner still manages past
--     bookings, messages, finance, etc.) but shows a prominent warning
-- Different from listings.is_closed which is per-property and guest-facing.
-- This is owner-wide and purely about whether the direct-booking funnel
-- should accept incoming traffic at all.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE pms_owner_settings
  ADD COLUMN IF NOT EXISTS pms_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN pms_owner_settings.pms_enabled IS
  'Owner-wide kill switch. When false, all public direct-booking endpoints reject new reservations for any listing owned by this account. Historical data and the dashboard remain accessible.';

NOTIFY pgrst, 'reload schema';
