-- Availability Broadcast Requests
-- Visitor submits a request for a Halkidiki leg → platform emails matching
-- owners → owners respond available/unavailable → visitor sees responses on
-- a token-protected dashboard. No guest account required.

-- ─── 1. Requests ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_token TEXT UNIQUE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  area TEXT NOT NULL CHECK (area IN ('kassandra', 'sithonia', 'athos', 'mainland')),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER NOT NULL DEFAULT 2,
  children INTEGER NOT NULL DEFAULT 0,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  property_type TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'expired')),
  recipients_count INTEGER NOT NULL DEFAULT 0,
  responses_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_avail_req_status ON availability_requests(status);
CREATE INDEX IF NOT EXISTS idx_avail_req_email ON availability_requests(guest_email);
CREATE INDEX IF NOT EXISTS idx_avail_req_created ON availability_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avail_req_expires ON availability_requests(expires_at);

ALTER TABLE availability_requests ENABLE ROW LEVEL SECURITY;

-- ─── 2. Recipients (who got the broadcast email) ─────────────────────
CREATE TABLE IF NOT EXISTS availability_request_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES availability_requests(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  response_token TEXT UNIQUE NOT NULL,
  send_status TEXT NOT NULL DEFAULT 'sent' CHECK (send_status IN ('sent', 'failed', 'skipped')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  error TEXT,
  UNIQUE(request_id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_avail_recip_request ON availability_request_recipients(request_id);
CREATE INDEX IF NOT EXISTS idx_avail_recip_owner ON availability_request_recipients(owner_id, sent_at DESC);

ALTER TABLE availability_request_recipients ENABLE ROW LEVEL SECURITY;

-- ─── 3. Responses ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES availability_requests(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'unavailable')),
  price NUMERIC(10,2),
  message TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(request_id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_avail_resp_request ON availability_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_avail_resp_owner ON availability_responses(owner_id);

ALTER TABLE availability_responses ENABLE ROW LEVEL SECURITY;

-- ─── 4. Owner broadcast settings ─────────────────────────────────────
-- Default OPT-OUT (i.e. everyone in by default). Owners flip `opted_out=true`
-- to stop receiving. `max_per_week` lets them throttle; `areas` (null=all)
-- restricts which legs they want broadcasts from.
CREATE TABLE IF NOT EXISTS owner_broadcast_settings (
  owner_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  opted_out BOOLEAN NOT NULL DEFAULT false,
  max_per_week INTEGER NOT NULL DEFAULT 10,
  areas TEXT[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE owner_broadcast_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read own broadcast settings" ON owner_broadcast_settings
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners upsert own broadcast settings" ON owner_broadcast_settings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners update own broadcast settings" ON owner_broadcast_settings
  FOR UPDATE USING (auth.uid() = owner_id);

-- All public/owner reads to the request tables go through API routes that use
-- the service role + token verification, so no RLS read policies are needed
-- here. Service role bypasses RLS for writes.
