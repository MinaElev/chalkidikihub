-- Activity logs for admin monitoring
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('error', 'user_action', 'admin_action', 'system')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error')),
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_logs_severity ON activity_logs(severity);
CREATE INDEX idx_logs_type ON activity_logs(type);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Only superadmin can read logs
CREATE POLICY "Superadmin can read logs"
  ON activity_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Anyone can insert logs (for client-side error reporting)
CREATE POLICY "Anyone can insert logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- Superadmin can delete logs
CREATE POLICY "Superadmin can delete logs"
  ON activity_logs FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Auto-cleanup: delete logs older than 90 days (run manually or via cron)
-- DELETE FROM activity_logs WHERE created_at < now() - interval '90 days';
