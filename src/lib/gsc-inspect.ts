// Core URL-Inspection batch logic, shared by the admin route
// (/api/admin/gsc/inspect) and the daily cron (/api/cron/gsc-inspect).
//
// Seeds the URL universe (sitemap ∪ Search-Analytics pages), inspects the next
// batch within quota (2000/day, 600/min), stores per-URL verdicts in
// gsc_url_index, and recomputes the gsc_coverage aggregate. On 429 it stops
// cleanly and records quota_hit so the next run resumes at the oldest URLs.

import type { createAdminClient } from '@/lib/api-helpers';
import { inspectUrl, GscQuotaError, type UrlInspection } from '@/lib/gsc';
import { enumerateSitemapUrls } from '@/lib/gsc-urls';

type AdminSupabase = ReturnType<typeof createAdminClient>;

export const MAX_DAILY = 1900;       // ceiling below the 2000/day quota
const RATE_SPACING_MS = 120;         // ≥120ms between starts → ~500/min ≪ 600/min
// Google's inspect latency (~3s/call, measured) — not the spacing — is the real
// throughput limiter: throughput ≈ CONCURRENCY / latency. At 10 that's ~3.3/s
// (≈200/min, safely under the 600/min cap), so a ~800-URL batch finishes in
// ~240s, inside Vercel's 300s function cap. Bigger batches at lower concurrency
// blow past 300s and get truncated mid-run (leaving the run row 'running').
const CONCURRENCY = 10;

async function seedUniverse(supabase: AdminSupabase): Promise<number> {
  const sitemapUrls = await enumerateSitemapUrls();
  const sitemapSet = new Set(sitemapUrls);

  // Refresh the in_sitemap flag so "in-sitemap but non-indexed" stays honest.
  await supabase.from('gsc_url_index').update({ in_sitemap: false }).eq('in_sitemap', true);

  const now = new Date().toISOString();
  let seeded = 0;
  for (let i = 0; i < sitemapUrls.length; i += 500) {
    const chunk = sitemapUrls.slice(i, i + 500).map((url) => ({ url, in_sitemap: true, first_seen_at: now }));
    const { error } = await supabase.from('gsc_url_index').upsert(chunk, { onConflict: 'url', ignoreDuplicates: false });
    if (error) throw new Error(`seed sitemap: ${error.message}`);
    seeded += chunk.length;
  }

  // Orphan/legacy URLs GSC already knows from Search Analytics.
  const { data: knownPages } = await supabase.from('gsc_pages_28d').select('page');
  const extra = (knownPages || [])
    .map((p) => p.page as string)
    .filter((u) => u && u.startsWith('http') && !sitemapSet.has(u));
  for (let i = 0; i < extra.length; i += 500) {
    const chunk = extra.slice(i, i + 500).map((url) => ({ url, in_sitemap: false, first_seen_at: now }));
    await supabase.from('gsc_url_index').upsert(chunk, { onConflict: 'url', ignoreDuplicates: true });
  }
  return seeded;
}

async function inspectPool(supabase: AdminSupabase, urls: string[]): Promise<{ inspected: number; quotaHit: boolean }> {
  let nextStart = 0;
  let cursor = 0;
  let inspected = 0;
  let quotaHit = false;
  let stop = false;
  const now = () => new Date().toISOString();

  async function worker() {
    while (!stop) {
      const idx = cursor++;
      if (idx >= urls.length) return;
      const wait = nextStart - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      nextStart = Date.now() + RATE_SPACING_MS;

      const url = urls[idx];
      try {
        const r: UrlInspection = await inspectUrl(supabase, url);
        await supabase.from('gsc_url_index').upsert({
          url: r.url,
          coverage_state: r.coverageState,
          verdict: r.verdict,
          robots_txt_state: r.robotsTxtState,
          indexing_state: r.indexingState,
          page_fetch_state: r.pageFetchState,
          google_canonical: r.googleCanonical,
          user_canonical: r.userCanonical,
          crawled_as: r.crawledAs,
          referring_urls: r.referringUrls,
          last_crawl_time: r.lastCrawlTime,
          is_indexed: r.isIndexed,
          last_inspected_at: now(),
          inspect_error: null,
          raw: r.raw,
        }, { onConflict: 'url' });
        inspected++;
      } catch (e) {
        if (e instanceof GscQuotaError) { quotaHit = true; stop = true; return; }
        await supabase.from('gsc_url_index').update({ last_inspected_at: now(), inspect_error: String(e).slice(0, 300) }).eq('url', url);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return { inspected, quotaHit };
}

export type InspectResult = { ok: true; seeded: number; inspected: number; quota_hit: boolean; batch_size: number };

export async function runInspectBatch(
  supabase: AdminSupabase,
  opts: { trigger: 'cron' | 'manual'; limit: number; seed: boolean },
): Promise<InspectResult> {
  const { data: run } = await supabase.from('gsc_inspect_runs').insert({ status: 'running', trigger: opts.trigger }).select('id').single();
  const runId = run?.id;
  const finish = async (status: 'success' | 'failed', extra: Record<string, unknown>) => {
    if (runId) await supabase.from('gsc_inspect_runs').update({ status, finished_at: new Date().toISOString(), ...extra }).eq('id', runId);
  };

  try {
    let seeded = 0;
    if (opts.seed) {
      seeded = await seedUniverse(supabase);
    } else {
      const { count } = await supabase.from('gsc_url_index').select('*', { count: 'exact', head: true });
      if (!count) seeded = await seedUniverse(supabase);
    }

    const { data: queue, error: qErr } = await supabase
      .from('gsc_url_index')
      .select('url')
      .order('last_inspected_at', { ascending: true, nullsFirst: true })
      .limit(opts.limit);
    if (qErr) throw new Error(`queue: ${qErr.message}`);

    const urls = (queue || []).map((r) => r.url as string);
    const { inspected, quotaHit } = await inspectPool(supabase, urls);

    await supabase.rpc('gsc_recompute_coverage');
    await finish('success', { urls_seeded: seeded, urls_inspected: inspected, quota_hit: quotaHit });
    return { ok: true, seeded, inspected, quota_hit: quotaHit, batch_size: urls.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await finish('failed', { error: msg.slice(0, 500) });
    throw new Error(msg);
  }
}
