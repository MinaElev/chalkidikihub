-- ════════════════════════════════════════════════════════════════════════
-- Migration 051: Per-listing monthly stats snapshots
-- ════════════════════════════════════════════════════════════════════════
-- Foundation for the monthly owner report ("πόσοι σε είδαν / πόσα αιτήματα").
--
-- WHY THIS EXISTS
-- Google Search Console data (gsc_pages_28d) is a *rolling 28-day* window that
-- is overwritten wholesale on every sync — June's numbers no longer exist in
-- July. To ever say "τον προηγούμενο μήνα" or "+18% από τον Ιούνιο" we must
-- freeze the numbers per calendar month. This table is that frozen history.
--
-- One row = one listing × one calendar month. `month` is the first day of the
-- month the row covers (e.g. 2026-06-01 = the whole of June 2026).
--
-- A monthly cron (/api/cron/monthly-snapshot) pulls the previous calendar
-- month straight from the GSC API (not the rolling cache) and upserts here, so
-- re-runs are safe and each month's numbers are exact.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS listing_monthly_stats (
  listing_id   UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  month        DATE NOT NULL,               -- first day of the covered month
  impressions  INTEGER NOT NULL DEFAULT 0,  -- GSC: times the listing showed in search
  clicks       INTEGER NOT NULL DEFAULT 0,  -- GSC: clicks to the listing's pages
  inquiries    INTEGER NOT NULL DEFAULT 0,  -- availability requests via /api/inquiry
  -- Top search terms that surfaced this listing, [{query, impressions, clicks}].
  -- Snapshotted per month because GSC queries are rolling 28d too. Nullable so
  -- the snapshot still succeeds if the query pull fails.
  top_queries  JSONB,
  snapshot_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (listing_id, month)
);

CREATE INDEX IF NOT EXISTS idx_listing_monthly_stats_month
  ON listing_monthly_stats (month DESC);

ALTER TABLE listing_monthly_stats ENABLE ROW LEVEL SECURITY;

-- Owners may read the stats for their own listings (for a future dashboard
-- widget). Writes are service-role only (the cron), which bypasses RLS.
CREATE POLICY "Owners read own listing monthly stats" ON listing_monthly_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_monthly_stats.listing_id
        AND l.owner_id = auth.uid()
    )
  );

NOTIFY pgrst, 'reload schema';
