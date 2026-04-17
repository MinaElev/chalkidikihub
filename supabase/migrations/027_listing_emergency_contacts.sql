-- ════════════════════════════════════════════════════════════════════════
-- Migration 027: Per-listing emergency contacts
-- ════════════════════════════════════════════════════════════════════════
-- In addition to the default Greek / EU emergency numbers (always shown
-- on the public page), owners can list local contacts: the nearest
-- police station, a walk-in clinic, the closest pharmacy, a trusted
-- taxi driver, etc.
--
-- Legal context (Greece, non-binding reference — πάντα να συμβουλεύεστε
-- νομικό για ακριβή συμμόρφωση):
--   · Ν. 4276/2014 (τουριστικά καταλύματα) — υποχρέωση παροχής βασικών
--     στοιχείων ασφάλειας στους φιλοξενούμενους.
--   · Ν. 4179/2013 (τουρισμός) — γενικές υποχρεώσεις ενημέρωσης.
--   · ΠΔ 41/2018 & σχετικές διατάξεις πυρασφάλειας.
--   · Οδηγίες ΕΟΤ για βραχυχρόνιες μισθώσεις.
-- Γενικά προτείνεται οι επισκέπτες να έχουν άμεση πρόσβαση σε:
--   112 (EU), 100 (Αστυνομία), 166 (Ασθενοφόρο),
--   199 (Πυροσβεστική), 108 (Λιμενικό), 10135 (δηλητηριάσεις).
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS listing_emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  -- A short semantic key used to pick the icon on the front-end
  -- (police | medical | fire | ambulance | coast_guard | pharmacy |
  --  hospital | taxi | host | other)
  icon_key text NOT NULL DEFAULT 'other',
  phone text NOT NULL,
  label_el text, label_en text, label_de text, label_bg text,
  label_ru text, label_ro text, label_sr text,
  notes_el text, notes_en text, notes_de text, notes_bg text,
  notes_ru text, notes_ro text, notes_sr text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_emergency_contacts_listing
  ON listing_emergency_contacts(listing_id, sort_order);

ALTER TABLE listing_emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Anyone can READ — guests on the public page need these numbers
DROP POLICY IF EXISTS "emergency_public_read" ON listing_emergency_contacts;
CREATE POLICY "emergency_public_read"
  ON listing_emergency_contacts FOR SELECT USING (true);

-- Only the listing owner / admin can WRITE
DROP POLICY IF EXISTS "emergency_owner_write" ON listing_emergency_contacts;
CREATE POLICY "emergency_owner_write"
  ON listing_emergency_contacts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_emergency_contacts.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_emergency_contacts.listing_id AND listings.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin','superadmin'))
  );

DROP TRIGGER IF EXISTS trg_listing_emergency_contacts_touch ON listing_emergency_contacts;
CREATE TRIGGER trg_listing_emergency_contacts_touch
  BEFORE UPDATE ON listing_emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
