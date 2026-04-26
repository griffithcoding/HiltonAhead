-- Hilton Ahead: Backlink Outreach CRM (Phase 4a)
--
-- A separate domain from the booking-lead CRM (itinerary_requests etc.).
-- Models the link-building pipeline:
--
--   outreach_accounts    websites/publications we want backlinks from
--     ↓
--   outreach_contacts    editors/owners/writers at those sites
--     ↓
--   outreach_opportunities  a specific link-building deal
--     ↓
--   outreach_activity    timeline (notes, emails, stage changes, link placed)
--
-- Reuses the public.is_admin() RLS helper from migration 003.
-- Idempotent — safe to re-run.

create extension if not exists pgcrypto;

-- ============================================================================
-- Enums
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'outreach_account_status') then
    create type outreach_account_status as enum (
      'active',     -- in pipeline
      'paused',     -- holding off intentionally
      'blacklisted' -- never contact
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'outreach_contact_source') then
    create type outreach_contact_source as enum (
      'manual',
      'csv_import',
      'hunter',
      'apollo',
      'clearbit',
      'discovery_agent',
      'reply'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'outreach_opportunity_stage') then
    create type outreach_opportunity_stage as enum (
      'discovered',   -- we know about the prospect
      'researched',   -- we've read their site, identified target page
      'outreached',   -- first email sent
      'followed_up',  -- second/third email sent, no reply yet
      'replied',      -- they responded
      'negotiating',  -- agreed in principle, working out details
      'agreed',       -- terms locked, awaiting placement
      'published',    -- link is live (success)
      'declined',     -- they said no
      'no_response'   -- ghosted after full sequence
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'outreach_link_type') then
    create type outreach_link_type as enum (
      'guest_post',
      'resource_page',
      'niche_edit',         -- inserting our link into an existing post
      'broken_link',        -- replacing a 404 with our URL
      'unlinked_mention',   -- "they mentioned us, ask for a link"
      'digital_pr',         -- press / story-driven
      'directory',
      'partnership',
      'other'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'outreach_activity_kind') then
    create type outreach_activity_kind as enum (
      'note',
      'stage_change',
      'email_sent',
      'email_received',
      'sequence_started',
      'sequence_paused',
      'sequence_completed',
      'link_published',
      'declined',
      'system'
    );
  end if;
end $$;

-- ============================================================================
-- outreach_accounts — the website/publication
-- ============================================================================
create table if not exists public.outreach_accounts (
  id              uuid primary key default gen_random_uuid(),
  domain          text not null unique,           -- canonical: lowercase, no www, no protocol
  name            text,                            -- display name, e.g. "Travel + Leisure"
  homepage_url    text,                            -- full URL with protocol
  vertical        text,                            -- 'travel', 'wedding', 'golf', 'real-estate', 'food', 'lifestyle', etc.
  domain_rating   integer check (domain_rating between 0 and 100),
  monthly_traffic integer check (monthly_traffic >= 0),
  country         text,                            -- ISO-2, e.g. 'US'
  status          outreach_account_status not null default 'active',
  notes           text,
  -- Provenance
  source          outreach_contact_source not null default 'manual',
  added_by        text,                            -- admin email
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_outreach_accounts_domain
  on public.outreach_accounts(lower(domain));
create index if not exists idx_outreach_accounts_status
  on public.outreach_accounts(status);
create index if not exists idx_outreach_accounts_vertical
  on public.outreach_accounts(vertical);
create index if not exists idx_outreach_accounts_dr
  on public.outreach_accounts(domain_rating desc nulls last);

-- ============================================================================
-- outreach_contacts — a person at an account
-- ============================================================================
create table if not exists public.outreach_contacts (
  id                  uuid primary key default gen_random_uuid(),
  account_id          uuid not null references public.outreach_accounts(id) on delete cascade,
  first_name          text,
  last_name           text,
  email               text not null,
  role                text,                       -- 'editor', 'owner', 'writer', 'PR'
  linkedin_url        text,
  twitter_handle      text,
  source              outreach_contact_source not null default 'manual',
  email_validated     boolean not null default false,
  email_bounced       boolean not null default false,
  opted_out           boolean not null default false,   -- CAN-SPAM compliance
  opted_out_at        timestamptz,
  notes               text,
  added_by            text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- A given email lives at exactly one contact row (case-insensitive).
-- Postgres doesn't allow function expressions in table-level UNIQUE
-- constraints — must be a unique index instead.
create unique index if not exists idx_outreach_contacts_email_unique
  on public.outreach_contacts(lower(email));

create index if not exists idx_outreach_contacts_account
  on public.outreach_contacts(account_id);
create index if not exists idx_outreach_contacts_opted_out
  on public.outreach_contacts(opted_out)
  where opted_out = true;

-- ============================================================================
-- outreach_opportunities — one link-building "deal"
-- ============================================================================
create table if not exists public.outreach_opportunities (
  id                      uuid primary key default gen_random_uuid(),
  account_id              uuid not null references public.outreach_accounts(id) on delete cascade,
  contact_id              uuid references public.outreach_contacts(id) on delete set null,
  stage                   outreach_opportunity_stage not null default 'discovered',
  link_type               outreach_link_type not null default 'other',
  target_url              text,                  -- our URL we want linked, e.g. https://hiltonahead.com/local/golf
  source_url              text,                  -- their URL we're targeting (for niche edits / broken-link)
  anchor_text_proposal    text,
  campaign                text,                  -- freeform tag, e.g. 'q2-2026-golf-push'
  estimated_value         text,                  -- 'low' | 'medium' | 'high' (DR + relevance composite)
  cost                    numeric(10,2),         -- if paid placement (most should be 0)
  currency                text default 'USD',
  placed_link_url         text,                  -- once link is live
  placed_at               timestamptz,
  declined_reason         text,
  next_action_at          timestamptz,           -- mirrors lead.next_action_at pattern
  assigned_to             text,                  -- admin email
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_outreach_opps_account
  on public.outreach_opportunities(account_id);
create index if not exists idx_outreach_opps_contact
  on public.outreach_opportunities(contact_id);
create index if not exists idx_outreach_opps_stage
  on public.outreach_opportunities(stage);
create index if not exists idx_outreach_opps_next_action
  on public.outreach_opportunities(next_action_at)
  where next_action_at is not null;
create index if not exists idx_outreach_opps_campaign
  on public.outreach_opportunities(campaign);
create index if not exists idx_outreach_opps_assigned
  on public.outreach_opportunities(assigned_to);

-- ============================================================================
-- outreach_activity — timeline of every action on an opportunity
-- (mirrors the shape of lead_activity but scoped to outreach.)
-- ============================================================================
create table if not exists public.outreach_activity (
  id              uuid primary key default gen_random_uuid(),
  opportunity_id  uuid not null references public.outreach_opportunities(id) on delete cascade,
  contact_id      uuid references public.outreach_contacts(id) on delete set null,
  kind            outreach_activity_kind not null,
  actor_email     text,                          -- admin email; null for system events
  body            text,                          -- note text, subject line, stage transition, etc.
  -- Email: { thread_id, message_id, snippet, from, to, subject }
  -- Stage change: { from, to }
  -- Sequence: { sequence_id, step_index }
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_outreach_activity_opp
  on public.outreach_activity(opportunity_id, created_at desc);
create index if not exists idx_outreach_activity_kind
  on public.outreach_activity(kind);
create index if not exists idx_outreach_activity_created
  on public.outreach_activity(created_at desc);

-- ============================================================================
-- updated_at trigger (reuses set_updated_at from migration 001)
-- ============================================================================
drop trigger if exists trg_outreach_accounts_updated on public.outreach_accounts;
create trigger trg_outreach_accounts_updated
  before update on public.outreach_accounts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_outreach_contacts_updated on public.outreach_contacts;
create trigger trg_outreach_contacts_updated
  before update on public.outreach_contacts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_outreach_opps_updated on public.outreach_opportunities;
create trigger trg_outreach_opps_updated
  before update on public.outreach_opportunities
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Auto-log stage changes to outreach_activity
-- ============================================================================
create or replace function public.log_outreach_stage_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'UPDATE' and old.stage is distinct from new.stage) then
    insert into public.outreach_activity
      (opportunity_id, contact_id, kind, actor_email, body, metadata)
    values
      (new.id, new.contact_id, 'stage_change',
       coalesce(auth.jwt() ->> 'email', 'system'),
       old.stage::text || ' → ' || new.stage::text,
       jsonb_build_object('from', old.stage, 'to', new.stage));

    -- Auto-set placed_at when transitioning to 'published'
    if (new.stage = 'published' and new.placed_at is null) then
      new.placed_at := now();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_outreach_opps_stage_log on public.outreach_opportunities;
create trigger trg_outreach_opps_stage_log
  before update of stage on public.outreach_opportunities
  for each row execute function public.log_outreach_stage_change();

-- ============================================================================
-- RLS — admins only (reuses is_admin() from migration 003)
-- ============================================================================
alter table public.outreach_accounts enable row level security;
alter table public.outreach_contacts enable row level security;
alter table public.outreach_opportunities enable row level security;
alter table public.outreach_activity enable row level security;

-- outreach_accounts
drop policy if exists "Admins read outreach_accounts" on public.outreach_accounts;
create policy "Admins read outreach_accounts"
  on public.outreach_accounts for select using (public.is_admin());
drop policy if exists "Admins write outreach_accounts" on public.outreach_accounts;
create policy "Admins write outreach_accounts"
  on public.outreach_accounts for all using (public.is_admin()) with check (public.is_admin());

-- outreach_contacts
drop policy if exists "Admins read outreach_contacts" on public.outreach_contacts;
create policy "Admins read outreach_contacts"
  on public.outreach_contacts for select using (public.is_admin());
drop policy if exists "Admins write outreach_contacts" on public.outreach_contacts;
create policy "Admins write outreach_contacts"
  on public.outreach_contacts for all using (public.is_admin()) with check (public.is_admin());

-- outreach_opportunities
drop policy if exists "Admins read outreach_opportunities" on public.outreach_opportunities;
create policy "Admins read outreach_opportunities"
  on public.outreach_opportunities for select using (public.is_admin());
drop policy if exists "Admins write outreach_opportunities" on public.outreach_opportunities;
create policy "Admins write outreach_opportunities"
  on public.outreach_opportunities for all using (public.is_admin()) with check (public.is_admin());

-- outreach_activity
drop policy if exists "Admins read outreach_activity" on public.outreach_activity;
create policy "Admins read outreach_activity"
  on public.outreach_activity for select using (public.is_admin());
drop policy if exists "Admins write outreach_activity" on public.outreach_activity;
create policy "Admins write outreach_activity"
  on public.outreach_activity for insert with check (public.is_admin());
drop policy if exists "Admins delete outreach_activity" on public.outreach_activity;
create policy "Admins delete outreach_activity"
  on public.outreach_activity for delete using (public.is_admin());

-- ============================================================================
-- View: pipeline summary per stage
-- (powers the kanban / pipeline header counts in the UI)
-- ============================================================================
create or replace view public.outreach_pipeline_counts as
select
  stage,
  count(*)                       as total,
  count(*) filter (where next_action_at <= now()) as overdue,
  sum(case when stage = 'published' then 1 else 0 end) as published_count
from public.outreach_opportunities
group by stage;

-- View security: piggyback on the underlying tables' RLS.
grant select on public.outreach_pipeline_counts to authenticated;
