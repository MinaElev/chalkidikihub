-- =====================================================================
-- PMS — grant super-admins read+write on every PMS table
-- =====================================================================
-- Super-admins (profiles.role = 'admin') need to browse, test, and
-- support owners' PMS data across the whole platform. Regular owners
-- stay scoped to their own rows by the existing auth.uid() policies.
-- =====================================================================

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
$$;

-- pms_bookings (SELECT policy already exists from 032; add write)
DROP POLICY IF EXISTS "admin writes all bookings" ON pms_bookings;
CREATE POLICY "admin writes all bookings" ON pms_bookings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- pms_ical_feeds
DROP POLICY IF EXISTS "admin all ical feeds" ON pms_ical_feeds;
CREATE POLICY "admin all ical feeds" ON pms_ical_feeds
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- pms_messages
DROP POLICY IF EXISTS "admin all messages" ON pms_messages;
CREATE POLICY "admin all messages" ON pms_messages
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- pms_message_templates
DROP POLICY IF EXISTS "admin all templates" ON pms_message_templates;
CREATE POLICY "admin all templates" ON pms_message_templates
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- pms_pricing_rules
DROP POLICY IF EXISTS "admin all pricing rules" ON pms_pricing_rules;
CREATE POLICY "admin all pricing rules" ON pms_pricing_rules
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- pms_tasks
DROP POLICY IF EXISTS "admin all tasks" ON pms_tasks;
CREATE POLICY "admin all tasks" ON pms_tasks
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- pms_owner_settings
DROP POLICY IF EXISTS "admin all owner settings" ON pms_owner_settings;
CREATE POLICY "admin all owner settings" ON pms_owner_settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

NOTIFY pgrst, 'reload schema';
