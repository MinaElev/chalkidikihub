-- Turn the public calendar on (listings.show_calendar = true) when a listing's
-- Airbnb / Booking.com iCal feed syncs successfully.
-- Paste into the Supabase SQL editor and press Run. Safe to run more than once.

-- 1) One-off: listings that already have an ok feed but a hidden calendar.
update public.listings l
set show_calendar = true
where coalesce(l.show_calendar, false) = false
  and exists (
    select 1 from public.listing_ical_feeds f
    where f.listing_id = l.id and f.last_status = 'ok'
  );

-- 2) From now on, automatically. It fires only when a feed BECOMES ok
--    (new feed, or a feed that was failing / never synced). Every later
--    successful sync leaves the setting alone, so an owner who turns the
--    calendar off again on purpose is not overridden every 2 hours.
create or replace function public.ical_feed_show_calendar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.last_status = 'ok'
     and (tg_op = 'INSERT' or old.last_status is distinct from 'ok') then
    update public.listings
    set show_calendar = true
    where id = new.listing_id
      and coalesce(show_calendar, false) = false;
  end if;
  return new;
end;
$$;

drop trigger if exists ical_feed_show_calendar on public.listing_ical_feeds;
create trigger ical_feed_show_calendar
after insert or update of last_status on public.listing_ical_feeds
for each row execute function public.ical_feed_show_calendar();

-- Undo:
-- drop trigger if exists ical_feed_show_calendar on public.listing_ical_feeds;
-- drop function if exists public.ical_feed_show_calendar();
