-- ════════════════════════════════════════════════════════════════════════
-- Migration 049: Fire Make.com on new last-minute deals
-- ════════════════════════════════════════════════════════════════════════
-- Equivalent to a Supabase "Database Webhook" (Dashboard → Database → Webhooks)
-- but kept in version control. On INSERT of an *active* deal, Postgres POSTs the
-- row to the Make.com custom webhook, which formats & posts it to Facebook.
-- Runs entirely on Supabase infra — no Vercel/Next.js involvement.
--
-- The payload is the standard Supabase webhook shape:
--   { "type":"INSERT", "table":"last_minute_deals", "schema":"public",
--     "record": { …full row incl. fb_message / fb_link / image_url… },
--     "old_record": null }
--
-- `supabase_functions.http_request(url, method, headers, params, timeout_ms)`
-- is the same helper the Webhooks UI generates (backed by pg_net). If your
-- project has never used webhooks and this function is missing, create any
-- webhook once from the Dashboard to initialise it, then re-run this migration.
-- ════════════════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS trg_lmd_make_webhook ON last_minute_deals;

CREATE TRIGGER trg_lmd_make_webhook
  AFTER INSERT ON last_minute_deals
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://hook.eu1.make.com/89v9ezb98ep7elmljj6ubp6kty3rlgdd',
    'POST',
    '{"Content-Type":"application/json"}',
    '{}',
    '5000'
  );
