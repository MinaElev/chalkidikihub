// Shared helper: tell the LIVE site to purge its CDN + data cache for content
// changed by a push script. Without this, edits written straight to Supabase
// stay invisible on the site until the ISR TTL expires (30 days).
//
// Calls POST /api/revalidate on the deployed site, once per changed slug.
// Best-effort: logs failures but never throws, so a transient network blip
// can't abort a bulk push that already wrote to the DB.
//
// Env (read from .env.local by the calling script):
//   REVALIDATE_SITE_URL  base URL of the live site (default https://chalkidikihub.gr)
//   REVALIDATE_TOKEN     shared secret; must match the same var set in Vercel.
//                        Omit it and the call still works while the endpoint
//                        is open, but anyone could trigger revalidation.

const SITE_URL = (process.env.REVALIDATE_SITE_URL || 'https://chalkidikihub.gr').replace(/\/$/, '');
const TOKEN = process.env.REVALIDATE_TOKEN || '';

/**
 * Revalidate a content type for the given slugs (deduped, empties dropped).
 * Sends ONE batched request — the endpoint clears the tag/homepage/collection
 * once and revalidates each detail slug. Pass an empty list to just refresh the
 * collection page. Never throws — failures are logged.
 *
 * @param {string}   type      one of the TYPE_PATHS keys in /api/revalidate
 *                             (beaches | restaurants | activities | blog | listings |
 *                              sales | villages | areas | host)
 * @param {string[]} [slugs]
 * @param {string[]} [locales] optional subset (e.g. ['el']) when only some
 *                             languages changed; omit to touch all 7.
 */
async function revalidate(type, slugs = [], locales = null) {
  const unique = [...new Set((slugs || []).filter(Boolean))];
  const headers = { 'Content-Type': 'application/json' };
  if (TOKEN) headers['x-revalidate-token'] = TOKEN;
  const body = { type };
  if (unique.length) body.slugs = unique;
  if (Array.isArray(locales) && locales.length) body.locales = locales;

  try {
    const res = await fetch(`${SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const scope = unique.length ? `${unique.length} slug(s)` : 'collection';
    const loc = Array.isArray(locales) && locales.length ? ` [${locales.join(',')}]` : '';
    console.log(`Revalidated ${type} on ${SITE_URL}: ${scope}${loc} in 1 request`);
  } catch (e) {
    console.error(`  revalidate ${type} failed: ${e.message}`);
  }
}

module.exports = { revalidate };
