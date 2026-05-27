-- Admin SELECT policies for availability_* tables
--
-- 043 enabled RLS on these tables but added no read policies, since all
-- public/owner reads go through API routes using the service-role client
-- (which bypasses RLS). The admin pages, however, use the browser client,
-- which respects RLS — so /admin/availability-requests was returning 0 rows.
-- These policies let superadmins read everything.

CREATE POLICY "Superadmin reads availability_requests"
  ON availability_requests
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

CREATE POLICY "Superadmin reads availability_request_recipients"
  ON availability_request_recipients
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

CREATE POLICY "Superadmin reads availability_responses"
  ON availability_responses
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Also for owner_broadcast_settings — admin may want to debug owners' setups
CREATE POLICY "Superadmin reads owner_broadcast_settings"
  ON owner_broadcast_settings
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Owners need to read their own recipient rows (the owner dashboard sidebar
-- counts how many broadcasts they received the last 7 days). The default
-- behaviour without a SELECT policy is 0 rows.
CREATE POLICY "Owners read their own recipient rows"
  ON availability_request_recipients
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Owners need to read their own response rows (so they can see what they
-- previously replied to a request — and for any future "my replies" view).
CREATE POLICY "Owners read their own response rows"
  ON availability_responses
  FOR SELECT
  USING (auth.uid() = owner_id);
