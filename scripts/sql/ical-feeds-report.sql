-- Which listings have connected an Airbnb / Booking.com iCal feed.
-- Read-only. Paste into the Supabase SQL editor and press Run.
-- The full feed URL is never shown (it carries the platform's private token), only its host.

select
  l.title_el                                   as "Κατάλυμα",
  l.slug                                       as "Slug",
  coalesce(p.full_name, '—')                   as "Ιδιοκτήτης",
  coalesce(p.email, '—')                       as "Email",
  f.source                                     as "Πλατφόρμα",
  split_part(split_part(f.url, '://', 2), '/', 1) as "Host",
  case when l.show_calendar then 'ΝΑΙ' else 'ΟΧΙ' end as "Δημόσιο ημερολόγιο",
  f.last_status                                as "Κατάσταση",
  f.last_error                                 as "Σφάλμα",
  f.busy_days                                  as "Κλεισμένες μέρες",
  to_char(f.last_synced_at at time zone 'Europe/Athens', 'DD/MM/YYYY HH24:MI') as "Τελευταίος συγχρονισμός",
  to_char(f.created_at at time zone 'Europe/Athens', 'DD/MM/YYYY HH24:MI')     as "Συνδέθηκε"
from public.listing_ical_feeds f
join public.listings l on l.id = f.listing_id
left join public.profiles p on p.id = l.owner_id
order by f.created_at desc;

-- Summary: run this one on its own (select it, then Run) for the counts.
-- "Live" = the same rule as the green badge on /listings: public calendar on
-- and a feed that synced fine in the last 24 hours.
-- select
--   count(distinct l.owner_id)                                             as "Ιδιοκτήτες με iCal",
--   count(distinct f.listing_id)                                           as "Καταλύματα με iCal",
--   count(*)                                                               as "Feeds",
--   count(distinct f.listing_id) filter (
--     where f.last_status = 'ok' and l.show_calendar
--       and f.last_synced_at > now() - interval '24 hours')                as "Live (με το πράσινο σήμα)",
--   count(*) filter (where f.last_status = 'error')                        as "Feeds με σφάλμα",
--   count(*) filter (where f.last_status is null)                          as "Feeds που δεν συγχρονίστηκαν ακόμα",
--   count(distinct f.listing_id) filter (where not coalesce(l.show_calendar, false)) as "Με κρυφό ημερολόγιο"
-- from public.listing_ical_feeds f
-- join public.listings l on l.id = f.listing_id
-- where l.status = 'published';
