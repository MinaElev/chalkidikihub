-- Allow superadmins full access to listing-images storage bucket
-- This fixes the issue where admins can't upload images to listings they don't own

-- Update policy for listing-images (currently missing)
CREATE POLICY "Authenticated users can update listing images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

-- Allow superadmins to delete any listing image (not just their own)
DROP POLICY IF EXISTS "Users can delete own listing images" ON storage.objects;
CREATE POLICY "Users can delete own or admin delete listing images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listing-images' AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
    )
  );
