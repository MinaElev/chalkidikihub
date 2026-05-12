-- ════════════════════════════════════════════════════════════════════════
-- Migration 041: guide content overrides (AI-generated fills)
-- ════════════════════════════════════════════════════════════════════════
-- The /guide/* content lives in a static TS data file. AI-generated
-- translations for thin locales are written here instead — runtime
-- merge in /guide/[slug]/page.tsx prefers an override over the file.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS guide_overrides (
  slug TEXT NOT NULL,
  locale TEXT NOT NULL,
  content TEXT NOT NULL,
  source_locale TEXT,
  word_count INT,
  generator TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_guide_overrides_slug ON guide_overrides (slug);

ALTER TABLE guide_overrides ENABLE ROW LEVEL SECURITY;
-- No policies = service-role-only access (admin endpoints).

NOTIFY pgrst, 'reload schema';
