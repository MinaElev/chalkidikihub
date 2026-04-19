-- =====================================================================
-- PMS — Per-listing setting overrides
-- =====================================================================
-- Owner defaults live in pms_owner_settings (one row per owner). This
-- table stores *overrides* at the listing level: a NULL value means
-- "inherit from owner". We only mirror the fields that genuinely vary
-- listing-by-listing (times, min/max nights, prep buffer, cancellation,
-- deposit, cleaning cost). Tax/Stripe/notifications stay owner-wide.
-- =====================================================================

CREATE TABLE IF NOT EXISTS pms_listing_settings (
  listing_id              UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  owner_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Booking policies (all nullable → inherit from owner defaults)
  instant_book            BOOLEAN,
  min_nights              INT,
  max_nights              INT,
  advance_notice_hours    INT,
  preparation_days        INT,
  checkin_time            TEXT,
  checkout_time           TEXT,

  -- Cancellation
  cancellation_policy     TEXT
                          CHECK (cancellation_policy IS NULL OR cancellation_policy IN ('flexible','moderate','strict','custom')),
  cancellation_policy_text TEXT,

  -- Payments
  deposit_percentage      INT,
  balance_due_days_before INT,

  -- Cleaning auto-task overrides
  cleaning_default_cost   NUMERIC(10,2),
  cleaning_lead_days      INT,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_listing_settings_owner_idx ON pms_listing_settings (owner_id);

ALTER TABLE pms_listing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner manages own listing settings" ON pms_listing_settings
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "admin reads all listing settings" ON pms_listing_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP TRIGGER IF EXISTS pms_listing_settings_touch ON pms_listing_settings;
CREATE TRIGGER pms_listing_settings_touch
  BEFORE UPDATE ON pms_listing_settings
  FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();
