-- Custom email verification via 4-digit code (Supabase email confirmation stays OFF).
-- Existing users are grandfathered as verified; only NEW signups go through the code flow.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

-- Grandfather every existing user so nobody currently registered is ever prompted
UPDATE profiles SET email_verified_at = now() WHERE email_verified_at IS NULL;

-- One active verification code per user; accessed only via service role
CREATE TABLE IF NOT EXISTS email_verifications (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sends_in_window INT NOT NULL DEFAULT 1,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS on, no policies: only the service-role key (API routes) can touch codes
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- RLS "update own profile" is row-level, not column-level — without this trigger
-- a user could self-verify from the browser console. Only the service role
-- (our API routes) may change email_verified_at.
CREATE OR REPLACE FUNCTION public.protect_email_verified_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_verified_at IS DISTINCT FROM OLD.email_verified_at
     AND auth.role() IN ('anon', 'authenticated') THEN
    RAISE EXCEPTION 'email_verified_at is server-managed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_email_verified_at ON profiles;
CREATE TRIGGER protect_email_verified_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_email_verified_at();
