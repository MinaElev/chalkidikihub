-- ════════════════════════════════════════════════════════════════════════
-- Migration 050: Last-Minute Deals — auto-expire + owner notification
-- ════════════════════════════════════════════════════════════════════════
-- When a deal's `end_date` passes, we want it to (a) stop appearing publicly
-- and (b) flip status 'active' → 'expired' so it "closes" everywhere, and the
-- owner gets an email.
--
-- (a) is already handled at the DB level: the public-read RLS policy from
--     migration 047 is `status = 'active' AND end_date >= current_date`, so an
--     ended deal is unreadable by the anon key the day after `end_date` — no
--     cron needed for hiding.
--
-- (b) is this migration. The flip itself must be atomic so the Vercel cron that
--     drives it knows *exactly which* deals just expired (to email their owners
--     exactly once, even if the cron runs twice). We do it in one UPDATE ...
--     RETURNING, wrapped in a SECURITY DEFINER function the cron calls via RPC.
--
-- Why a Vercel cron and not pg_cron: the owner email is sent from app code
-- (nodemailer + Gmail creds in site_settings). pg_cron would need pg_net to
-- reach app code, which was never enabled on this project (same reason the FB
-- announce moved from a DB trigger to a Vercel route — see migration 049).
-- Comparing against DB `current_date` here keeps the flip in lock-step with the
-- RLS visibility rule regardless of the caller's timezone.
-- ════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION expire_last_minute_deals()
RETURNS TABLE (
  deal_id        uuid,
  listing_id     uuid,
  owner_id       uuid,
  owner_email    text,
  owner_name     text,
  listing_title_el text,
  listing_title_en text,
  listing_slug   text,
  start_date     date,
  end_date       date,
  note           text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH expired AS (
    UPDATE last_minute_deals d
       SET status = 'expired'
     WHERE d.status = 'active'
       AND d.end_date < current_date
    RETURNING d.id, d.listing_id, d.owner_id, d.start_date, d.end_date, d.note
  )
  SELECT
    e.id            AS deal_id,
    e.listing_id,
    e.owner_id,
    p.email         AS owner_email,
    p.full_name     AS owner_name,
    l.title_el      AS listing_title_el,
    l.title_en      AS listing_title_en,
    l.slug          AS listing_slug,
    e.start_date,
    e.end_date,
    e.note
  FROM expired e
  LEFT JOIN listings l ON l.id = e.listing_id
  LEFT JOIN profiles p ON p.id = e.owner_id;
$$;

-- Only the service role (used by the Vercel cron via createAdminClient) may run
-- this. Revoke from anon/authenticated so it can never be called from a browser.
REVOKE ALL ON FUNCTION expire_last_minute_deals() FROM public;
REVOKE ALL ON FUNCTION expire_last_minute_deals() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION expire_last_minute_deals() TO service_role;

COMMENT ON FUNCTION expire_last_minute_deals() IS
  'Flips active last-minute deals whose end_date has passed to status=expired and '
  'returns the just-expired rows (with owner + listing info) so the caller can '
  'email each owner exactly once. Called daily by /api/cron/expire-deals.';
