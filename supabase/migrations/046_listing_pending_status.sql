-- Allow 'pending' status for new listings awaiting admin approval.
-- Listings are inserted as 'pending' from the owner dashboard and only
-- become publicly visible after an admin sets them to 'published'.

ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;

ALTER TABLE listings
  ADD CONSTRAINT listings_status_check
  CHECK (status IN ('draft', 'pending', 'published', 'archived'));
