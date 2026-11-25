/**
 * Viva (vivapayments.com) Smart Checkout client — thin fetch wrapper, no SDK.
 *
 * Two credential sets, both from Viva Self Care → Settings → API Access:
 *   - Smart Checkout Client ID / Secret (OAuth2) → create orders, retrieve transactions
 *   - Merchant ID / API Key (Basic)              → webhook verification key, refunds
 * plus the 4-digit payment Source Code (Sales → Online Payments → Websites/Apps),
 * which also holds the success/failure redirect URLs.
 *
 * VIVA_ENV=demo (default) talks to the demo hosts; VIVA_ENV=live to production.
 * Env vars are read lazily per call so the module imports fine without them.
 */

type Hosts = { accounts: string; api: string; www: string };

const HOSTS: Record<'demo' | 'live', Hosts> = {
  demo: {
    accounts: 'https://demo-accounts.vivapayments.com',
    api: 'https://demo-api.vivapayments.com',
    www: 'https://demo.vivapayments.com',
  },
  live: {
    accounts: 'https://accounts.vivapayments.com',
    api: 'https://api.vivapayments.com',
    www: 'https://www.vivapayments.com',
  },
};

export function vivaEnv(): 'demo' | 'live' {
  return process.env.VIVA_ENV === 'live' ? 'live' : 'demo';
}
function hosts(): Hosts { return HOSTS[vivaEnv()]; }

/** Which pieces are configured (for the admin health panel). */
export function vivaConfig() {
  return {
    env: vivaEnv(),
    checkout: Boolean(process.env.VIVA_CLIENT_ID && process.env.VIVA_CLIENT_SECRET && process.env.VIVA_SOURCE_CODE),
    merchant: Boolean(process.env.VIVA_MERCHANT_ID && process.env.VIVA_API_KEY),
  };
}

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} not configured`);
  return v;
}

function basicAuth(): string {
  return 'Basic ' + Buffer.from(`${need('VIVA_MERCHANT_ID')}:${need('VIVA_API_KEY')}`).toString('base64');
}

// ── OAuth2 token (client credentials), cached in-process until near expiry ──
let cachedToken: { env: string; token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  const env = vivaEnv();
  if (cachedToken && cachedToken.env === env && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const creds = Buffer.from(`${need('VIVA_CLIENT_ID')}:${need('VIVA_CLIENT_SECRET')}`).toString('base64');
  const res = await fetch(`${hosts().accounts}/connect/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({})) as { access_token?: string; expires_in?: number };
  if (!res.ok || !data.access_token) throw new Error(`viva_token_failed_${res.status}`);
  cachedToken = { env, token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

// ── Payment orders ──

export type CreateOrderInput = {
  amountCents: number;
  customerTrns: string;          // shown to the payer on the checkout page
  merchantTrns: string;          // our own reference, echoed back on the transaction
  email?: string;
  fullName?: string;
  requestLang?: string;          // e.g. 'el-GR'
};

/** Create a Smart Checkout order. Returns the 16-digit orderCode (as a string). */
export async function createOrder(input: CreateOrderInput): Promise<{ ok: true; orderCode: string } | { ok: false; error: string }> {
  try {
    const token = await accessToken();
    const res = await fetch(`${hosts().api}/checkout/v2/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: input.amountCents,       // integer, smallest currency unit
        customerTrns: input.customerTrns.slice(0, 2048),
        merchantTrns: input.merchantTrns,
        sourceCode: need('VIVA_SOURCE_CODE'),
        paymentTimeout: 1800,
        customer: {
          email: input.email || undefined,
          fullName: input.fullName || undefined,
          countryCode: 'GR',
          requestLang: input.requestLang || 'el-GR',
        },
      }),
      cache: 'no-store',
    });
    // orderCode is a 16-digit number — read it from the raw text so it never
    // passes through a JS number (loses precision past 2^53).
    const text = await res.text();
    const m = text.match(/"orderCode"\s*:\s*"?(\d+)"?/i);
    if (!res.ok || !m) return { ok: false, error: `viva_order_failed_${res.status}` };
    return { ok: true, orderCode: m[1] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'viva_order_failed' };
  }
}

export function checkoutUrl(orderCode: string): string {
  return `${hosts().www}/web/checkout?ref=${encodeURIComponent(orderCode)}`;
}

// ── Transactions ──

export type VivaTransaction = {
  transactionId: string;
  orderCode: string;
  statusId: string;              // 'F' = finished (paid)
  amountCents: number;
  currencyCode: string;          // ISO 4217 numeric, '978' = EUR
  merchantTrns: string;
  email: string | null;
};

/**
 * Retrieve a transaction from Viva. This is the ONLY source of truth we act on:
 * Viva webhooks and redirect query params are unsigned, so we always re-fetch.
 */
export async function retrieveTransaction(transactionId: string): Promise<{ ok: true; tx: VivaTransaction } | { ok: false; status: number; error: string }> {
  if (!/^[0-9a-f-]{36}$/i.test(transactionId)) return { ok: false, status: 400, error: 'bad_transaction_id' };
  try {
    const token = await accessToken();
    const res = await fetch(`${hosts().api}/checkout/v2/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, status: res.status, error: `viva_tx_${res.status}` };
    const d = JSON.parse(text) as Record<string, unknown>;
    const orderCode = text.match(/"orderCode"\s*:\s*"?(\d+)"?/i)?.[1] ?? '';
    return {
      ok: true,
      tx: {
        transactionId,
        orderCode,
        statusId: String(d.statusId ?? ''),
        amountCents: Math.round(Number(d.amount ?? 0) * 100),   // response amount is in euros
        currencyCode: String(d.currencyCode ?? ''),
        merchantTrns: String(d.merchantTrns ?? ''),
        email: typeof d.email === 'string' ? d.email : null,
      },
    };
  } catch (e) {
    return { ok: false, status: 502, error: e instanceof Error ? e.message : 'viva_tx_failed' };
  }
}

/**
 * Refund (cancel) a transaction, fully or partially.
 * Viva "Cancel transaction" API: DELETE /api/transactions/{id}?amount=…, Basic auth.
 */
export async function refundTransaction(transactionId: string, amountCents: number): Promise<{ ok: true; refundTransactionId: string | null } | { ok: false; error: string }> {
  try {
    const q = new URLSearchParams({ amount: String(amountCents) });
    if (process.env.VIVA_SOURCE_CODE) q.set('sourceCode', process.env.VIVA_SOURCE_CODE);
    const res = await fetch(`${hosts().www}/api/transactions/${encodeURIComponent(transactionId)}/?${q}`, {
      method: 'DELETE',
      headers: { Authorization: basicAuth() },
      cache: 'no-store',
    });
    const d = await res.json().catch(() => ({})) as { Success?: boolean; StatusId?: string; TransactionId?: string; ErrorText?: string };
    if (!res.ok || d.Success === false || (d.StatusId && d.StatusId !== 'F')) {
      return { ok: false, error: d.ErrorText || `viva_refund_failed_${res.status}` };
    }
    return { ok: true, refundTransactionId: d.TransactionId ?? null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'viva_refund_failed' };
  }
}

/** Key Viva expects our webhook URL to echo back (GET) when it is verified in Self Care. */
export async function webhookVerificationKey(): Promise<string | null> {
  const res = await fetch(`${hosts().www}/api/messages/config/token`, {
    headers: { Authorization: basicAuth() },
    cache: 'no-store',
  });
  const d = await res.json().catch(() => ({})) as { Key?: string };
  return res.ok && d.Key ? d.Key : null;
}

// ── Our reference on the order (merchantTrns) ──
// Compact, pipe-separated; set server-side only, so it is trusted once read
// back from a transaction we fetched ourselves.

export type BillingRef = {
  listingId: string;
  ownerId: string;
  plan: string;
  renewal: boolean;
  discountCode: string | null;
  discountCents: number;
};

export function encodeBillingRef(r: BillingRef): string {
  return ['lb1', r.listingId, r.ownerId, r.plan, r.renewal ? '1' : '0', r.discountCode ?? '', String(r.discountCents)].join('|');
}

export function decodeBillingRef(s: string): BillingRef | null {
  const p = s.split('|');
  if (p.length !== 7 || p[0] !== 'lb1' || !p[1]) return null;
  return {
    listingId: p[1],
    ownerId: p[2],
    plan: p[3] || 'annual',
    renewal: p[4] === '1',
    discountCode: p[5] || null,
    discountCents: Number(p[6]) || 0,
  };
}
