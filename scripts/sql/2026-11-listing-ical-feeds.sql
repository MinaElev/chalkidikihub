-- iCal import for owner availability (Airbnb / Booking.com export URLs).
-- Run once in the Supabase SQL editor. Safe to re-run.

create table if not exists public.listing_ical_feeds (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid not null references public.listings(id) on delete cascade,
  source          text not null check (source in ('airbnb', 'booking')),
  url             text not null,
  last_synced_at  timestamptz,
  last_status     text check (last_status in ('ok', 'error')),
  last_error      text,
  busy_days       integer not null default 0,
  created_at      timestamptz not null default now(),
  unique (listing_id, url)
);

-- The export URLs carry a private token, so no client may read them.
-- RLS on with no policies: only the service role (our API routes) can see the table.
alter table public.listing_ical_feeds enable row level security;

-- Days imported from a feed point at it; manual days keep feed_id = null.
-- Deleting a feed deletes the days it imported.
alter table public.listing_availability
  add column if not exists feed_id uuid references public.listing_ical_feeds(id) on delete cascade;

create index if not exists listing_availability_feed_id_idx
  on public.listing_availability (feed_id) where feed_id is not null;
