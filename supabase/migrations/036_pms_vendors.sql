-- =====================================================================
-- PMS — Vendors (cleaners, handymen, property managers, photographers…)
-- =====================================================================
-- Re-usable contact list per owner. A vendor can be attached to many
-- tasks without retyping name/phone/email every time. The assignee_*
-- columns on pms_tasks remain (denormalised snapshot at assignment
-- time), so tasks stay intact if a vendor is later edited or removed.
-- =====================================================================

CREATE TABLE IF NOT EXISTS pms_vendors (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name              TEXT NOT NULL,
  role              TEXT NOT NULL DEFAULT 'cleaner'
                    CHECK (role IN ('cleaner','maintenance','property_manager','linen','gardener','photographer','other')),
  phone             TEXT,
  email             TEXT,
  default_hourly_rate NUMERIC(10,2),
  default_flat_rate   NUMERIC(10,2),

  notes             TEXT,
  active            BOOLEAN NOT NULL DEFAULT TRUE,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pms_vendors_owner_idx  ON pms_vendors (owner_id);
CREATE INDEX IF NOT EXISTS pms_vendors_active_idx ON pms_vendors (owner_id, active);

ALTER TABLE pms_vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own vendors" ON pms_vendors
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "admin reads all vendors" ON pms_vendors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP TRIGGER IF EXISTS pms_vendors_touch ON pms_vendors;
CREATE TRIGGER pms_vendors_touch
  BEFORE UPDATE ON pms_vendors
  FOR EACH ROW EXECUTE FUNCTION pms_touch_updated_at();

-- Tasks gain an optional FK → vendor. ON DELETE SET NULL so removing a
-- vendor doesn't cascade into destroying historical tasks.
ALTER TABLE pms_tasks
  ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES pms_vendors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pms_tasks_vendor_idx ON pms_tasks (vendor_id);
