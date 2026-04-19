-- =====================================================================
-- PMS — Auto-cleaning task generator
-- =====================================================================
-- Adds owner-level prefs for auto-scheduling a cleaning task when a
-- booking's check-out is approaching. A cron job reads these fields
-- and inserts a pms_tasks row if one doesn't already exist for the
-- booking. Owners can keep it off and continue scheduling tasks manually.
-- =====================================================================

ALTER TABLE pms_owner_settings
  ADD COLUMN IF NOT EXISTS auto_cleaning_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cleaning_default_assignee_name  TEXT,
  ADD COLUMN IF NOT EXISTS cleaning_default_assignee_phone TEXT,
  ADD COLUMN IF NOT EXISTS cleaning_default_assignee_email TEXT,
  ADD COLUMN IF NOT EXISTS cleaning_default_cost NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS cleaning_lead_days INT DEFAULT 0;

COMMENT ON COLUMN pms_owner_settings.cleaning_lead_days IS
  'How many days before a booking check-out to schedule the cleaning task (0 = same day as checkout).';

NOTIFY pgrst, 'reload schema';
