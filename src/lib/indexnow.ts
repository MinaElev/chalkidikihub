/**
 * IndexNow — ping Bing, Yandex, Seznam, Naver (and downstream LLMs
 * that consume their indexes) the moment content changes, instead
 * of waiting for a crawler revisit.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * The key file must be hosted at `/<INDEXNOW_KEY>.txt` containing
 * the key as its body. We keep the file in `public/` so Next.js
 * serves it statically at the root — see public/<key>.txt.
 */

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ||
  '3048a9dec689df1844229f4e2af15f792284442338e127ea622541d0e8e52c97';

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  error?: string;
}

/**
 * Submit one or more URLs to IndexNow. Returns a summary — never throws
 * (ping failures shouldn't break content mutations). Silently no-ops in
 * development unless `INDEXNOW_FORCE=1` is set.
 */
export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  const clean = urls.filter((u) => u && u.startsWith('http'));
  if (clean.length === 0) {
    return { ok: true, status: 204, submitted: 0 };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
  const host = new URL(siteUrl).host;

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.INDEXNOW_FORCE !== '1'
  ) {
    return { ok: true, status: 0, submitted: clean.length };
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
        urlList: clean.slice(0, 10_000),
      }),
    });
    return { ok: res.ok, status: res.status, submitted: clean.length };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
