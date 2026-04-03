-- Allow superadmin role
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('owner', 'admin', 'superadmin'));

-- Superadmin can view all profiles
CREATE POLICY "Superadmin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Superadmin can view all listings (regardless of status)
CREATE POLICY "Superadmin can view all listings" ON listings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Superadmin can update any listing
CREATE POLICY "Superadmin can update any listing" ON listings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Superadmin can delete any listing
CREATE POLICY "Superadmin can delete any listing" ON listings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Superadmin can update any profile role
CREATE POLICY "Superadmin can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
  );

-- Add contact and booking columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS booking_url TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS airbnb_url TEXT;
