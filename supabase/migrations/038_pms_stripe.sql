-- =====================================================================
-- PMS — Stripe Connect (payout onboarding + direct charges)
-- =====================================================================
-- Owners connect their own Stripe account via OAuth Connect. Guest
-- payments flow directly to the owner's Stripe account with
-- application_fee_amount=0 (0% platform fee — this is ChalkidikiHub's
-- value proposition against OTAs).
--
-- We store:
--   • stripe_connect_state — random CSRF token during the OAuth round-trip
--   • stripe_checkout_session_id on the booking for receipt lookup
--   • stripe_paid_amount / stripe_payment_method for accounting
--
-- The webhook route updates pms_bookings.payment_status when
-- checkout.session.completed arrives from Stripe.
-- =====================================================================

ALTER TABLE pms_owner_settings
  ADD COLUMN IF NOT EXISTS stripe_connect_state TEXT;

ALTER TABLE pms_bookings
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_paid_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS stripe_payment_method TEXT;

CREATE INDEX IF NOT EXISTS pms_bookings_stripe_session_idx
  ON pms_bookings (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;
