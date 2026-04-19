-- =====================================================================
-- PMS — Owner-facing notifications (email alerts)
-- =====================================================================
-- The owner gets an email when:
--   • a new inquiry arrives (booking inserted with status=inquiry)
--   • a booking is confirmed (status transitions to confirmed/pending)
--   • a task becomes overdue (status=pending & scheduled_at < now)
--   • a check-in is happening today
--   • a check-out is happening today
--
-- An hourly cron scans for each kind and sends via Gmail (same creds
-- as the template dispatcher). We track what's been sent in
-- pms_notifications so the cron is idempotent — UNIQUE on
-- (owner_id, kind, ref_id, ref_date) prevents duplicate emails.
-- =====================================================================

ALTER TABLE pms_owner_settings
  ADD COLUMN IF NOT EXISTS notify_new_inquiry     BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_new_booking     BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_overdue_tasks   BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_check_in_today  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notify_check_out_today BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS pms_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  kind        TEXT NOT NULL
              CHECK (kind IN ('new_inquiry','new_booking','overdue_task','check_in_today','check_out_today')),
  ref_id      TEXT NOT NULL,               -- booking_id or task_id
  ref_date    DATE,                         -- NULL for one-shot; date for date-bound kinds

  email_to    TEXT NOT NULL,
  subject     TEXT,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error       TEXT,                         -- populated only on send failure

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique-by-tuple so the cron can safely re-scan and skip what's sent.
-- For date-less kinds (new_inquiry, new_booking) ref_date = a sentinel
-- 'epoch' date so the UNIQUE still works (NULLs break uniqueness in PG).
CREATE UNIQUE INDEX IF NOT EXISTS pms_notifications_unique_idx
  ON pms_notifications (owner_id, kind, ref_id, COALESCE(ref_date, '1970-01-01'::date));

CREATE INDEX IF NOT EXISTS pms_notifications_owner_idx ON pms_notifications (owner_id);
CREATE INDEX IF NOT EXISTS pms_notifications_sent_idx  ON pms_notifications (sent_at DESC);

ALTER TABLE pms_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner reads own notifications" ON pms_notifications
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "admin reads all notifications" ON pms_notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
