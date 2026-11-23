// Read-only audit: where the site is missing photos, and where several pages share one.
// Usage: node scripts/images-audit.mjs [--no-check]
// Writes audit/missing-images.md and audit/missing-images.html (open the .html in a browser).
// --no-check skips the HTTP check that every photo actually loads.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const require = createRequire(path.join(root, 'package.json'));
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(
  fs.readFileSync(path.join(root, '.env.local'), 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')]; }),
);
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const SITE = 'https://chalkidikihub.gr';
const check = !process.argv.includes('--no-check');

/** Each content type: its table, public page, admin edit page and how it is named. */
const TYPES = [
  { key: 'villages', label: 'Χωριά', name: 'name_el', page: (r) => `/places/${r.slug}`, admin: (r) => `/admin/villages/${r.id}/edit`,
    note: 'Χωρίς δική του φωτογραφία, η σελίδα δείχνει τη φωτογραφία της κοντινότερης παραλίας.' },
  { key: 'events', label: 'Εκδηλώσεις', name: 'name_el', page: (r) => `/events/${r.slug}`, admin: () => '',
    note: 'Δεν υπάρχει φόρμα στο admin για εκδηλώσεις: στείλε τις φωτογραφίες και ανεβαίνουν από εμάς.' },
  { key: 'activities', label: 'Δραστηριότητες', name: 'name_el', page: (r) => `/activities/${r.slug}`, admin: (r) => `/admin/activities/${r.id}/edit` },
  { key: 'beaches', label: 'Παραλίες', name: 'name_el', page: (r) => `/beaches/${r.slug}`, admin: (r) => `/admin/beaches/${r.id}/edit` },
  { key: 'blog_articles', label: 'Άρθρα blog', name: 'title_el', page: (r) => `/blog/${r.slug}`, admin: (r) => `/admin/blog/${r.id}/edit`, where: (q) => q.not('published_at', 'is', null) },
  { key: 'restaurants', label: 'Εστιατόρια', name: 'name_el', page: (r) => `/restaurants/${r.slug}`, admin: (r) => `/admin/restaurants/${r.id}/edit` },
  { key: 'monasteries', label: 'Μονές Αγίου Όρους', name: 'name_el', page: (r) => `/mount-athos/monasteries/${r.slug}`, admin: (r) => `/admin/monasteries/${r.id}/edit` },
  { key: 'areas', label: 'Περιοχές', name: 'name_el', page: (r) => `/areas/${r.slug}`, admin: () => '/admin/areas' },
];

const empty = (u) => !u || !String(u).trim();

/** Blog posts that redirect to another page (merged into a guide or a village): their photo is never shown, so skip them. */
function redirectedBlogSlugs() {
  const src = fs.readFileSync(path.join(root, 'src/lib/seo/redirects.ts'), 'utf8');
  const keys = new Set();
  for (const name of ['BLOG_TO_PLACE', 'BLOG_MERGES']) {
    const start = src.indexOf(`export const ${name}`);
    if (start < 0) continue;
    const body = src.slice(src.indexOf('{', start), src.indexOf('\n};', start));
    for (const m of body.matchAll(/^\s*'([^']+)'\s*:/gm)) keys.add(m[1]);
  }
  return keys;
}
const HIDDEN_BLOG = redirectedBlogSlugs();
const abs = (u) => (u && u.startsWith('/') ? SITE + u : u);
async function loads(raw) {
  // Some photos are files of the site itself ("/images/areas/kassandra.jpg"): check them on the live site.
  const url = abs(raw);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (res.status === 405) return (await fetch(url, { signal: AbortSignal.timeout(15000) })).ok;
    return res.ok;
  } catch {
    return false;
  }
}
async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

/** Everything found, one entry per item; `kind` is missing | broken | shared | few. */
const found = [];
const summary = [];

for (const t of TYPES) {
  let q = db.from(t.key).select(`id, slug, ${t.name}, image_url`);
  if (t.where) q = t.where(q);
  const res = await q.limit(2000);
  if (res.error) { console.error(t.key, res.error.message); continue; }
  const data = t.key === 'blog_articles' ? res.data.filter((r) => !HIDDEN_BLOG.has(r.slug)) : res.data;
  const item = (r, kind, extra = {}) => ({
    type: t.key, typeLabel: t.label, kind, id: r.id, name: r[t.name] || r.slug,
    page: SITE + t.page(r), admin: t.admin(r) ? SITE + t.admin(r) : '', image: abs(r.image_url) || '', note: t.note || '', ...extra,
  });
  const missing = data.filter((r) => empty(r.image_url));
  const withImg = data.filter((r) => !empty(r.image_url));
  // The same photo on several items is usually a placeholder or a copy-paste.
  const byUrl = new Map();
  for (const r of withImg) byUrl.set(r.image_url, [...(byUrl.get(r.image_url) ?? []), r]);
  const groups = [...byUrl.values()].filter((g) => g.length > 1);
  const okList = check ? await pool(withImg.map((r) => r.image_url), 8, loads) : [];
  const broken = check ? withImg.filter((_, i) => !okList[i]) : [];

  missing.forEach((r) => found.push(item(r, 'missing')));
  broken.forEach((r) => found.push(item(r, 'broken')));
  groups.forEach((g, gi) => g.forEach((r) => found.push(item(r, 'shared', { group: `${t.key}-${gi}`, groupSize: g.length }))));
  summary.push({ label: t.label, total: data.length, missing: missing.length, broken: broken.length, shared: groups.flat().length });
}

// Stays: photos live in listing_images; flag none, and fewer than 5. Owners add them from their dashboard.
const { data: listings } = await db.from('listings')
  .select('id, slug, title_el, image_url, owner_id, listing_images(image_url, is_cover, sort_order)').eq('status', 'published');
const owners = new Map(((await db.from('profiles').select('id, full_name, email').in('id', [...new Set(listings.map((l) => l.owner_id))])).data ?? []).map((p) => [p.id, p]));
let staysFew = 0;
for (const l of listings) {
  const imgs = [...(l.listing_images ?? [])].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order);
  const n = imgs.length || (empty(l.image_url) ? 0 : 1);
  if (n >= 5) continue;
  staysFew++;
  const o = owners.get(l.owner_id);
  found.push({
    type: 'listings', typeLabel: 'Καταλύματα', kind: n === 0 ? 'missing' : 'few', id: l.id, name: l.title_el || l.slug, count: n,
    page: `${SITE}/listings/${l.slug}`, admin: `${SITE}/admin/listings/${l.id}/edit`, image: abs(imgs[0]?.image_url || l.image_url) || '',
    owner: o ? `${o.full_name || ''} ${o.email ? `<${o.email}>` : ''}`.trim() : '',
    note: 'Τις φωτογραφίες τις ανεβάζει ο ιδιοκτήτης από το dashboard του (ή εσύ από το admin).',
  });
}
summary.push({ label: 'Καταλύματα (<5 φωτογραφίες)', total: listings.length, missing: found.filter((f) => f.type === 'listings' && f.kind === 'missing').length, broken: 0, shared: 0, few: staysFew });

// ---- Markdown (short, for git / reading) ----
const date = new Date().toISOString().slice(0, 10);
const KIND_LABEL = { missing: 'Χωρίς φωτογραφία', broken: 'Η φωτογραφία δεν ανοίγει', shared: 'Ίδια φωτογραφία σε πολλά', few: 'Λίγες φωτογραφίες' };
const md = [`# Φωτογραφίες που λείπουν (${date})`, '', 'Παράγεται με `node scripts/images-audit.mjs` (μόνο ανάγνωση). Άνοιξε το `audit/missing-images.html` για να δουλέψεις τη λίστα.', '',
  '| Τύπος | Σύνολο | Χωρίς φωτογραφία | Δεν ανοίγει | Ίδια σε πολλά |', '|---|---|---|---|---|',
  ...summary.map((s) => `| ${s.label} | ${s.total} | ${s.missing} | ${s.broken} | ${s.shared} |`), '',
  ...Object.entries(KIND_LABEL).flatMap(([k, lab]) => {
    const rows = found.filter((f) => f.kind === k);
    return rows.length ? [`## ${lab} (${rows.length})`, '', ...rows.map((f) => `- ${f.typeLabel}: [${f.name}](${f.page})${f.admin ? ` · [admin](${f.admin})` : ''}${f.count != null ? ` · ${f.count} φωτ.` : ''}`), ''] : [];
  })].join('\n');

// ---- HTML: a working page with tabs, photos and "done" ticks kept in this browser ----
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const data = JSON.stringify(found).replace(/</g, '\\u003c');
const html = `<!doctype html>
<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Φωτογραφίες που λείπουν · ChalkidikiHub</title>
<style>
:root{--bg:#f8fafc;--card:#fff;--ink:#0f172a;--mut:#64748b;--line:#e2e8f0;--blue:#0284c7;--blue-d:#075985;--amber:#f59e0b;--green:#10b981;--red:#ef4444}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--ink)}
header{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid var(--line);padding:16px 20px}
h1{margin:0 0 4px;font-size:22px;font-weight:800}.sub{color:var(--mut);font-size:14px;margin:0 0 12px}
.tabs,.kinds{display:flex;flex-wrap:wrap;gap:6px}.kinds{margin-top:8px}
.tab{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 14px;font-size:14px;font-weight:600;cursor:pointer;color:#334155}
.tab.on{background:var(--blue);border-color:var(--blue);color:#fff}.tab .n{opacity:.75;font-weight:500;margin-left:4px}
.bar{display:flex;gap:12px;align-items:center;margin-top:10px;font-size:14px;color:var(--mut);flex-wrap:wrap}
.bar input[type=search]{border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:14px;min-width:220px}
progress{width:180px;height:10px;accent-color:var(--green)}
main{padding:20px;max-width:1300px;margin:0 auto}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.card.done{opacity:.45}.ph{aspect-ratio:4/3;background:#e2e8f0 center/cover no-repeat;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px;font-weight:600;position:relative}
.ph.none{background:repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9 10px,#e2e8f0 10px,#e2e8f0 20px)}
.badge{position:absolute;left:8px;top:8px;background:#fff;border-radius:999px;padding:3px 9px;font-size:11px;font-weight:700}
.b-missing{color:var(--red)}.b-broken{color:var(--red)}.b-shared{color:#b45309}.b-few{color:var(--blue-d)}
.body{padding:12px;display:flex;flex-direction:column;gap:8px;flex:1}.nm{font-weight:700;font-size:15px;line-height:1.3}
.meta{font-size:12px;color:var(--mut)}.note{font-size:12px;color:#475569;background:#f1f5f9;border-radius:8px;padding:6px 8px}
.acts{display:flex;gap:6px;margin-top:auto;flex-wrap:wrap}.btn{flex:1;text-align:center;text-decoration:none;border-radius:10px;padding:8px 10px;font-size:13px;font-weight:700}
.btn.p{background:var(--blue);color:#fff}.btn.s{border:1px solid var(--line);color:#334155}.btn.x{opacity:.4;pointer-events:none}
.done-l{display:flex;align-items:center;gap:6px;font-size:13px;color:#334155;cursor:pointer}
.group{background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:12px;margin-bottom:16px}
.group h3{margin:0 0 10px;font-size:14px;color:#9a3412}.group .grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.empty{color:var(--mut);text-align:center;padding:40px}
</style></head><body>
<header>
  <h1>Φωτογραφίες που λείπουν</h1>
  <p class="sub">Έλεγχος της ${esc(date)} · ${found.length} σημεία. Πάτα «Άλλαξε στο admin» για να ανεβάσεις φωτογραφία και σημείωσε «Έγινε». Τα «Έγινε» τα θυμάται μόνο αυτός ο browser.</p>
  <div class="tabs" id="types"></div>
  <div class="kinds" id="kinds"></div>
  <div class="bar"><input type="search" id="q" placeholder="Αναζήτηση ονόματος…"><label class="done-l"><input type="checkbox" id="hideDone"> Κρύψε όσα έγιναν</label><span id="prog"></span><progress id="pbar" max="1" value="0"></progress></div>
</header>
<main id="out"></main>
<script>
const ITEMS = ${data};
const KIND = ${JSON.stringify(KIND_LABEL)};
const KEY = 'chh-images-done';
let done = {}; try { done = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch {} };
const id = (f) => f.type + ':' + f.id + ':' + f.kind;
let type = 'all', kind = 'all', q = '', hideDone = false;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function tabs() {
  const types = [['all', 'Όλα']].concat([...new Map(ITEMS.map((f) => [f.type, f.typeLabel]))]);
  document.getElementById('types').innerHTML = types.map(([k, l]) => {
    const n = ITEMS.filter((f) => k === 'all' || f.type === k).length;
    return '<button class="tab' + (type === k ? ' on' : '') + '" data-t="' + k + '">' + esc(l) + '<span class="n">' + n + '</span></button>';
  }).join('');
  const inType = ITEMS.filter((f) => type === 'all' || f.type === type);
  const kinds = [['all', 'Όλα τα είδη']].concat(Object.entries(KIND).filter(([k]) => inType.some((f) => f.kind === k)));
  document.getElementById('kinds').innerHTML = kinds.map(([k, l]) => {
    const n = inType.filter((f) => k === 'all' || f.kind === k).length;
    return '<button class="tab' + (kind === k ? ' on' : '') + '" data-k="' + k + '">' + esc(l) + '<span class="n">' + n + '</span></button>';
  }).join('');
}

function card(f) {
  const isDone = !!done[id(f)];
  const ph = f.image ? '<div class="ph" style="background-image:url(&quot;' + esc(f.image) + '&quot;)">' : '<div class="ph none">χωρίς φωτογραφία';
  const meta = [f.typeLabel, f.count != null ? f.count + ' φωτογραφίες' : '', f.owner ? 'Ιδιοκτήτης: ' + f.owner : ''].filter(Boolean).join(' · ');
  return '<div class="card' + (isDone ? ' done' : '') + '">' + ph + '<span class="badge b-' + f.kind + '">' + esc(KIND[f.kind]) + '</span></div>'
    + '<div class="body"><div class="nm">' + esc(f.name) + '</div><div class="meta">' + esc(meta) + '</div>'
    + (f.note ? '<div class="note">' + esc(f.note) + '</div>' : '')
    + '<div class="acts"><a class="btn p' + (f.admin ? '' : ' x') + '" href="' + esc(f.admin || '#') + '" target="_blank" rel="noopener">Άλλαξε στο admin</a>'
    + '<a class="btn s" href="' + esc(f.page) + '" target="_blank" rel="noopener">Δες τη σελίδα</a></div>'
    + '<label class="done-l"><input type="checkbox" data-d="' + esc(id(f)) + '"' + (isDone ? ' checked' : '') + '> Έγινε</label></div></div>';
}

function render() {
  tabs();
  let list = ITEMS.filter((f) => (type === 'all' || f.type === type) && (kind === 'all' || f.kind === kind) && (!q || f.name.toLowerCase().includes(q)));
  const total = list.length, finished = list.filter((f) => done[id(f)]).length;
  if (hideDone) list = list.filter((f) => !done[id(f)]);
  document.getElementById('prog').textContent = finished + ' / ' + total + ' έγιναν';
  const bar = document.getElementById('pbar'); bar.max = total || 1; bar.value = finished;
  if (!list.length) { document.getElementById('out').innerHTML = '<p class="empty">Τίποτα εδώ. 🎉</p>'; return; }
  // Shared photos: shown as groups, so the copies sit side by side.
  const shared = list.filter((f) => f.kind === 'shared');
  const rest = list.filter((f) => f.kind !== 'shared');
  const groups = [...new Map(shared.map((f) => [f.group, shared.filter((g) => g.group === f.group)])).values()];
  let html = '';
  if (rest.length) html += '<div class="grid">' + rest.map(card).join('') + '</div>';
  if (groups.length) html += (rest.length ? '<h2 style="margin:28px 0 12px;font-size:18px">Ίδια φωτογραφία σε πολλά</h2>' : '')
    + groups.map((g) => '<div class="group"><h3>' + esc(g[0].typeLabel) + ': η ίδια φωτογραφία σε ' + g.length + ' σελίδες · άλλαξε τουλάχιστον τη μία</h3><div class="grid">' + g.map(card).join('') + '</div></div>').join('');
  document.getElementById('out').innerHTML = html;
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-t]'); if (t) { type = t.dataset.t; kind = 'all'; render(); }
  const k = e.target.closest('[data-k]'); if (k) { kind = k.dataset.k; render(); }
});
document.addEventListener('change', (e) => {
  if (e.target.dataset.d) { done[e.target.dataset.d] = e.target.checked || undefined; save(); render(); }
  if (e.target.id === 'hideDone') { hideDone = e.target.checked; render(); }
});
document.getElementById('q').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); render(); });
render();
</script></body></html>
`;

fs.mkdirSync(path.join(root, 'audit'), { recursive: true });
fs.writeFileSync(path.join(root, 'audit', 'missing-images.md'), md);
fs.writeFileSync(path.join(root, 'audit', 'missing-images.html'), html);
console.log(summary.map((s) => `${s.label}: ${s.missing} χωρίς, ${s.broken} σπασμένες, ${s.shared} διπλές${s.few != null ? `, ${s.few} με <5` : ''}`).join('\n'));
console.log(`${found.length} items -> audit/missing-images.html`);
