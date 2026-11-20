-- ChalkidikiHub: platform monitoring queries.
-- Read-only. In the Supabase SQL editor, select ONE query (from its comment to
-- its semicolon) and press Run. Dates are shown in Greek time.

------------------------------------------------------------------------------
-- 1. Η εικόνα με μια ματιά
------------------------------------------------------------------------------
select
  (select count(*) from profiles where role = 'owner')                                         as "Ιδιοκτήτες",
  (select count(*) from profiles where role = 'owner' and created_at > now() - interval '7 days')  as "Νέοι ιδιοκτήτες 7ημ",
  (select count(*) from profiles where role = 'owner' and created_at > now() - interval '30 days') as "Νέοι ιδιοκτήτες 30ημ",
  (select count(*) from listings where status = 'published')                                   as "Δημοσιευμένα",
  (select count(*) from listings where status = 'pending')                                     as "Σε αναμονή έγκρισης",
  (select count(*) from availability_requests where created_at > now() - interval '7 days')    as "Αιτήματα 7ημ",
  (select count(*) from availability_requests where created_at > now() - interval '30 days')   as "Αιτήματα 30ημ",
  (select count(*) from availability_responses where status in ('available','alternative')
     and created_at > now() - interval '30 days')                                              as "Θετικές απαντήσεις 30ημ",
  (select count(*) from contact_messages where not coalesce(read, false))                      as "Αδιάβαστα μηνύματα",
  (select count(*) from listing_reviews where status = 'pending')
   + (select count(*) from beach_reviews where status = 'pending')
   + (select count(*) from restaurant_reviews where status = 'pending')                        as "Κριτικές σε αναμονή",
  (select count(*) from activity_logs where severity = 'error' and created_at > now() - interval '7 days') as "Σφάλματα 7ημ";

------------------------------------------------------------------------------
-- 2. Καταλύματα που περιμένουν έγκριση (τα παλαιότερα πρώτα)
------------------------------------------------------------------------------
select l.title_el as "Κατάλυμα", l.area as "Περιοχή", p.full_name as "Ιδιοκτήτης", p.email as "Email",
       (select count(*) from listing_images i where i.listing_id = l.id) as "Φωτογραφίες",
       to_char(l.created_at at time zone 'Europe/Athens', 'DD/MM/YYYY') as "Δημιουργήθηκε",
       (current_date - l.created_at::date) as "Μέρες σε αναμονή"
from listings l left join profiles p on p.id = l.owner_id
where l.status = 'pending'
order by l.created_at;

------------------------------------------------------------------------------
-- 3. Ιδιοκτήτες που γράφτηκαν αλλά δεν έχουν δημοσιευμένο κατάλυμα
--    (για ένα φιλικό email "χρειάζεσαι βοήθεια;")
------------------------------------------------------------------------------
select p.full_name as "Όνομα", p.email as "Email", p.phone as "Τηλέφωνο",
       to_char(p.created_at at time zone 'Europe/Athens', 'DD/MM/YYYY') as "Εγγραφή",
       case when p.email_verified_at is null then 'ΟΧΙ' else 'ΝΑΙ' end as "Επιβεβαίωσε email",
       (select count(*) from listings l where l.owner_id = p.id) as "Πρόχειρα/σε αναμονή"
from profiles p
where p.role = 'owner'
  and not exists (select 1 from listings l where l.owner_id = p.id and l.status = 'published')
order by p.created_at desc;

------------------------------------------------------------------------------
-- 4. Αιτήματα διαθεσιμότητας ανά εβδομάδα: πόσα, σε πόσους πήγαν, πόσες απαντήσεις
------------------------------------------------------------------------------
select to_char(date_trunc('week', r.created_at), 'DD/MM/YYYY') as "Εβδομάδα από",
       count(*)                                                   as "Αιτήματα",
       round(avg(r.recipients_count), 1)                          as "Παραλήπτες/αίτημα",
       sum(r.responses_count)                                     as "Απαντήσεις",
       count(*) filter (where exists (select 1 from availability_responses a
         where a.request_id = r.id and a.status in ('available','alternative'))) as "Με θετική απάντηση",
       round(100.0 * count(*) filter (where exists (select 1 from availability_responses a
         where a.request_id = r.id and a.status in ('available','alternative'))) / count(*)) as "% με προσφορά"
from availability_requests r
where r.created_at > now() - interval '12 weeks'
group by 1, date_trunc('week', r.created_at)
order by date_trunc('week', r.created_at) desc;

------------------------------------------------------------------------------
-- 5. Αιτήματα των τελευταίων 30 ημερών που ΔΕΝ πήραν καμία προσφορά
--    (επισκέπτες που έφυγαν με άδεια χέρια: πού και πότε ήθελαν να έρθουν)
------------------------------------------------------------------------------
select to_char(r.created_at at time zone 'Europe/Athens', 'DD/MM HH24:MI') as "Στάλθηκε",
       r.area as "Περιοχή", r.check_in as "Άφιξη", r.check_out as "Αναχώρηση",
       r.adults + r.children as "Άτομα", r.budget_max as "Budget έως", r.budget_min as "Budget από",
       r.recipients_count as "Παραλήπτες", r.responses_count as "Απαντήσεις", r.locale as "Γλώσσα"
from availability_requests r
where r.created_at > now() - interval '30 days'
  and not exists (select 1 from availability_responses a
                  where a.request_id = r.id and a.status in ('available','alternative'))
order by r.created_at desc;

------------------------------------------------------------------------------
-- 6. Πόσο απαντούν οι ιδιοκτήτες (τελευταίοι 90 μέρες)
--    Όσοι παίρνουν πολλά αιτήματα και δεν απαντούν ποτέ: ίσως δεν βλέπουν τα email.
------------------------------------------------------------------------------
select p.full_name as "Ιδιοκτήτης", p.email as "Email",
       count(distinct rr.request_id)                                         as "Έλαβε",
       count(distinct a.request_id)                                          as "Απάντησε",
       count(distinct a.request_id) filter (where a.status in ('available','alternative')) as "Θετικά",
       round(100.0 * count(distinct a.request_id) / nullif(count(distinct rr.request_id), 0)) as "% απάντησης",
       coalesce(s.opted_out, false)                                          as "Έχει διαγραφεί"
from availability_request_recipients rr
join profiles p on p.id = rr.owner_id
left join availability_responses a on a.request_id = rr.request_id and a.owner_id = rr.owner_id
left join owner_broadcast_settings s on s.owner_id = rr.owner_id
where rr.sent_at > now() - interval '90 days'
group by p.id, p.full_name, p.email, s.opted_out
order by "% απάντησης" nulls first, "Έλαβε" desc;

------------------------------------------------------------------------------
-- 7. Ζήτηση vs προσφορά ανά περιοχή (αιτήματα 90 ημερών / δημοσιευμένα καταλύματα)
------------------------------------------------------------------------------
select coalesce(d.area, s.area) as "Περιοχή",
       coalesce(d.requests, 0) as "Αιτήματα 90ημ",
       coalesce(s.listings, 0) as "Καταλύματα",
       round(coalesce(d.requests, 0)::numeric / nullif(s.listings, 0), 2) as "Αιτήματα ανά κατάλυμα"
from (select area, count(*) as requests from availability_requests
      where created_at > now() - interval '90 days' group by area) d
full join (select area, count(*) as listings from listings where status = 'published' group by area) s
  on s.area = d.area
order by 2 desc;

------------------------------------------------------------------------------
-- 8. Για ποιους μήνες ζητούν διαμονή (μήνας άφιξης), ανά περιοχή
------------------------------------------------------------------------------
select to_char(date_trunc('month', check_in), 'MM/YYYY') as "Μήνας άφιξης", area as "Περιοχή",
       count(*) as "Αιτήματα", round(avg(adults + children), 1) as "Μέσος αριθμός ατόμων",
       round(avg(check_out - check_in), 1) as "Μέσες νύχτες"
from availability_requests
where check_in >= date_trunc('month', current_date - interval '12 months')
group by date_trunc('month', check_in), area
order by date_trunc('month', check_in), area;

------------------------------------------------------------------------------
-- 9. Email προς ιδιοκτήτες που απέτυχαν (τελευταίες 14 μέρες)
------------------------------------------------------------------------------
select to_char(rr.sent_at at time zone 'Europe/Athens', 'DD/MM HH24:MI') as "Πότε",
       p.email as "Ιδιοκτήτης", rr.send_status as "Κατάσταση", rr.error as "Σφάλμα"
from availability_request_recipients rr left join profiles p on p.id = rr.owner_id
where rr.send_status <> 'sent' and coalesce(rr.sent_at, now()) > now() - interval '14 days'
order by rr.sent_at desc nulls first;

------------------------------------------------------------------------------
-- 10. Ποιότητα δημοσιευμένων καταλυμάτων: τι λείπει
------------------------------------------------------------------------------
select l.title_el as "Κατάλυμα", p.email as "Ιδιοκτήτης",
       (select count(*) from listing_images i where i.listing_id = l.id) as "Φωτογραφίες",
       case when coalesce(l.price_per_night, 0) = 0 then 'λείπει' else '' end as "Τιμή",
       case when coalesce(l.contact_phone, '') = '' then 'λείπει' else '' end as "Τηλέφωνο",
       case when coalesce(l.latitude, 0) = 0 then 'λείπει' else '' end as "Χάρτης",
       case when coalesce(l.description_el, '') = '' then 'λείπει' else '' end as "Περιγραφή",
       to_char(l.updated_at at time zone 'Europe/Athens', 'DD/MM/YYYY') as "Τελευταία αλλαγή"
from listings l left join profiles p on p.id = l.owner_id
where l.status = 'published'
  and ( (select count(*) from listing_images i where i.listing_id = l.id) < 3
     or coalesce(l.price_per_night, 0) = 0 or coalesce(l.contact_phone, '') = ''
     or coalesce(l.latitude, 0) = 0 or coalesce(l.description_el, '') = '')
order by 3, l.title_el;

------------------------------------------------------------------------------
-- 11. Last-minute προσφορές: ενεργές, και όσες έληξαν αλλά φαίνονται ακόμα "active"
------------------------------------------------------------------------------
select d.status as "Κατάσταση",
       count(*) filter (where d.end_date >= current_date) as "Τρέχουσες",
       count(*) filter (where d.end_date < current_date)  as "Ληγμένες",
       count(*) filter (where d.fb_posted_at is not null) as "Στο Facebook"
from last_minute_deals d
group by d.status;

------------------------------------------------------------------------------
-- 12. Κριτικές που περιμένουν έγκριση
------------------------------------------------------------------------------
select 'Κατάλυμα' as "Τύπος", l.title_el as "Για", r.author_name as "Από", r.rating as "★", r.comment_el as "Σχόλιο",
       to_char(r.created_at at time zone 'Europe/Athens', 'DD/MM/YYYY') as "Πότε"
from listing_reviews r join listings l on l.id = r.listing_id where r.status = 'pending'
union all
select 'Παραλία', b.name_el, r.author_name, r.rating, r.comment_el, to_char(r.created_at at time zone 'Europe/Athens', 'DD/MM/YYYY')
from beach_reviews r join beaches b on b.id = r.beach_id where r.status = 'pending'
union all
select 'Εστιατόριο', x.name_el, r.author_name, r.rating, r.comment_el, to_char(r.created_at at time zone 'Europe/Athens', 'DD/MM/YYYY')
from restaurant_reviews r join restaurants x on x.id = r.restaurant_id where r.status = 'pending';

------------------------------------------------------------------------------
-- 13. Σφάλματα και προειδοποιήσεις συστήματος (τελευταίες 7 μέρες)
------------------------------------------------------------------------------
select to_char(created_at at time zone 'Europe/Athens', 'DD/MM HH24:MI') as "Πότε",
       severity as "Σοβαρότητα", type as "Τύπος", message as "Μήνυμα"
from activity_logs
where severity in ('error', 'warning') and created_at > now() - interval '7 days'
order by created_at desc;

------------------------------------------------------------------------------
-- 14. Χρήση AI (trip planner κ.λπ.) ανά μέρα και πιθανή κατάχρηση
------------------------------------------------------------------------------
select to_char(created_at at time zone 'Europe/Athens', 'DD/MM/YYYY') as "Μέρα", endpoint as "Endpoint",
       count(*) as "Κλήσεις", count(distinct ip) as "Διαφορετικοί επισκέπτες",
       max(c) as "Περισσότερες από έναν επισκέπτη"
from (select *, count(*) over (partition by ip, endpoint, created_at::date) as c from ai_request_log
      where created_at > now() - interval '14 days') x
group by 1, created_at::date, endpoint
order by created_at::date desc, 3 desc;

------------------------------------------------------------------------------
-- 15. Καταλύματα με τη μεγαλύτερη προβολή στο Google τον τελευταίο μήνα
--     (από το μηνιαίο snapshot του Search Console)
------------------------------------------------------------------------------
select l.title_el as "Κατάλυμα", s.month as "Μήνας", s.impressions as "Εμφανίσεις", s.clicks as "Κλικ",
       round(100.0 * s.clicks / nullif(s.impressions, 0), 1) as "CTR %", s.inquiries as "Ερωτήσεις"
from listing_monthly_stats s join listings l on l.id = s.listing_id
where s.month = (select max(month) from listing_monthly_stats)
order by s.impressions desc
limit 30;

------------------------------------------------------------------------------
-- 16. Τρέχουν οι αυτόματες εργασίες (cron); Πότε έτρεξε τελευταία φορά η καθεμία.
--     Στο Vercel έτρεχαν μόνες τους· στο Plesk πρέπει να υπάρχει Scheduled Task για καθεμία.
------------------------------------------------------------------------------
select 'iCal συγχρονισμός (κάθε 2 ώρες)' as "Εργασία",
       to_char(max(last_synced_at) at time zone 'Europe/Athens', 'DD/MM/YYYY HH24:MI') as "Τελευταία φορά"
from listing_ical_feeds
union all
select 'Μηνιαίο snapshot στατιστικών (1η του μήνα)',
       to_char(max(snapshot_at) at time zone 'Europe/Athens', 'DD/MM/YYYY HH24:MI')
from listing_monthly_stats
union all
select 'Λήξη last-minute προσφορών (καθημερινά) – ληγμένες που είναι ακόμα active',
       count(*)::text
from last_minute_deals where status = 'active' and end_date < current_date;

------------------------------------------------------------------------------
-- 17. Τι αποθηκεύουν περισσότερο οι επισκέπτες στα αγαπημένα
------------------------------------------------------------------------------
select item_type as "Τύπος", item_slug as "Slug", count(*) as "Φορές", max(created_at)::date as "Τελευταία"
from favorites
group by item_type, item_slug
order by 3 desc
limit 30;
