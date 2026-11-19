/**
 * Params for detail pages whose list comes from the database (listings,
 * beaches, places, restaurants, articles, …).
 *
 * By default these pages are NOT prerendered at build time: each one renders
 * on its first visit and is then cached for the page's `revalidate` window
 * (ISR, `dynamicParams` stays true). Prerendering all of them in 7 locales
 * turned the Plesk upload bundle from ~0.4 GB into ~3.4 GB.
 *
 * Set PREBUILD_DETAIL_PAGES=1 at build time to prerender them anyway.
 */
export async function detailParams<T>(load: () => Promise<T[]>): Promise<T[]> {
  return process.env.PREBUILD_DETAIL_PAGES === '1' ? load() : [];
}
