/**
 * Stripe REST client — thin wrapper around fetch so we don't need the
 * `stripe` npm package. We only call a handful of endpoints (OAuth token
 * exchange, checkout session create, webhook signature verification), so
 * the footprint is small.
 *
 * All env vars are lazily read per call to keep this module importable
 * from edge / client contexts that don't have the secrets at build time.
 */

export const STRIPE_API_BASE = 'https://api.stripe.com/v1';
export const STRIPE_OAUTH_AUTHORIZE = 'https://connect.stripe.com/oauth/authorize';
export const STRIPE_OAUTH_TOKEN = 'https://connect.stripe.com/oauth/token';

function needSecret(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return key;
}

/** Turn a plain object into `application/x-www-form-urlencoded` Stripe expects. */
export function toForm(obj: Record<string, string | number | boolean | undefined | null>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    p.set(k, String(v));
  }
  return p.toString();
}

export async function stripeFetch<T = unknown>(
  path: string,
  opts: { method?: 'GET' | 'POST'; body?: Record<string, unknown>; apiKey?: string } = {},
): Promise<{ ok: boolean; status: number; data: T; error?: string }> {
  const key = opts.apiKey || needSecret();
  const method = opts.method || 'POST';
  const url = path.startsWith('http') ? path : `${STRIPE_API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: opts.body ? toForm(opts.body as Record<string, string>) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (data as { error?: { message?: string } })?.error?.message || `http_${res.status}`;
    return { ok: false, status: res.status, data: data as T, error: err };
  }
  return { ok: true, status: res.status, data: data as T };
}

export function stripeConnectAuthorizeUrl(opts: {
  clientId: string;
  redirectUri: string;
  state: string;
  scope?: string;
}): string {
  const q = new URLSearchParams({
    response_type: 'code',
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    state: opts.state,
    scope: opts.scope || 'read_write',
  });
  return `${STRIPE_OAUTH_AUTHORIZE}?${q.toString()}`;
}

/**
 * Verify a Stripe webhook signature.
 * Header format: `t=<timestamp>,v1=<signature>,v1=<signature2>...`
 * Payload to HMAC-sign: `${timestamp}.${rawBody}`
 * See: https://stripe.com/docs/webhooks/signatures
 */
export async function verifyStripeSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  toleranceSec = 300,
): Promise<{ ok: boolean; error?: string }> {
  if (!header) return { ok: false, error: 'missing_signature' };
  const parts = Object.fromEntries(
    header.split(',').map(p => {
      const [k, ...v] = p.split('=');
      return [k, v.join('=')];
    }),
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return { ok: false, error: 'malformed_signature' };
  const ts = Number(t);
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > toleranceSec) {
    return { ok: false, error: 'stale_signature' };
  }
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${rawBody}`));
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex !== v1) return { ok: false, error: 'signature_mismatch' };
  return { ok: true };
}

/** Random URL-safe state token (32 bytes → 64 hex chars). */
export function randomState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
