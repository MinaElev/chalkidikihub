-- Cover photo and recommended articles for each guide page (/guide/<slug>).
-- Managed from Admin → Guides. Run once in the Supabase SQL editor. Safe to re-run.

create table if not exists public.guide_media (
  slug           text primary key,            -- guide slug, e.g. 'best-time-to-visit'
  image_url      text,                        -- public Storage URL of the cover photo
  article_slugs  text[] not null default '{}', -- up to three blog articles shown under the guide
  updated_at     timestamptz not null default now()
);

alter table public.guide_media enable row level security;

-- Anyone may read (the public guide pages do). There is no write policy:
-- only the service role writes, through /api/admin/guides after a superadmin check.
drop policy if exists "guide_media public read" on public.guide_media;
create policy "guide_media public read" on public.guide_media
  for select using (true);
