// Guard: superadmin session.
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { locales } from '@/i18n/config';
import { requireSuperAdmin } from '@/lib/auth/guards';
import { TAGS } from '@/lib/db/cache';
import { getArticles } from '@/lib/db/content';
import { guides } from '@/lib/editorial';
import { pick } from '@/lib/i18n/localize';
import { adminDb } from '@/lib/supabase/clients';

const MAX_ARTICLES = 3;
// Covers must be files in our own public Storage (the only host next/image may load).
const storagePrefix = () => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;

/** GET /api/admin/guides: every live guide with its cover and articles, plus the articles to choose from. */
export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const { data, error } = await adminDb().from('guide_media').select('slug, image_url, article_slugs');
  // 42P01 / PGRST205: the table has not been created yet (scripts/sql/2026-11-guide-media.sql).
  const tableMissing = Boolean(error && (error.code === '42P01' || error.code === 'PGRST205'));
  if (error && !tableMissing) return NextResponse.json({ error: error.message }, { status: 500 });

  const media = new Map((data ?? []).map((r) => [r.slug as string, r]));
  const articles = await getArticles();
  return NextResponse.json({
    tableMissing,
    guides: guides().map((g) => ({
      slug: g.slug,
      title: g.title.el || g.title.en || g.slug,
      image: (media.get(g.slug)?.image_url as string | null) ?? null,
      articles: (media.get(g.slug)?.article_slugs as string[] | null) ?? [],
    })),
    articles: articles.map((a) => ({ slug: a.slug, title: pick(a, 'title', 'el') || a.slug })),
  });
}

/** PUT /api/admin/guides { slug, image: string | null, articles: string[] } */
export async function PUT(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => null)) as { slug?: unknown; image?: unknown; articles?: unknown } | null;
  const slug = typeof body?.slug === 'string' ? body.slug : '';
  if (!guides().some((g) => g.slug === slug)) return NextResponse.json({ error: 'Unknown guide' }, { status: 400 });

  const image = typeof body?.image === 'string' && body.image.trim() ? body.image.trim() : null;
  if (image && !image.startsWith(storagePrefix())) {
    return NextResponse.json({ error: 'The photo must be uploaded to the site storage' }, { status: 400 });
  }
  const known = new Set((await getArticles()).map((a) => a.slug));
  const articles = Array.isArray(body?.articles)
    ? [...new Set(body.articles.filter((s): s is string => typeof s === 'string' && known.has(s)))].slice(0, MAX_ARTICLES)
    : [];

  const { error } = await adminDb()
    .from('guide_media')
    .upsert({ slug, image_url: image, article_slugs: articles, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Every guide shows the other guides' covers, so all guide pages refresh.
  revalidateTag(TAGS.guides, { expire: 0 });
  for (const locale of locales) {
    revalidatePath(`/${locale}/guide`);
    for (const g of guides()) revalidatePath(`/${locale}/guide/${g.slug}`);
  }
  return NextResponse.json({ ok: true, slug, image, articles });
}
