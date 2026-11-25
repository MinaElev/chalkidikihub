-- Availability requests sent to one listing from its page (the "Ask about
-- availability" form), kept so the owner can answer with one click from the
-- email ("Available" / "Not available") and the guest gets that answer by
-- email in their own language. Also the source for future owner statistics
-- (requests per month, reply rate, reply time).
--
-- contact_messages keeps receiving every request as before (the owners'
-- inbox reads it); this table adds the reply link and the reply.
--
-- Until this is run the site works as before, only without the reply
-- buttons in the owner's email.
--
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.listing_inquiries (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  listing_id    uuid        not null references public.listings(id) on delete cascade,
  owner_id      uuid,
  guest_name    text        not null,
  guest_email   text        not null,
  guest_phone   text,
  check_in      date,
  check_out     date,
  guests        integer,
  message       text,
  locale        text        not null default 'el',
  -- form = dates typed in the form, calendar = picked on the listing's calendar,
  -- similar = "send the same request to these free stays too" after a request
  source        text        not null default 'form',
  reply_token   text        not null unique,
  reply_status  text,                     -- null = no answer yet; available / unavailable
  reply_price   numeric,                  -- optional total price the owner quoted
  reply_message text,
  replied_at    timestamptz
);

create index if not exists listing_inquiries_listing on public.listing_inquiries (listing_id, created_at desc);
create index if not exists listing_inquiries_owner on public.listing_inquiries (owner_id, created_at desc);

-- Server-only: the site reads and writes through the service role; the reply
-- page finds a row only by its unguessable token.
alter table public.listing_inquiries enable row level security;
