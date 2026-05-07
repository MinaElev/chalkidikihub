-- ════════════════════════════════════════════════════════════════════════
-- Migration 040: Google Search Console integration
-- ════════════════════════════════════════════════════════════════════════
-- Stores OAuth refresh token + cached Search Analytics data so the
-- /admin/seo-gsc dashboard reads from the local DB (instant) and a daily
-- cron job pulls fresh numbers from the GSC API.
--
-- Security note: gsc_credentials.refresh_token is sensitive. RLS forbids
-- all access except via the service-role key (server-side only).
-- ════════════════════════════════════════════════════════════════════════

-- Singleton credentials row (one site, one connected Google account).
CREATE TABLE IF NOT EXISTS gsc_credentials (
  id INT PRIMARY KEY DEFAULT 1,
  refresh_token TEXT NOT NULL,
  access_token TEXT,
  expires_at TIMESTAMPTZ,
  email TEXT,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT gsc_credentials_singleton CHECK (id = 1)
);

ALTER TABLE gsc_credentials ENABLE ROW LEVEL SECURITY;
-- No policies = service-role-only access.

-- Sync run log — one row per scheduled or manual sync.
CREATE TABLE IF NOT EXISTS gsc_sync_runs (
  id BIGSERIAL PRIMARY KEY,
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  error TEXT,
  pages_synced INT DEFAULT 0,
  queries_synced INT DEFAULT 0,
  trigger TEXT CHECK (trigger IN ('cron', 'manual'))
);

CREATE INDEX IF NOT EXISTS idx_gsc_sync_runs_started ON gsc_sync_runs (started_at DESC);

-- Per-page performance, last 28 days. Replaced wholesale on each sync.
CREATE TABLE IF NOT EXISTS gsc_pages_28d (
  page TEXT PRIMARY KEY,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  ctr NUMERIC(6, 4),
  position NUMERIC(7, 2),
  last_synced TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsc_pages_clicks ON gsc_pages_28d (clicks DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_pages_impressions ON gsc_pages_28d (impressions DESC);

-- Per-(query,page) performance, last 28 days. Replaced wholesale on each sync.
CREATE TABLE IF NOT EXISTS gsc_queries_28d (
  query TEXT NOT NULL,
  page TEXT NOT NULL,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  ctr NUMERIC(6, 4),
  position NUMERIC(7, 2),
  last_synced TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (query, page)
);

CREATE INDEX IF NOT EXISTS idx_gsc_queries_impressions ON gsc_queries_28d (impressions DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_queries_position ON gsc_queries_28d (position);
CREATE INDEX IF NOT EXISTS idx_gsc_queries_clicks ON gsc_queries_28d (clicks DESC);

-- Coverage breakdown (Indexed / Not indexed reasons / Errors).
-- Sourced from URL Inspection API or sitemaps endpoint snapshot.
CREATE TABLE IF NOT EXISTS gsc_coverage (
  state TEXT PRIMARY KEY,
  count INT DEFAULT 0,
  last_synced TIMESTAMPTZ DEFAULT now()
);

NOTIFY pgrst, 'reload schema';
