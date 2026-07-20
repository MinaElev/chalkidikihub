-- Close the self-publish hole: RLS "Owners can update their own listings" is
-- row-level, so an owner could set status='published' from the dashboard edit
-- page (or a raw API call) and skip admin review entirely.
--
-- approved_at records the first admin approval. Owners may only have
-- status='published' on listings that carry an approval; admins and the
-- service role get approved_at stamped automatically when they publish.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Everything already live has implicitly been approved
UPDATE listings SET approved_at = now() WHERE status = 'published' AND approved_at IS NULL;

CREATE OR REPLACE FUNCTION public.protect_listing_publish()
RETURNS TRIGGER AS $$
DECLARE
  is_privileged BOOLEAN;
BEGIN
  -- service_role and direct DB access (auth.role() IS NULL) are privileged;
  -- authenticated users are privileged only if their profile is admin/superadmin
  is_privileged := COALESCE(auth.role(), 'service_role') NOT IN ('anon', 'authenticated');
  IF NOT is_privileged AND auth.role() = 'authenticated' THEN
    SELECT EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    ) INTO is_privileged;
  END IF;

  IF is_privileged THEN
    -- Admin publish counts as approval
    IF NEW.status = 'published' AND NEW.approved_at IS NULL THEN
      NEW.approved_at := now();
    END IF;
    RETURN NEW;
  END IF;

  -- Owners cannot grant or alter approval
  IF TG_OP = 'INSERT' THEN
    NEW.approved_at := NULL;
  ELSIF NEW.approved_at IS DISTINCT FROM OLD.approved_at THEN
    RAISE EXCEPTION 'approved_at is admin-managed';
  END IF;

  -- Owners may only publish listings an admin has already approved
  IF NEW.status = 'published' AND NEW.approved_at IS NULL THEN
    RAISE EXCEPTION 'Listing must be approved by an admin before it can be published';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_listing_publish ON listings;
CREATE TRIGGER protect_listing_publish
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION public.protect_listing_publish();
