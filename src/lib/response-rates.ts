/**
 * How often each owner answers guests: mass availability requests (one per
 * owner, "available / alternative / not available") plus one-click inquiries
 * from a listing's page (one per listing). Used by Admin → Mass Email to pick
 * owners for the polite "please press 'not available'" reminder.
 *
 * Server-only (service role). A request only counts once the owner has had
 * GRACE_HOURS to answer, so a request sent this morning isn't "unanswered".
 */
import { createAdminClient } from '@/lib/api-helpers';

const GRACE_HOURS = 48;
const WINDOW_DAYS = 365;
export const RESPONSE_LOG_PREFIX = 'Mass email (response rate)';

export type UnansweredRequest = {
  area: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  sentAt: string;
  /** Where the owner can still answer, while the request is open. */
  url: string | null;
};

export type OwnerResponseRate = {
  ownerId: string;
  email: string;
  name: string | null;
  /** Requests the owner had time to answer, and how many they did. */
  received: number;
  answered: number;
  /** 0–100, rounded. */
  rate: number;
  mass: { received: number; answered: number; unavailable: number };
  /** One row per listing that got inquiries from its own page. */
  listings: { id: string; title: string; received: number; answered: number }[];
  /** Most recent first, at most 10. */
  unanswered: UnansweredRequest[];
  lastSentAt: string | null;
};

type Db = ReturnType<typeof createAdminClient>;

/** Every row of a select, in 1,000-row pages (PostgREST caps a page at 1,000). */
async function all<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await page(from, from + 999);
    if (error) throw new Error(error.message);
    out.push(...(data || []));
    if (!data || data.length < 1000) return out;
  }
}

export async function ownerResponseRates(siteUrl: string, onlyOwners?: string[], db: Db = createAdminClient()): Promise<OwnerResponseRate[]> {
  const now = Date.now();
  const until = new Date(now - GRACE_HOURS * 3600e3).toISOString();
  const since = new Date(now - WINDOW_DAYS * 86400e3).toISOString();
  const only = onlyOwners?.length ? onlyOwners : null;

  type Rec = { request_id: string; owner_id: string; sent_at: string; response_token: string | null };
  type Resp = { request_id: string; owner_id: string; status: string };
  type Inq = { listing_id: string; owner_id: string | null; reply_status: string | null };

  const recipients = await all<Rec>((f, t) => {
    let q = db.from('availability_request_recipients')
      .select('request_id, owner_id, sent_at, response_token')
      .eq('send_status', 'sent').gte('sent_at', since).lte('sent_at', until);
    if (only) q = q.in('owner_id', only);
    return q.order('sent_at', { ascending: false }).range(f, t);
  });
  const responses = await all<Resp>((f, t) => {
    let q = db.from('availability_responses').select('request_id, owner_id, status');
    if (only) q = q.in('owner_id', only);
    return q.range(f, t);
  });
  // The inquiries table is new; if it isn't there yet, rates use mass requests only.
  const inquiries = await all<Inq>((f, t) => {
    let q = db.from('listing_inquiries').select('listing_id, owner_id, reply_status')
      .gte('created_at', since).lte('created_at', until);
    if (only) q = q.in('owner_id', only);
    return q.range(f, t);
  }).catch(() => [] as Inq[]);

  const answer = new Map(responses.map((r) => [`${r.request_id}|${r.owner_id}`, r.status]));

  // Request details, for the list of unanswered ones.
  const reqIds = [...new Set(recipients.map((r) => r.request_id))];
  type Req = { id: string; area: string | null; check_in: string | null; check_out: string | null; adults: number | null; children: number | null; status: string; expires_at: string };
  const reqs = new Map<string, Req>();
  for (let i = 0; i < reqIds.length; i += 200) {
    const { data } = await db.from('availability_requests')
      .select('id, area, check_in, check_out, adults, children, status, expires_at')
      .in('id', reqIds.slice(i, i + 200));
    for (const r of (data || []) as Req[]) reqs.set(r.id, r);
  }

  const byOwner = new Map<string, Omit<OwnerResponseRate, 'ownerId' | 'email' | 'name' | 'rate' | 'received' | 'answered' | 'lastSentAt'>>();
  const get = (id: string) => {
    let o = byOwner.get(id);
    if (!o) { o = { mass: { received: 0, answered: 0, unavailable: 0 }, listings: [], unanswered: [] }; byOwner.set(id, o); }
    return o;
  };

  for (const r of recipients) {
    const o = get(r.owner_id);
    o.mass.received++;
    const status = answer.get(`${r.request_id}|${r.owner_id}`);
    if (status) {
      o.mass.answered++;
      if (status === 'unavailable') o.mass.unavailable++;
    } else if (o.unanswered.length < 10) {
      const q = reqs.get(r.request_id);
      const open = q && q.status === 'active' && new Date(q.expires_at).getTime() > now;
      o.unanswered.push({
        area: q?.area ?? null,
        checkIn: q?.check_in ?? null,
        checkOut: q?.check_out ?? null,
        guests: (q?.adults || 0) + (q?.children || 0),
        sentAt: r.sent_at,
        url: open && r.response_token ? `${siteUrl}/r/${r.response_token}` : null,
      });
    }
  }

  const perListing = new Map<string, { owner: string; received: number; answered: number }>();
  for (const i of inquiries) {
    if (!i.owner_id) continue;
    const l = perListing.get(i.listing_id) || { owner: i.owner_id, received: 0, answered: 0 };
    l.received++;
    if (i.reply_status) l.answered++;
    perListing.set(i.listing_id, l);
    get(i.owner_id);
  }
  if (perListing.size) {
    const { data } = await db.from('listings').select('id, title_el').in('id', [...perListing.keys()]);
    const titles = new Map((data || []).map((l) => [l.id as string, (l.title_el as string) || '(χωρίς τίτλο)']));
    for (const [id, l] of perListing) get(l.owner).listings.push({ id, title: titles.get(id) || '(χωρίς τίτλο)', received: l.received, answered: l.answered });
  }

  if (!byOwner.size) return [];
  const ids = [...byOwner.keys()];
  const profiles: { id: string; email: string | null; full_name: string | null }[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await db.from('profiles').select('id, email, full_name').in('id', ids.slice(i, i + 200));
    profiles.push(...(data || []));
  }

  // When each owner last got this reminder (from the send log).
  const { data: logs } = await db.from('activity_logs')
    .select('created_at, details').eq('type', 'admin_action').like('message', `${RESPONSE_LOG_PREFIX}%`)
    .order('created_at', { ascending: false }).limit(200);
  const lastSent = new Map<string, string>();
  for (const log of logs || []) {
    for (const id of ((log.details as { sentOwnerIds?: string[] })?.sentOwnerIds) || []) {
      if (!lastSent.has(id)) lastSent.set(id, log.created_at);
    }
  }

  return profiles
    .filter((p) => p.email)
    .map((p) => {
      const o = byOwner.get(p.id)!;
      const received = o.mass.received + o.listings.reduce((n, l) => n + l.received, 0);
      const answered = o.mass.answered + o.listings.reduce((n, l) => n + l.answered, 0);
      return {
        ownerId: p.id,
        email: p.email as string,
        name: p.full_name || null,
        received,
        answered,
        rate: received ? Math.round((answered / received) * 100) : 0,
        ...o,
        lastSentAt: lastSent.get(p.id) || null,
      };
    })
    .filter((o) => o.received > 0)
    .sort((a, b) => a.rate - b.rate || b.received - a.received);
}
