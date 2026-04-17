-- ════════════════════════════════════════════════════════════════════════
-- Migration 024: Listing Availability Calendar
-- ════════════════════════════════════════════════════════════════════════
-- Owners can mark dates as 'blocked' (self-managed unavailability) or
-- 'booked' (actual reservation). If no row exists for a date, it's
-- considered available.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS listing_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'blocked' CHECK (status IN ('blocked', 'booked')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(listing_id, date)
);

CREATE INDEX IF NOT EXISTS idx_listing_availability_listing_date
  ON listing_availability(listing_id, date);

CREATE INDEX IF NOT EXISTS idx_listing_availability_date
  ON listing_availability(date);

-- RLS
ALTER TABLE listing_availability ENABLE ROW LEVEL SECURITY;

-- Anyone can READ availability (to show on public listing pages)
DROP POLICY IF EXISTS "availability_public_read" ON listing_availability;
CREATE POLICY "availability_public_read"
  ON listing_availability FOR SELECT
  USING (true);

-- Only the listing owner (or admin) can INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "availability_owner_write" ON listing_availability;
CREATE POLICY "availability_owner_write"
  ON listing_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_availability.listing_id
      AND listings.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_availability.listing_id
      AND listings.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_listing_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listing_availability_updated_at ON listing_availability;
CREATE TRIGGER trg_listing_availability_updated_at
  BEFORE UPDATE ON listing_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_availability_updated_at();
