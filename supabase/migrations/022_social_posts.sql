-- 022_social_posts.sql
-- Social autopilot Phase 1: queued IG spotlights for B2B directory upsells.
-- Ran in Supabase SQL editor 2026-05-25; this file mirrors deployed state.

-- one row per generated draft
create table public.social_posts (
  id              uuid primary key default gen_random_uuid(),
  business_slug   text not null,                    -- from data/localBusinesses.ts
  industry_slug   text not null,                    -- maps /local/[industry]/[slug]
  platform        text not null default 'instagram',
  caption         text not null,
  hashtags        text[] not null default '{}',
  image_path      text,                              -- supabase storage object key
  image_url       text,                              -- public CDN URL (cached)
  overlay_template text not null,                   -- e.g. 'spotlight-v1'
  status          text not null default 'draft'
                  check (status in ('draft','approved','rejected','published','skipped')),
  scheduled_at    timestamptz not null,             -- slot suggested by generator
  published_at    timestamptz,                       -- when admin marks posted
  ig_permalink    text,                              -- pasted by admin after manual post
  utm_campaign    text not null,                    -- 'spotlight-<slug>-<yymmdd>'
  created_by_ai   boolean not null default true,
  generated_by_model text,                          -- e.g. 'claude-sonnet-4'
  generation_cost_usd numeric(8,4),                 -- spend per draft
  regen_count     int not null default 0,           -- bound to 3 in app
  reviewed_by     uuid references public.admin_users(id),
  reviewed_at     timestamptz,
  edit_notes      text,                              -- admin reason for edit/reject
  created_at      timestamptz not null default now()
);

create index social_posts_status_scheduled_idx
  on public.social_posts (status, scheduled_at);
create index social_posts_utm_idx
  on public.social_posts (utm_campaign);
create index social_posts_business_idx
  on public.social_posts (business_slug, created_at desc);

-- rotation tracking (small, business-slug keyed)
create table public.social_rotations (
  business_slug        text primary key,
  last_spotlighted_at  timestamptz not null,
  spotlight_count      int not null default 0,
  updated_at           timestamptz not null default now()
);

-- RLS: admin-only read+write; cron uses service role
alter table public.social_posts enable row level security;
alter table public.social_rotations enable row level security;

create policy social_posts_admin_all on public.social_posts
  for all using (public.is_admin()) with check (public.is_admin());
create policy social_rotations_admin_all on public.social_rotations
  for all using (public.is_admin()) with check (public.is_admin());
