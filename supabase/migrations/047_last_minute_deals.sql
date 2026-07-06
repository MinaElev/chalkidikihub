-- ════════════════════════════════════════════════════════════════════════
-- Migration 047: Last-Minute Deals (cancellation openings)
-- ════════════════════════════════════════════════════════════════════════
-- Owners publish short-lived availability that opened up from a cancellation.
-- Each row is one opening for one listing (room) over a date range. These are
-- surfaced in a homepage popup (read directly from the browser via the anon
-- key + RLS — no Next.js/Vercel compute) and auto-posted to Facebook by a
-- Supabase Edge Function triggered on INSERT (see supabase/functions/fb-post-deal).
--
-- No price/discount is stored — the deal only advertises free dates. The
-- listing already carries its own price_per_night.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS last_minute_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  -- Denormalised so RLS + the FB webhook don't have to join listings on every row.
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  note text,                                  -- optional owner blurb (any language)
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'cancelled')),
  -- Set by the Edge Function once the FB post succeeds (idempotency guard too).
  fb_post_id text,
  fb_posted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_lmd_listing ON last_minute_deals(listing_id);
CREATE INDEX IF NOT EXISTS idx_lmd_owner ON last_minute_deals(owner_id);
-- Powers the homepage popup query: active deals that haven't ended yet.
CREATE INDEX IF NOT EXISTS idx_lmd_active_window
  ON last_minute_deals(end_date) WHERE status = 'active';

-- ── RLS ─────────────────────────────────────────────────────────────────
ALTER TABLE last_minute_deals ENABLE ROW LEVEL SECURITY;

-- Public: read only *active*, non-expired deals (drives the homepage popup).
DROP POLICY IF EXISTS "lmd_public_read" ON last_minute_deals;
CREATE POLICY "lmd_public_read"
  ON last_minute_deals FOR SELECT
  USING (status = 'active' AND end_date >= current_date);

-- Owner (or admin): full read/write on their own rows.
--   USING       → which existing rows they may see/update/delete
--   WITH CHECK  → which rows they may write. We verify the *listing* is theirs
--                 (not just owner_id = auth.uid()) so an owner can't advertise
--                 someone else's listing by forging owner_id.
DROP POLICY IF EXISTS "lmd_owner_all" ON last_minute_deals;
CREATE POLICY "lmd_owner_all"
  ON last_minute_deals FOR ALL
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = last_minute_deals.listing_id
      AND listings.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Auto-update updated_at (reuse pattern from listing_availability).
CREATE OR REPLACE FUNCTION update_last_minute_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lmd_updated_at ON last_minute_deals;
CREATE TRIGGER trg_lmd_updated_at
  BEFORE UPDATE ON last_minute_deals
  FOR EACH ROW
  EXECUTE FUNCTION update_last_minute_deals_updated_at();
