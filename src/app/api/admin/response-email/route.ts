// Guard: superadmin only (requireSuperAdmin on every method).
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { ownerResponseRates, RESPONSE_LOG_PREFIX } from '@/lib/response-rates';
import { responseEmail } from '@/lib/email/response-email';

export const maxDuration = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const REPLY_TO = 'mnc@hotmail.gr';
/** Owner emails inside: never let the nginx proxy cache keep a copy. */
const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

/** GET → every owner's response rate; GET ?preview=<ownerId>&list=1 → that owner's email, rendered. */
export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const previewId = req.nextUrl.searchParams.get('preview');
    if (previewId) {
      const [r] = await ownerResponseRates(SITE, [previewId]);
      if (!r) return NextResponse.json({ error: 'Δεν βρέθηκαν αιτήματα για αυτόν τον ιδιοκτήτη' }, { status: 404, ...NO_STORE });
      const mail = responseEmail(r, { includeList: req.nextUrl.searchParams.get('list') === '1', siteUrl: SITE });
      return NextResponse.json({ to: r.email, subject: mail.subject, html: mail.html }, NO_STORE);
    }
    return NextResponse.json({ owners: await ownerResponseRates(SITE) }, NO_STORE);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, ...NO_STORE });
  }
}

/** POST { ownerIds, includeList } → sends each owner their own numbers (call in batches). */
export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const { ownerIds, includeList, batchIndex, batchTotal } = await req.json() as {
      ownerIds?: string[]; includeList?: boolean; batchIndex?: number; batchTotal?: number;
    };
    if (!Array.isArray(ownerIds) || !ownerIds.length) return NextResponse.json({ error: 'ownerIds required' }, { status: 400 });
    if (ownerIds.length > 25) return NextResponse.json({ error: 'max 25 per batch' }, { status: 400 });

    // Fresh numbers at send time, so the email never shows a stale rate.
    const rates = await ownerResponseRates(SITE, ownerIds);
    const transporter = await createMailTransport(undefined, undefined, { pool: true, maxConnections: 1, maxMessages: 100, rateDelta: 1000, rateLimit: 4 });
    const from = await mailFrom();

    const results: { ownerId: string; email: string; rate: number; ok: boolean; error?: string }[] = [];
    for (const r of rates) {
      const mail = responseEmail(r, { includeList: !!includeList, siteUrl: SITE });
      try {
        await transporter.sendMail({ from, to: r.email, replyTo: REPLY_TO, ...mail });
        results.push({ ownerId: r.ownerId, email: r.email, rate: r.rate, ok: true });
      } catch (err) {
        results.push({ ownerId: r.ownerId, email: r.email, rate: r.rate, ok: false, error: (err as Error).message });
      }
    }
    transporter.close();

    const sent = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);
    const skipped = ownerIds.filter((id) => !rates.some((r) => r.ownerId === id));
    const batchLabel = batchTotal && batchTotal > 1 ? ` (${(batchIndex ?? 0) + 1}/${batchTotal})` : '';
    await createAdminClient().from('activity_logs').insert({
      type: 'admin_action',
      severity: failed.length ? 'warning' : 'info',
      message: `${RESPONSE_LOG_PREFIX}${batchLabel}: ${sent.length} delivered, ${failed.length} failed`,
      details: {
        subject: 'Μια μικρή παράκληση για τα αιτήματα των επισκεπτών',
        includeList: !!includeList,
        recipientCount: results.length,
        sent: sent.length,
        failed: failed.length,
        emails: results.map((r) => r.email),
        failedEmails: failed.map((r) => r.email),
        errors: failed.map((r) => `${r.email}: ${r.error}`),
        sentOwnerIds: sent.map((r) => r.ownerId),
        rates: sent.map((r) => ({ ownerId: r.ownerId, rate: r.rate })),
        skippedOwnerIds: skipped,
      },
    });

    return NextResponse.json({ sent: sent.length, failed: failed.length, skipped: skipped.length, results });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
