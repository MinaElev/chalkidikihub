// Google Search Console API client.
//
// Auth: stored refresh_token in gsc_credentials (service-role only).
// Refreshes access tokens on demand (1h TTL) and caches them in the same row.
//
// Endpoints used:
//   - oauth2.googleapis.com/token (refresh)
//   - searchconsole.googleapis.com/webmasters/v3/sites/<site>/searchAnalytics/query
//     (the sites/searchAnalytics resources live under /webmasters/v3, NOT /v1 —
//      only urlInspection is under /v1. Hitting /v1 returns a generic HTML 404.)

import type { createAdminClient } from './api-helpers';

type AdminSupabase = ReturnType<typeof createAdminClient>;

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SC_BASE = 'https://searchconsole.googleapis.com/webmasters/v3';
// URL Inspection lives under /v1 (NOT /webmasters/v3). Hitting the wrong base
// returns a generic HTML 404, so keep these separate.
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

const CLIENT_ID = () => process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = () => process.env.GOOGLE_CLIENT_SECRET || '';
export const SITE_URL = () => process.env.GSC_SITE_URL || 'https://chalkidikihub.gr';

export const REQUIRED_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

export type SearchAnalyticsRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID(),
    client_secret: CLIENT_SECRET(),
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`token_refresh_failed ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function getAccessToken(supabase: AdminSupabase): Promise<string> {
  const { data, error } = await supabase
    .from('gsc_credentials')
    .select('refresh_token, access_token, expires_at')
    .eq('id', 1)
    .single();

  if (error || !data) throw new Error('gsc_not_connected');

  const now = Date.now();
  const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : 0;
  // Refresh if no token or about to expire (5 min margin).
  if (data.access_token && expiresAt > now + 5 * 60 * 1000) {
    return data.access_token;
  }

  const refreshed = await refreshAccessToken(data.refresh_token);
  const newExpiry = new Date(now + refreshed.expires_in * 1000).toISOString();
  await supabase
    .from('gsc_credentials')
    .update({ access_token: refreshed.access_token, expires_at: newExpiry, updated_at: new Date().toISOString() })
    .eq('id', 1);
  return refreshed.access_token;
}

async function searchAnalyticsQuery(
  supabase: AdminSupabase,
  body: Record<string, unknown>,
): Promise<SearchAnalyticsRow[]> {
  const accessToken = await getAccessToken(supabase);
  const siteUrl = encodeURIComponent(SITE_URL());
  const res = await fetch(`${SC_BASE}/sites/${siteUrl}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`search_analytics_failed ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.rows || []) as SearchAnalyticsRow[];
}

function rangeDays(daysBack: number): { startDate: string; endDate: string } {
  const today = new Date();
  // GSC has a 2-3 day data delay; end date = today - 3 to avoid empty buckets.
  const end = new Date(today.getTime() - 3 * 86400 * 1000);
  const start = new Date(end.getTime() - daysBack * 86400 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

export async function fetchTopPages(supabase: AdminSupabase, daysBack = 28, limit = 1000) {
  const range = rangeDays(daysBack);
  return searchAnalyticsQuery(supabase, {
    ...range,
    dimensions: ['page'],
    rowLimit: limit,
    type: 'web',
  });
}

export async function fetchTopQueries(supabase: AdminSupabase, daysBack = 28, limit = 1000) {
  const range = rangeDays(daysBack);
  return searchAnalyticsQuery(supabase, {
    ...range,
    dimensions: ['query', 'page'],
    rowLimit: limit,
    type: 'web',
  });
}

// Fetch page-level performance for an *explicit* date window (YYYY-MM-DD).
// Used by the monthly snapshot cron to pull a whole calendar month at once,
// independent of the rolling-28-day cache.
export async function fetchPagesForRange(
  supabase: AdminSupabase,
  startDate: string,
  endDate: string,
  limit = 5000,
) {
  return searchAnalyticsQuery(supabase, {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: limit,
    type: 'web',
  });
}

// Fetch (query, page) performance for an explicit date window. Lets the
// snapshot attribute top search terms to each listing for that month.
export async function fetchQueriesForRange(
  supabase: AdminSupabase,
  startDate: string,
  endDate: string,
  limit = 5000,
) {
  return searchAnalyticsQuery(supabase, {
    startDate,
    endDate,
    dimensions: ['query', 'page'],
    rowLimit: limit,
    type: 'web',
  });
}

// Site-wide performance by visitor country for an explicit date window.
// keys[0] is an ISO 3166-1 alpha-3 code (e.g. 'grc', 'deu'). Used for the
// monthly report's "where our visitors come from" breakdown + site totals.
export async function fetchCountriesForRange(
  supabase: AdminSupabase,
  startDate: string,
  endDate: string,
  limit = 250,
) {
  return searchAnalyticsQuery(supabase, {
    startDate,
    endDate,
    dimensions: ['country'],
    rowLimit: limit,
    type: 'web',
  });
}

// ── URL Inspection API ──────────────────────────────────────────────────
// Per-URL indexing status — the only API path to coverage data (there is NO
// API for the aggregate "Page indexing" report). Quota: 2000/day, 600/min
// per property. Read-only `webmasters.readonly` scope is sufficient.

export type UrlInspection = {
  url: string;
  coverageState: string | null;   // 'Submitted and indexed', 'Crawled - currently not indexed', …
  verdict: string | null;         // PASS | PARTIAL | NEUTRAL | FAIL
  robotsTxtState: string | null;  // ALLOWED | DISALLOWED
  indexingState: string | null;   // INDEXING_ALLOWED | BLOCKED_BY_META_TAG | …
  pageFetchState: string | null;  // SUCCESSFUL | SOFT_404 | NOT_FOUND | SERVER_ERROR | …
  googleCanonical: string | null;
  userCanonical: string | null;
  crawledAs: string | null;       // MOBILE | DESKTOP
  referringUrls: number;
  lastCrawlTime: string | null;
  isIndexed: boolean;             // derived: Google actually has it indexed
  raw: Record<string, unknown> | null;
};

// Thrown when the API returns 429 RESOURCE_EXHAUSTED — caller stops the batch
// and records quota_hit so tomorrow's run resumes where it left off.
export class GscQuotaError extends Error {
  constructor(msg: string) { super(msg); this.name = 'GscQuotaError'; }
}

/** A URL is "indexed" only when Google confirms it in the index. `verdict` is
 *  a stable enum (PASS/NEUTRAL/FAIL) — unlike coverageState, which is a
 *  localized human string — so classify on it. PASS == on Google. */
function deriveIndexed(verdict: string | null): boolean {
  return verdict === 'PASS';
}

export async function inspectUrl(
  supabase: AdminSupabase,
  inspectionUrl: string,
): Promise<UrlInspection> {
  const accessToken = await getAccessToken(supabase);
  const res = await fetch(INSPECT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: SITE_URL(),
      // en-US keeps coverageState a STABLE English string so downstream
      // classification is deterministic (a localized string would break it).
      // The dashboard maps these English states to Greek labels for display.
      languageCode: 'en-US',
    }),
  });

  if (res.status === 429) {
    throw new GscQuotaError(`url_inspection_quota_exhausted: ${(await res.text()).slice(0, 200)}`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`url_inspection_failed ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const r = (data?.inspectionResult?.indexStatusResult || {}) as Record<string, unknown>;
  const coverageState = (r.coverageState as string) ?? null;
  const verdict = (r.verdict as string) ?? null;
  const referring = Array.isArray(r.referringUrls) ? r.referringUrls.length : 0;

  return {
    url: inspectionUrl,
    coverageState,
    verdict,
    robotsTxtState: (r.robotsTxtState as string) ?? null,
    indexingState: (r.indexingState as string) ?? null,
    pageFetchState: (r.pageFetchState as string) ?? null,
    googleCanonical: (r.googleCanonical as string) ?? null,
    userCanonical: (r.userCanonical as string) ?? null,
    crawledAs: (r.crawledAs as string) ?? null,
    referringUrls: referring,
    lastCrawlTime: (r.lastCrawlTime as string) ?? null,
    isIndexed: deriveIndexed(verdict),
    raw: r,
  };
}

// Construct the OAuth authorize URL. Caller redirects the browser there.
export function buildAuthorizeUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID(),
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: REQUIRED_SCOPE,
    access_type: 'offline',     // returns a refresh_token
    prompt: 'consent',          // force re-consent so refresh_token is always issued
    include_granted_scopes: 'true',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// Exchange the auth code for tokens.
export async function exchangeCode(code: string, redirectUri: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}> {
  const body = new URLSearchParams({
    code,
    client_id: CLIENT_ID(),
    client_secret: CLIENT_SECRET(),
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`code_exchange_failed ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

// Lookup the email + scopes attached to an access token (for sanity check).
export async function tokenInfo(accessToken: string): Promise<{ email?: string; scope?: string }> {
  try {
    const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return {};
    const data = await res.json();
    return { email: data.email };
  } catch {
    return {};
  }
}
