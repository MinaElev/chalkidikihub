-- ════════════════════════════════════════════════════════════════════════
-- Migration 052: Monthly owner-report send log
-- ════════════════════════════════════════════════════════════════════════
-- One row per (owner, month) that a monthly stats report was emailed for.
-- Lets the admin UI show "already sent on X" and lets the send endpoint skip
-- owners already emailed for that month (unless force=true), so re-opening the
-- page and clicking Send again can't double-mail people.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS report_sends (
  owner_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month      DATE NOT NULL,            -- first day of the covered month
  email      TEXT,                     -- address it went to (audit trail)
  listings   INTEGER NOT NULL DEFAULT 0,
  sent_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (owner_id, month)
);

CREATE INDEX IF NOT EXISTS idx_report_sends_month ON report_sends (month DESC);

ALTER TABLE report_sends ENABLE ROW LEVEL SECURITY;
-- Service-role only (admin API routes). No policies = no client access.

NOTIFY pgrst, 'reload schema';
