-- Own, cookieless traffic counter for Admin → Επισκεψιμότητα.
--
-- Counts every page view and contact action from every visitor, consent or
-- not, because nothing here identifies anyone: no cookies, no IP, no user id,
-- no per-visit rows. Each row is a daily total for one combination of
-- (page, action, source, campaign, device, site language).
--
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.analytics_daily (
  day       date    not null,
  path      text    not null,               -- page path without language prefix, e.g. /listings/amira-house
  event     text    not null default '',    -- '' = page view; otherwise call / email / whatsapp / inquiry / …
  source    text    not null default 'direct', -- google, bing, facebook, chatgpt, direct, internal, other host…
  campaign  text    not null default '',    -- utm_campaign when present
  device    text    not null default 'desktop', -- mobile / tablet / desktop
  lang      text    not null default 'el',  -- site language of the page
  hits      integer not null default 0,     -- page views (event = '') or actions
  entries   integer not null default 0,     -- views that started a visit (arrived from outside the site)
  seconds   bigint  not null default 0,     -- total visible time measured on these views
  timed     integer not null default 0,     -- how many views reported a time
  engaged   integer not null default 0,     -- views with at least 10 seconds visible
  primary key (day, path, event, source, campaign, device, lang)
);

create index if not exists analytics_daily_day on public.analytics_daily (day);

-- Server-only: the site writes through the service role; nobody reads it directly.
alter table public.analytics_daily enable row level security;

-- Atomic "add to today's counters".
create or replace function public.analytics_hit(
  p_day date, p_path text, p_event text, p_source text, p_campaign text, p_device text, p_lang text,
  p_hits integer, p_entries integer, p_seconds integer, p_timed integer, p_engaged integer
) returns void language sql as $$
  insert into public.analytics_daily as a
    (day, path, event, source, campaign, device, lang, hits, entries, seconds, timed, engaged)
  values (p_day, p_path, p_event, p_source, p_campaign, p_device, p_lang, p_hits, p_entries, p_seconds, p_timed, p_engaged)
  on conflict (day, path, event, source, campaign, device, lang) do update set
    hits    = a.hits    + excluded.hits,
    entries = a.entries + excluded.entries,
    seconds = a.seconds + excluded.seconds,
    timed   = a.timed   + excluded.timed,
    engaged = a.engaged + excluded.engaged;
$$;

-- Everything the admin page shows for a date range, in one round trip.
create or replace function public.analytics_report(p_from date, p_to date)
returns jsonb language sql stable as $$
  with r as (select * from public.analytics_daily where day between p_from and p_to),
  v as (select * from r where event = '')
  select jsonb_build_object(
    'totals', (select jsonb_build_object(
        'views', coalesce(sum(hits), 0), 'entries', coalesce(sum(entries), 0),
        'seconds', coalesce(sum(seconds), 0), 'timed', coalesce(sum(timed), 0), 'engaged', coalesce(sum(engaged), 0))
      from v),
    'daily', coalesce((select jsonb_agg(d order by d.day) from (
        select day, sum(hits) as views, sum(entries) as entries from v group by day) d), '[]'::jsonb),
    'pages', coalesce((select jsonb_agg(p) from (
        select path, sum(hits) as views, sum(entries) as entries, sum(seconds) as seconds,
               sum(timed) as timed, sum(engaged) as engaged
        from v group by path order by sum(hits) desc limit 500) p), '[]'::jsonb),
    'sources', coalesce((select jsonb_agg(s) from (
        select source, sum(hits) as views, sum(entries) as entries
        from v group by source order by sum(entries) desc, sum(hits) desc) s), '[]'::jsonb),
    'campaigns', coalesce((select jsonb_agg(c) from (
        select source, campaign, sum(hits) as views, sum(entries) as entries
        from v where campaign <> '' group by source, campaign order by sum(entries) desc limit 50) c), '[]'::jsonb),
    'devices', coalesce((select jsonb_agg(x) from (
        select device, sum(hits) as views, sum(entries) as entries from v group by device order by sum(hits) desc) x), '[]'::jsonb),
    'langs', coalesce((select jsonb_agg(x) from (
        select lang, sum(hits) as views, sum(entries) as entries from v group by lang order by sum(hits) desc) x), '[]'::jsonb),
    'events', coalesce((select jsonb_agg(e) from (
        select path, event, sum(hits) as hits from r where event <> '' group by path, event) e), '[]'::jsonb)
  );
$$;

-- Only the server (service role) may call these.
revoke all on function public.analytics_hit(date, text, text, text, text, text, text, integer, integer, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.analytics_report(date, date) from public, anon, authenticated;
