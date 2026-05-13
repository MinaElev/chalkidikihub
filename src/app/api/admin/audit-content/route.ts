import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { GUIDES } from '@/app/[locale]/guide/[slug]/guide-data';
import { FAQ_PAGES } from '@/app/[locale]/faq/[slug]/faq-data';
import { visibleWordCount } from '@/lib/content-quality';

// GET /api/admin/audit-content
//
// Reports word counts per (route, slug, locale) for /guide, /faq and
// /places (villages.description_<locale>) — the same shape the offline
// audit script produces, but factors in guide_overrides written by the
// AI bulk runs so the report reflects what users actually see.

export const dynamic = 'force-dynamic';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];
const THIN = 150;
const OK_HI = 300;

function bucketOf(w: number) {
  if (w < THIN) return 'thin' as const;
  if (w < OK_HI) return 'ok' as const;
  return 'good' as const;
}

export async function GET() {
  const supabase = createAdminClient();

  // Pull guide overrides + villages in parallel.
  const [overridesRes, villagesRes] = await Promise.all([
    supabase.from('guide_overrides').select('slug, locale, content'),
    supabase
      .from('villages')
      .select('slug, description_el, description_en, description_de, description_bg, description_ru, description_ro, description_sr'),
  ]);

  const overrides = new Map<string, string>();
  for (const row of overridesRes.data || []) {
    overrides.set(`${row.slug}|${row.locale}`, row.content || '');
  }

  type Row = { route: string; slug: string; locale: string; words: number; bucket: 'thin' | 'ok' | 'good' };
  const rows: Row[] = [];

  // /guide — prefer override, else data file.
  for (const g of GUIDES) {
    for (const loc of LOCALES) {
      const override = overrides.get(`${g.slug}|${loc}`);
      const text = (override || g.content[loc] || '') as string;
      const w = visibleWordCount(text);
      rows.push({ route: '/guide', slug: g.slug, locale: loc, words: w, bucket: bucketOf(w) });
    }
  }

  // /faq — static data file only (no override mechanism in scope).
  for (const page of FAQ_PAGES) {
    for (const loc of LOCALES) {
      let total = 0;
      for (const e of page.faqs || []) {
        total += visibleWordCount(e.question?.[loc]);
        total += visibleWordCount(e.answer?.[loc]);
      }
      rows.push({ route: '/faq', slug: page.slug, locale: loc, words: total, bucket: bucketOf(total) });
    }
  }

  // /places — villages table.
  for (const v of villagesRes.data || []) {
    for (const loc of LOCALES) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = ((v as any)[`description_${loc}`] || '') as string;
      const w = visibleWordCount(text);
      rows.push({ route: '/places', slug: v.slug, locale: loc, words: w, bucket: bucketOf(w) });
    }
  }

  // Per-(route, locale) summary
  const summary: Record<string, { thin: number; ok: number; good: number; total: number }> = {};
  for (const r of rows) {
    const k = `${r.route} ${r.locale}`;
    summary[k] = summary[k] || { thin: 0, ok: 0, good: 0, total: 0 };
    summary[k][r.bucket]++;
    summary[k].total++;
  }

  // Worst-first list for inspection (cap at 50).
  const thin = rows
    .filter((r) => r.bucket === 'thin')
    .sort((a, b) => a.words - b.words)
    .slice(0, 50);

  const totals = {
    total: rows.length,
    thin: rows.filter((r) => r.bucket === 'thin').length,
    ok: rows.filter((r) => r.bucket === 'ok').length,
    good: rows.filter((r) => r.bucket === 'good').length,
  };

  return NextResponse.json({
    thresholds: { thin: THIN, ok_high: OK_HI },
    totals,
    summary,
    thin_sample: thin,
  });
}
