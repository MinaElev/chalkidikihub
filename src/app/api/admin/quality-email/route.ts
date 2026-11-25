// Guard: superadmin only (requireSuperAdmin on every method).
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { listingIssues, type QualityIssue } from '@/lib/listing-quality';
import { qualityEmail } from '@/lib/email/quality-email';

export const maxDuration = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const REPLY_TO = 'mnc@hotmail.gr';
const LOG_PREFIX = 'Mass email (quality)';
/** Owner emails inside: never let the nginx proxy cache keep a copy. */
const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

type OwnerReport = {
  ownerId: string;
  email: string;
  name: string | null;
  listings: { id: string; title: string; issues: QualityIssue[] }[];
  lastSentAt: string | null;
};

/**
 * Published, open listings with at least one quality issue, grouped by owner.
 * Owners without an email are skipped (nothing to send to).
 */
async function buildReports(onlyOwners?: string[]): Promise<OwnerReport[]> {
  const db = createAdminClient();
  let q = db.from('listings')
    .select('id, owner_id, title_el, description_el, amenities, latitude, longitude, contact_phone, contact_email, price_per_night, guests_max, bedrooms, bathrooms, check_in_time, check_out_time, check_in_info_el, how_to_reach_el, parking_info_el, wifi_info_el, rule_smoking, rule_pets, rule_parties, rule_kids, listing_images(id)')
    .eq('status', 'published')
    .not('owner_id', 'is', null);
  if (onlyOwners?.length) q = q.in('owner_id', onlyOwners);
  const { data: rows, error } = await q;
  if (error) throw new Error(error.message);

  const byOwner = new Map<string, OwnerReport['listings']>();
  for (const r of rows || []) {
    const issues = listingIssues({ ...r, photo_count: Array.isArray(r.listing_images) ? r.listing_images.length : 0 });
    if (!issues.length) continue;
    const list = byOwner.get(r.owner_id) || [];
    list.push({ id: r.id, title: r.title_el || '(χωρίς τίτλο)', issues });
    byOwner.set(r.owner_id, list);
  }
  if (!byOwner.size) return [];

  const ids = [...byOwner.keys()];
  const { data: profiles } = await db.from('profiles').select('id, email, full_name').in('id', ids);

  // When each owner last got this email (from the send log).
  const { data: logs } = await db.from('activity_logs')
    .select('created_at, details').eq('type', 'admin_action').like('message', `${LOG_PREFIX}%`)
    .order('created_at', { ascending: false }).limit(200);
  const lastSent = new Map<string, string>();
  for (const log of logs || []) {
    const sentTo = ((log.details as { sentOwnerIds?: string[] })?.sentOwnerIds) || [];
    for (const id of sentTo) if (!lastSent.has(id)) lastSent.set(id, log.created_at);
  }

  return (profiles || [])
    .filter((p) => p.email)
    .map((p) => ({
      ownerId: p.id,
      email: p.email as string,
      name: p.full_name || null,
      listings: byOwner.get(p.id) || [],
      lastSentAt: lastSent.get(p.id) || null,
    }))
    .sort((a, b) => b.listings.reduce((n, l) => n + l.issues.length, 0) - a.listings.reduce((n, l) => n + l.issues.length, 0));
}

/** GET → the report; GET ?preview=<ownerId> → that owner's email, rendered. */
export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const previewId = req.nextUrl.searchParams.get('preview');
    if (previewId) {
      const [r] = await buildReports([previewId]);
      if (!r) return NextResponse.json({ error: 'no_issues' }, { status: 404, ...NO_STORE });
      const mail = qualityEmail({ ownerName: r.name, listings: r.listings, siteUrl: SITE });
      return NextResponse.json({ to: r.email, subject: mail.subject, html: mail.html }, NO_STORE);
    }
    return NextResponse.json({ owners: await buildReports() }, NO_STORE);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

/** POST { ownerIds } → sends each owner their personalised email (call in batches). */
export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { ownerIds, batchIndex, batchTotal } = await req.json() as { ownerIds?: string[]; batchIndex?: number; batchTotal?: number };
    if (!Array.isArray(ownerIds) || !ownerIds.length) return NextResponse.json({ error: 'ownerIds required' }, { status: 400 });
    if (ownerIds.length > 25) return NextResponse.json({ error: 'max 25 per batch' }, { status: 400 });

    // Re-check now, so an owner who fixed things since the preview gets nothing.
    const reports = await buildReports(ownerIds);
    const transporter = await createMailTransport(undefined, undefined, { pool: true, maxConnections: 1, maxMessages: 100, rateDelta: 1000, rateLimit: 4 });
    const from = await mailFrom();

    const results: { ownerId: string; email: string; ok: boolean; error?: string }[] = [];
    for (const r of reports) {
      const mail = qualityEmail({ ownerName: r.name, listings: r.listings, siteUrl: SITE });
      try {
        await transporter.sendMail({ from, to: r.email, replyTo: REPLY_TO, ...mail });
        results.push({ ownerId: r.ownerId, email: r.email, ok: true });
      } catch (err) {
        results.push({ ownerId: r.ownerId, email: r.email, ok: false, error: (err as Error).message });
      }
    }
    transporter.close();

    const sent = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);
    const skipped = ownerIds.filter((id) => !reports.some((r) => r.ownerId === id));
    const batchLabel = batchTotal && batchTotal > 1 ? ` (${(batchIndex ?? 0) + 1}/${batchTotal})` : '';
    await createAdminClient().from('activity_logs').insert({
      type: 'admin_action',
      severity: failed.length ? 'warning' : 'info',
      message: `${LOG_PREFIX}${batchLabel}: ${sent.length} delivered, ${failed.length} failed`,
      details: {
        subject: 'Ενημέρωση για ελλείψεις καταχωρήσεων (εξατομικευμένο)',
        recipientCount: results.length,
        sent: sent.length,
        failed: failed.length,
        emails: results.map((r) => r.email),
        failedEmails: failed.map((r) => r.email),
        errors: failed.map((r) => `${r.email}: ${r.error}`),
        sentOwnerIds: sent.map((r) => r.ownerId),
        skippedOwnerIds: skipped,
        listings: reports.flatMap((r) => r.listings.map((l) => ({ id: l.id, issues: l.issues.map((i) => i.key) }))),
      },
    });

    return NextResponse.json({ sent: sent.length, failed: failed.length, skipped: skipped.length, results });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
