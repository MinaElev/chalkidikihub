// Viva smoke test — checks credentials against the configured environment
// (VIVA_ENV, default demo) without touching the database.
//   node scripts/viva-smoke.mjs            → token, webhook key, 1.00€ test order
//   node scripts/viva-smoke.mjs <txId>     → also retrieve that transaction (field check)
// Never prints secret values.
import { readFileSync } from 'node:fs';

const env = { ...process.env };
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env.local */ }

const live = env.VIVA_ENV === 'live';
const H = live
  ? { accounts: 'https://accounts.vivapayments.com', api: 'https://api.vivapayments.com', www: 'https://www.vivapayments.com' }
  : { accounts: 'https://demo-accounts.vivapayments.com', api: 'https://demo-api.vivapayments.com', www: 'https://demo.vivapayments.com' };
console.log(`Environment: ${live ? 'LIVE' : 'demo'}`);

const missing = ['VIVA_CLIENT_ID', 'VIVA_CLIENT_SECRET', 'VIVA_SOURCE_CODE', 'VIVA_MERCHANT_ID', 'VIVA_API_KEY'].filter((k) => !env[k]);
if (missing.length) { console.log('Missing:', missing.join(', ')); process.exit(1); }

const b64 = (s) => Buffer.from(s).toString('base64');
let ok = true;

// 1) OAuth token (Smart Checkout credentials)
const tr = await fetch(`${H.accounts}/connect/token`, {
  method: 'POST',
  headers: { Authorization: `Basic ${b64(`${env.VIVA_CLIENT_ID}:${env.VIVA_CLIENT_SECRET}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'grant_type=client_credentials',
});
const tj = await tr.json().catch(() => ({}));
console.log(`1) OAuth token: ${tr.ok && tj.access_token ? 'OK' : `FAILED (${tr.status})`}`);
if (!tj.access_token) process.exit(1);

// 2) Webhook verification key (Merchant ID / API Key)
const kr = await fetch(`${H.www}/api/messages/config/token`, { headers: { Authorization: `Basic ${b64(`${env.VIVA_MERCHANT_ID}:${env.VIVA_API_KEY}`)}` } });
const kj = await kr.json().catch(() => ({}));
console.log(`2) Webhook key: ${kr.ok && kj.Key ? 'OK' : `FAILED (${kr.status})`}`);
ok &&= Boolean(kj.Key);

// 3) 1.00€ test order on the payment source
const or = await fetch(`${H.api}/checkout/v2/orders`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${tj.access_token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100, customerTrns: 'ChalkidikiHub — δοκιμαστική πληρωμή', merchantTrns: 'smoke-test',
    sourceCode: env.VIVA_SOURCE_CODE, paymentTimeout: 1800,
    customer: { countryCode: 'GR', requestLang: 'el-GR' },
  }),
});
const otext = await or.text();
const orderCode = otext.match(/"orderCode"\s*:\s*"?(\d+)"?/i)?.[1];
console.log(`3) Create order: ${or.ok && orderCode ? `OK → ${H.www}/web/checkout?ref=${orderCode}` : `FAILED (${or.status}) ${otext.slice(0, 300)}`}`);
ok &&= Boolean(orderCode);

// 4) Optional: retrieve a transaction and show its shape (no card data printed)
const txId = process.argv[2];
if (txId) {
  const xr = await fetch(`${H.api}/checkout/v2/transactions/${txId}`, { headers: { Authorization: `Bearer ${tj.access_token}` } });
  const xj = await xr.json().catch(() => ({}));
  const pick = ({ statusId, amount, orderCode, currencyCode, merchantTrns, transactionTypeId }) => ({ statusId, amount, orderCode, currencyCode, merchantTrns, transactionTypeId });
  console.log(`4) Retrieve transaction: ${xr.ok ? 'OK' : `FAILED (${xr.status})`}`, xr.ok ? pick(xj) : '');
  if (xr.ok) console.log('   fields:', Object.keys(xj).join(', '));
}

process.exit(ok ? 0 : 1);
