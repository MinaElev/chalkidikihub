-- Follow-ups for listing requests (needs 2026-11-listing-inquiries.sql first):
--   owner_reminded_at  — when the owner was reminded of a request still unanswered after 24 hours
--   guest_followed_at  — when the guest was sent other free stays because the owner had not answered in 48 hours
-- Both are written by /api/cron/inquiry-followups (also run at the end of every iCal sync).
-- Until this is run the follow-ups simply don't go out; nothing else changes.
--
-- Run once in Supabase → SQL Editor. Safe to re-run.

alter table public.listing_inquiries add column if not exists owner_reminded_at timestamptz;
alter table public.listing_inquiries add column if not exists guest_followed_at timestamptz;

-- The follow-up job looks for unanswered requests by age.
create index if not exists listing_inquiries_open on public.listing_inquiries (created_at) where reply_status is null;
