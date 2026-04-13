-- Allow superadmins to manage listing images (insert, update, delete)
-- Previously only the listing owner could manage images

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Owners can insert listing images" ON listing_images;
DROP POLICY IF EXISTS "Owners can delete listing images" ON listing_images;

-- Recreate with superadmin access
CREATE POLICY "Owners or admins can insert listing images" ON listing_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_images.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Owners or admins can update listing images" ON listing_images
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_images.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Owners or admins can delete listing images" ON listing_images
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_images.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
  );

-- Also fix the SELECT policy to allow admins to see all images (including draft listings)
DROP POLICY IF EXISTS "Anyone can view listing images" ON listing_images;
CREATE POLICY "Anyone can view listing images" ON listing_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_images.listing_id AND (listings.status = 'published' OR listings.owner_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
  );
