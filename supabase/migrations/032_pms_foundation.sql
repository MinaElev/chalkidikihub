-- =====================================================================
-- PMS (Property Management System) — Foundation tables
-- =====================================================================
-- Establishes the core schema that all PMS features will build on:
-- bookings, calendar feeds, messages, pricing rules, templates, tasks.
-- Every table is owner-scoped via listings.owner_id + RLS.
-- =====================================================================

-- ─── 1. pms_bookings ─────────────────────────────────────────────────
-- Single source of truth for every reservation — direct, channel-synced,
-- or a manual block. Used by calendar, inbox, pricing, finance.
CREATE TABLE IF NOT EXISTS pms_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  status          TEXT NOT NULL DEFAULT 'inquiry'
                  CHECK (status IN ('inquiry','pending','confirmed','checked_in','checked_out','cancelled','blocked')),
  source          TEXT NOT NULL DEFAULT 'direct'
                  CHECK (source IN ('direct','airbnb','booking','vrbo','manual','blocked','other')),
  external_id     TEXT,   -- UID from external iCal / channel API

  -- Guest details (nullable when source='blocked' for owner-blocked dates)
  guest_name      TEXT,
  guest_email     TEXT,
  guest_phone     TEXT,
  guest_country   TEXT,
  num_guests      INT DEFAULT 1,
  num_adults      INT DEFAULT 1,
  num_children    INT DEFAULT 0,

  check_in        DATE NOT NULL,
  check_out       DATE NOT NULL,

  -- Financials (in listing's currency; default EUR)
  currency        TEXT DEFAULT 'EUR',
  nightly_rate    NUMERIC(10,2),
  cleaning_fee    NUMERIC(10,2) DEFAULT 0,
  taxes           NUMERIC(10,2) DEFAULT 0,
  total_amount    NUMERIC(10,2),
  payment_status  TEXT DEFAULT 'unpaid'
                  CHECK (payment_status IN ('unpaid','deposit_paid','fully_paid','refunded','na')),
  stripe_payment_intent_id TEXT,

  notes           TEXT,
  block_reason    TEXT,   -- when status='blocked': "maintenance", "personal use", …

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT check_out_after_check_in CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS pms_bookings_listing_idx   ON pms_bookings (listing_id);
CREATE INDEX IF NOT EXISTS pms_bookings_owner_idx     ON pms_bookings (owner_id);
CREATE INDEX IF NOT EXISTS pms_bookings_dates_idx     ON pms_bookings (listing_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS pms_bookings_external_idx  ON pms_bookings (source, external_id);

ALTER TABLE pms_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner reads own bookings" ON pms_bookings
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "owner writes own bookings" ON pms_bookings
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "admin reads all bookings" ON pms_bookings
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));


-- ─── 2. pms_ical_feeds ───────────────────────────────────────────────
-- iCal URLs the owner has connected (Airbnb, Booking, VRBO, custom).
-- We also generate our own export URL per listing (stored/computed).
CREATE TABLE IF NOT EXISTS pms_ical_feeds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  source          TEXT NOT NULL
                  CHECK (source IN ('airbnb','booking','vrbo','custom')),
  label           TEXT NOT NULL,              -- owner-provided name
  import_url      TEXT NOT NULL,              -- external iCal URL we pull FROM
  active          BOOLEAN DEFAULT TRUE,

  last_synced_at  TIMESTAMPTZ,
  last_sync_status TEXT,                      -- 'ok' | 'error' | 'pending'
  last_sync_error TEXT,
  events_imported INT DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_ical_feeds_listing_idx ON pms_ical_feeds (listing_id);
CREATE INDEX IF NOT EXISTS pms_ical_feeds_owner_idx   ON pms_ical_feeds (owner_id);

ALTER TABLE pms_ical_feeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own feeds" ON pms_ical_feeds
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ─── 3. pms_messages ─────────────────────────────────────────────────
-- Unified inbox. One thread per booking (or per guest_email if no booking).
CREATE TABLE IF NOT EXISTS pms_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id      UUID REFERENCES pms_bookings(id) ON DELETE SET NULL,

  direction       TEXT NOT NULL CHECK (direction IN ('inbound','outbound','system')),
  channel         TEXT NOT NULL DEFAULT 'direct'
                  CHECK (channel IN ('direct','email','whatsapp','airbnb','booking','system')),

  guest_name      TEXT,
  guest_email     TEXT,
  subject         TEXT,
  body            TEXT NOT NULL,
  body_html       TEXT,

  is_automated    BOOLEAN DEFAULT FALSE,
  template_id     UUID,   -- FK added after templates table below
  read_at         TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_messages_listing_idx ON pms_messages (listing_id);
CREATE INDEX IF NOT EXISTS pms_messages_owner_idx   ON pms_messages (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pms_messages_booking_idx ON pms_messages (booking_id);

ALTER TABLE pms_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner reads own messages" ON pms_messages
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ─── 4. pms_message_templates ────────────────────────────────────────
-- Reusable templates with triggers. Each template stores body per locale
-- (JSONB: { "el": "...", "en": "...", ... }).
CREATE TABLE IF NOT EXISTS pms_message_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name            TEXT NOT NULL,              -- "Welcome message"
  trigger         TEXT NOT NULL DEFAULT 'manual'
                  CHECK (trigger IN ('manual','on_inquiry','on_book','3days_before','1day_before','on_checkin','on_checkout','7days_after','on_cancel')),

  subject_locales JSONB DEFAULT '{}'::jsonb,  -- { "el": "...", "en": "..." }
  body_locales    JSONB NOT NULL DEFAULT '{}'::jsonb,

  active          BOOLEAN DEFAULT TRUE,
  listing_ids     UUID[],                     -- NULL = apply to all listings

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_message_templates_owner_idx ON pms_message_templates (owner_id);

ALTER TABLE pms_message_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own templates" ON pms_message_templates
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

ALTER TABLE pms_messages ADD CONSTRAINT pms_messages_template_fk
  FOREIGN KEY (template_id) REFERENCES pms_message_templates(id) ON DELETE SET NULL;


-- ─── 5. pms_pricing_rules ────────────────────────────────────────────
-- Rate overrides: seasonal, weekend premium, LOS discount, last-minute.
-- Highest priority wins; base rate comes from listings.price_per_night.
CREATE TABLE IF NOT EXISTS pms_pricing_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name            TEXT NOT NULL,
  rule_type       TEXT NOT NULL
                  CHECK (rule_type IN ('seasonal','weekend','los_discount','last_minute','custom')),

  -- Seasonal: applies between dates
  start_date      DATE,
  end_date        DATE,
  -- Weekend: applies to these weekdays (0=Sun..6=Sat)
  weekdays        INT[],
  -- LOS discount: applies when stay >= min_nights
  min_nights      INT,
  -- Last-minute: applies when booking_date is >= days_before check-in
  days_before     INT,

  -- The actual adjustment
  amount          NUMERIC(10,2) NOT NULL,
  is_percentage   BOOLEAN DEFAULT FALSE,       -- true → amount is %, false → absolute
  operation       TEXT DEFAULT 'override'
                  CHECK (operation IN ('override','add','subtract','multiply')),

  priority        INT DEFAULT 100,
  active          BOOLEAN DEFAULT TRUE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_pricing_rules_listing_idx ON pms_pricing_rules (listing_id);

ALTER TABLE pms_pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own pricing rules" ON pms_pricing_rules
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ─── 6. pms_tasks ────────────────────────────────────────────────────
-- Cleaning & maintenance scheduled around bookings.
CREATE TABLE IF NOT EXISTS pms_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id      UUID REFERENCES pms_bookings(id) ON DELETE SET NULL,

  task_type       TEXT NOT NULL DEFAULT 'cleaning'
                  CHECK (task_type IN ('cleaning','maintenance','inspection','linen','checkin','checkout','custom')),
  title           TEXT NOT NULL,
  description     TEXT,

  assignee_name   TEXT,
  assignee_phone  TEXT,
  assignee_email  TEXT,

  scheduled_at    TIMESTAMPTZ NOT NULL,
  completed_at    TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','in_progress','completed','cancelled','skipped')),

  cost            NUMERIC(10,2),
  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_tasks_listing_idx    ON pms_tasks (listing_id);
CREATE INDEX IF NOT EXISTS pms_tasks_schedule_idx   ON pms_tasks (owner_id, scheduled_at);

ALTER TABLE pms_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own tasks" ON pms_tasks
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ─── 7. pms_owner_settings ───────────────────────────────────────────
-- Per-owner PMS preferences: booking policies, tax settings, bank info.
CREATE TABLE IF NOT EXISTS pms_owner_settings (
  owner_id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Booking policies (defaults, can be overridden per listing later)
  instant_book            BOOLEAN DEFAULT FALSE,
  min_nights_default      INT DEFAULT 1,
  max_nights_default      INT,
  advance_notice_hours    INT DEFAULT 24,
  preparation_days        INT DEFAULT 0,      -- buffer between bookings
  checkin_time            TEXT DEFAULT '15:00',
  checkout_time           TEXT DEFAULT '11:00',

  -- Cancellation policy
  cancellation_policy     TEXT DEFAULT 'moderate'
                          CHECK (cancellation_policy IN ('flexible','moderate','strict','custom')),
  cancellation_policy_text TEXT,

  -- Payment / Stripe
  stripe_account_id       TEXT,
  stripe_onboarded        BOOLEAN DEFAULT FALSE,
  deposit_percentage      INT DEFAULT 20,
  balance_due_days_before INT DEFAULT 14,

  -- Greek tax identity
  afm                     TEXT,
  ama_number              TEXT,               -- Αριθμός Μητρώου Ακινήτου
  vat_rate                NUMERIC(4,2) DEFAULT 13.0,
  tourist_tax_enabled     BOOLEAN DEFAULT FALSE,
  tourist_tax_rate        NUMERIC(5,2),

  -- Contact for guest messages
  reply_to_email          TEXT,
  notification_phone      TEXT,
  sms_notifications       BOOLEAN DEFAULT FALSE,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pms_owner_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own settings" ON pms_owner_settings
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ─── 8. Updated-at trigger (reused across tables) ───────────────────
CREATE OR REPLACE FUNCTION pms_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pms_bookings_touch         ON pms_bookings;
DROP TRIGGER IF EXISTS pms_ical_feeds_touch       ON pms_ical_feeds;
DROP TRIGGER IF EXISTS pms_message_templates_touch ON pms_message_templates;
DROP TRIGGER IF EXISTS pms_pricing_rules_touch    ON pms_pricing_rules;
DROP TRIGGER IF EXISTS pms_tasks_touch            ON pms_tasks;
DROP TRIGGER IF EXISTS pms_owner_settings_touch   ON pms_owner_settings;

CREATE TRIGGER pms_bookings_touch          BEFORE UPDATE ON pms_bookings          FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();
CREATE TRIGGER pms_ical_feeds_touch        BEFORE UPDATE ON pms_ical_feeds        FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();
CREATE TRIGGER pms_message_templates_touch BEFORE UPDATE ON pms_message_templates FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();
CREATE TRIGGER pms_pricing_rules_touch     BEFORE UPDATE ON pms_pricing_rules     FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();
CREATE TRIGGER pms_tasks_touch             BEFORE UPDATE ON pms_tasks             FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();
CREATE TRIGGER pms_owner_settings_touch    BEFORE UPDATE ON pms_owner_settings    FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();

NOTIFY pgrst, 'reload schema';
