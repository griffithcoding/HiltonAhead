-- Hilton Ahead: Sales Prospects (cold outbound CRM)
--
-- Distinct from existing tables:
--   - itinerary_requests (001)  = inbound trip-planner form (high intent, anon insert)
--   - lead_inquiries (016)      = inbound relocation/owner/wedding (high intent, anon insert)
--   - outreach_*    (007)       = backlink/PR outreach (b2b link-building, separate domain)
--
-- This table is the outbound cold-sales pipeline:
--   - enriched contacts from feeder-city campaigns
--   - multi-channel touch tracking (email/linkedin/instagram/facebook/reddit/pinterest)
--   - segment + campaign attribution for ROI math
--   - hand-off to itinerary_requests when a prospect converts
--
-- Reuses public.is_admin() RLS helper from migration 003.
-- Idempotent.

create extension if not exists pgcrypto;

-- ============================================================================
-- Enums
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'sales_segment') then
    create type sales_segment as enum (
      'golf',
      'family',
      'couples',
      'honeymoon',
      'snowbird',
      'wedding',
      'corporate',
      'unknown'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'sales_channel') then
    create type sales_channel as enum (
      'email',
      'linkedin',
      'instagram',
      'facebook',
      'reddit',
      'pinterest',
      'tiktok',
      'direct_mail',
      'referral',
      'organic',
      'paid_search',
      'paid_social',
      'direct'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'sales_status') then
    create type sales_status as enum (
      'new',          -- enriched, not yet touched
      'queued',       -- in a sequence, no touch yet
      'contacted',    -- first touch sent
      'engaged',      -- replied / opened multiple / clicked
      'qualified',    -- expressed real intent (asked for dates / budget)
      'converted',    -- became an itinerary_request
      'booked',       -- paid trip
      'unresponsive', -- full sequence, no reply
      'unsubscribed', -- opted out
      'bounced',      -- hard bounce
      'archived'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'sales_touch_type') then
    create type sales_touch_type as enum (
      'email_sent',
      'email_open',
      'email_click',
      'email_reply',
      'email_bounce',
      'linkedin_invite',
      'linkedin_accepted',
      'linkedin_message',
      'linkedin_reply',
      'instagram_dm',
      'instagram_reply',
      'facebook_message',
      'facebook_reply',
      'reddit_comment',
      'reddit_reply',
      'sms_sent',
      'sms_reply',
      'call_logged',
      'note',
      'status_change'
    );
  end if;
end $$;

-- ============================================================================
-- sales_campaigns: top-level campaign metadata (Atlanta-Golf-Q1, NYC-Couples-2026, etc.)
-- ============================================================================

create table if not exists public.sales_campaigns (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,      -- 'atlanta-golf-q1-2026'
  name            text not null,             -- 'Atlanta Golf Groups — Q1 2026'
  feeder_city     text,                      -- 'Atlanta'
  segment         sales_segment not null default 'unknown',
  primary_channel sales_channel not null,
  send_from       text,                      -- sender email for this campaign
  goal_leads      int,                       -- target lead count
  goal_booked     int,                       -- target booked trips
  starts_at       timestamptz,
  ends_at         timestamptz,
  notes           text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_sales_campaigns_active on public.sales_campaigns (is_active);
create index if not exists idx_sales_campaigns_feeder_city on public.sales_campaigns (feeder_city);

-- ============================================================================
-- sales_prospects: the enriched contact record
-- ============================================================================

create table if not exists public.sales_prospects (
  id                uuid primary key default gen_random_uuid(),
  email             text unique,             -- nullable: socials-only prospects may lack email
  full_name         text,
  first_name        text,
  last_name         text,
  title             text,                    -- 'Partner', 'CFO', 'Wedding Planner'
  company           text,
  industry          text,                    -- 'Law', 'Finance', 'Medicine', 'PE/VC'
  zip               text,
  city              text,
  state             text,
  feeder_city       text,                    -- normalized: 'Atlanta', 'Charlotte', 'NYC', ...
  segment           sales_segment not null default 'unknown',
  estimated_hhi     text,                    -- '$200k-$500k', '$500k-$1M', '$1M+'
  party_size_guess  int,
  -- Channel handles
  linkedin_url      text,
  instagram_handle  text,
  facebook_url      text,
  reddit_username   text,
  twitter_handle    text,
  phone             text,
  -- Attribution
  source_channel    sales_channel,
  source_campaign   uuid references public.sales_campaigns(id) on delete set null,
  source_notes      text,
  -- Enrichment
  enrichment_source text,                    -- 'manual', 'apollo', 'hunter', 'public_socials'
  enrichment_data   jsonb,                   -- raw enrichment payload
  -- State
  status            sales_status not null default 'new',
  do_not_contact    boolean not null default false,
  unsubscribed_at   timestamptz,
  -- Sequence cursor
  current_sequence  text,                    -- 'atlanta-golf-3touch-v1'
  sequence_step     int not null default 0,
  next_touch_at     timestamptz,
  last_touched_at   timestamptz,
  -- Conversion linkage
  converted_itinerary_id uuid references public.itinerary_requests(id) on delete set null,
  -- Audit
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_sales_prospects_status on public.sales_prospects (status);
create index if not exists idx_sales_prospects_segment on public.sales_prospects (segment);
create index if not exists idx_sales_prospects_feeder_city on public.sales_prospects (feeder_city);
create index if not exists idx_sales_prospects_campaign on public.sales_prospects (source_campaign);
create index if not exists idx_sales_prospects_next_touch on public.sales_prospects (next_touch_at)
  where next_touch_at is not null and status not in ('unsubscribed', 'bounced', 'archived', 'booked');
create index if not exists idx_sales_prospects_created on public.sales_prospects (created_at desc);
create unique index if not exists uniq_sales_prospects_email_lower
  on public.sales_prospects (lower(email)) where email is not null;

-- ============================================================================
-- sales_touches: every interaction (sent, opened, replied, etc.)
-- ============================================================================

create table if not exists public.sales_touches (
  id            uuid primary key default gen_random_uuid(),
  prospect_id   uuid not null references public.sales_prospects(id) on delete cascade,
  campaign_id   uuid references public.sales_campaigns(id) on delete set null,
  channel       sales_channel not null,
  touch_type    sales_touch_type not null,
  sequence      text,                        -- 'atlanta-golf-3touch-v1'
  sequence_step int,
  subject       text,
  body_preview  text,                        -- first 300 chars for context
  external_id   text,                        -- Resend message id / LinkedIn URN / etc.
  metadata      jsonb,                       -- channel-specific payload
  occurred_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists idx_sales_touches_prospect on public.sales_touches (prospect_id, occurred_at desc);
create index if not exists idx_sales_touches_campaign on public.sales_touches (campaign_id, occurred_at desc);
create index if not exists idx_sales_touches_type on public.sales_touches (touch_type, occurred_at desc);
create index if not exists idx_sales_touches_channel on public.sales_touches (channel, occurred_at desc);

-- ============================================================================
-- sales_unsubscribes: hard opt-out registry (separate so it survives prospect deletion)
-- ============================================================================

create table if not exists public.sales_unsubscribes (
  id              uuid primary key default gen_random_uuid(),
  email_lower     text not null unique,
  reason          text,
  source          text,                      -- 'one_click', 'reply_keyword', 'manual'
  unsubscribed_at timestamptz not null default now()
);

create index if not exists idx_sales_unsubscribes_email on public.sales_unsubscribes (email_lower);

-- ============================================================================
-- updated_at triggers (reuses set_updated_at() from prior migrations)
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_sales_campaigns_updated_at') then
    create trigger trg_sales_campaigns_updated_at
      before update on public.sales_campaigns
      for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'trg_sales_prospects_updated_at') then
    create trigger trg_sales_prospects_updated_at
      before update on public.sales_prospects
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ============================================================================
-- RLS — admins read/write, anon insert prospects only (via /api/sales-prospects)
-- ============================================================================

alter table public.sales_campaigns enable row level security;
alter table public.sales_prospects enable row level security;
alter table public.sales_touches enable row level security;
alter table public.sales_unsubscribes enable row level security;

-- sales_campaigns: admin only
drop policy if exists sales_campaigns_admin_all on public.sales_campaigns;
create policy sales_campaigns_admin_all on public.sales_campaigns
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- sales_prospects: anon can INSERT (capture form posts via /api/sales-prospects),
-- admins read/update/delete. Service role bypasses RLS for ingest jobs.
drop policy if exists sales_prospects_anon_insert on public.sales_prospects;
create policy sales_prospects_anon_insert on public.sales_prospects
  for insert to anon with check (true);

drop policy if exists sales_prospects_admin_all on public.sales_prospects;
create policy sales_prospects_admin_all on public.sales_prospects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- sales_touches: admin only (server-side writes only)
drop policy if exists sales_touches_admin_all on public.sales_touches;
create policy sales_touches_admin_all on public.sales_touches
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- sales_unsubscribes: anon can INSERT (one-click unsub endpoint), admin reads
drop policy if exists sales_unsubscribes_anon_insert on public.sales_unsubscribes;
create policy sales_unsubscribes_anon_insert on public.sales_unsubscribes
  for insert to anon with check (true);

drop policy if exists sales_unsubscribes_admin_read on public.sales_unsubscribes;
create policy sales_unsubscribes_admin_read on public.sales_unsubscribes
  for select to authenticated using (public.is_admin());

-- ============================================================================
-- Views — admin dashboard aggregations
-- ============================================================================

create or replace view public.sales_campaign_stats as
  select
    c.id,
    c.slug,
    c.name,
    c.feeder_city,
    c.segment,
    c.primary_channel,
    c.is_active,
    count(p.id) filter (where p.id is not null)                                  as prospects_total,
    count(p.id) filter (where p.status = 'contacted')                            as prospects_contacted,
    count(p.id) filter (where p.status = 'engaged')                              as prospects_engaged,
    count(p.id) filter (where p.status = 'qualified')                            as prospects_qualified,
    count(p.id) filter (where p.status = 'converted')                            as prospects_converted,
    count(p.id) filter (where p.status = 'booked')                               as prospects_booked,
    count(p.id) filter (where p.status = 'unsubscribed')                         as prospects_unsubscribed,
    count(p.id) filter (where p.status = 'bounced')                              as prospects_bounced
  from public.sales_campaigns c
  left join public.sales_prospects p on p.source_campaign = c.id
  group by c.id;

grant select on public.sales_campaign_stats to authenticated;

-- ============================================================================
-- Seed: 12 feeder-city campaigns (one per priority metro)
-- ============================================================================

insert into public.sales_campaigns (slug, name, feeder_city, segment, primary_channel, goal_leads, goal_booked, is_active)
values
  ('atlanta-golf-q1-2026',         'Atlanta — Golf Groups Q1 2026',          'Atlanta',         'golf',     'email',     500,  25, true),
  ('atlanta-family-spring-2026',   'Atlanta — Family Spring 2026',           'Atlanta',         'family',   'email',     500,  20, true),
  ('charlotte-couples-2026',       'Charlotte — Couples & Anniversaries 2026','Charlotte',      'couples',  'email',     400,  18, true),
  ('charlotte-golf-2026',          'Charlotte — Golf Groups 2026',           'Charlotte',       'golf',     'linkedin',  300,  15, true),
  ('nyc-honeymoon-2026',           'NYC — Honeymoon & Milestone 2026',       'NYC',             'honeymoon','instagram', 400,  12, true),
  ('nyc-family-spring-2026',       'NYC — Family Spring Break 2026',         'NYC',             'family',   'email',     400,  15, true),
  ('dc-family-2026',               'DC — Family Easter & Spring 2026',       'DC',              'family',   'email',     350,  14, true),
  ('boston-snowbird-2026',         'Boston — Snowbird Winter 2026-27',       'Boston',          'snowbird', 'email',     250,  10, true),
  ('chicago-couples-2026',         'Chicago — Couples Winter Escape',        'Chicago',         'couples',  'email',     300,  10, true),
  ('cincinnati-family-2026',       'Cincinnati — Family Drive Market',       'Cincinnati',      'family',   'facebook',  250,   8, true),
  ('nashville-couples-2026',       'Nashville — Couples Weekend',            'Nashville',       'couples',  'instagram', 250,   8, true),
  ('raleigh-family-2026',          'Raleigh-Durham — Family Drive Market',   'Raleigh-Durham',  'family',   'email',     400,  18, true),
  ('greenville-sc-family-2026',    'Greenville SC — Family Weekend',         'Greenville-SC',   'family',   'email',     300,  12, true),
  ('jacksonville-couples-2026',    'Jacksonville — Couples Quick Trips',     'Jacksonville',    'couples',  'email',     200,   8, true),
  ('orlando-snowbird-2026',        'Orlando — Snowbird Refugees',            'Orlando',         'snowbird', 'email',     150,   5, true)
on conflict (slug) do nothing;
