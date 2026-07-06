-- ════════════════════════════════════════════════════════════════════════
-- Migration 048: Last-Minute Deals — Make.com / Facebook payload fields
-- ════════════════════════════════════════════════════════════════════════
-- We post new deals to Facebook via Make.com (Supabase DB Webhook → Make
-- webhook → Facebook module), not via an Edge Function. The DB webhook only
-- ships the inserted `last_minute_deals` row, so we denormalise everything the
-- Make scenario needs at insert time — a ready-to-post caption, the listing
-- URL, and the cover image. That keeps the Make scenario trivial (no extra
-- Supabase lookup, no service-role key in Make).
--
-- `fb_post_id` / `fb_posted_at` already exist from migration 047; Make can
-- optionally write `fb_post_id` back, but it isn't required.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE last_minute_deals
  ADD COLUMN IF NOT EXISTS fb_message text,   -- ready-to-post caption (built client-side)
  ADD COLUMN IF NOT EXISTS fb_link text,      -- absolute URL of the listing page
  ADD COLUMN IF NOT EXISTS image_url text;    -- cover image (for an optional photo post)
