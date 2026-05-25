-- Hilton Ahead: Outreach Email Engine
--
-- Adds the missing pieces that turn the outreach CRM (migration 007) into
-- a full automation surface:
--
--   1. outreach_email_events  — pixel-tracked opens, link clicks, bounces
--   2. outreach_opportunities columns:
--        - last_send_at        — for sequence cron's "+5d / +15d" math
--        - last_received_at    — flips automatically on inbound reply
--        - reply_count         — quick count, no view roundtrip
--        - sequence_active     — operator-toggleable kill switch per opp
--   3. Auto-sync trigger on outreach_activity inserts → keeps the
--      denormalized columns above current without app-level wiring.
--   4. outreach_pipeline_counts view — extended with reply / sequence
--      counts so the kanban header can render at a glance.
--
-- Reuses public.is_admin() RLS helper from migration 003. Idempotent.

create extension if not exists pgcrypto;

-- ============================================================================
-- outreach_opportunities — denormalized activity columns
-- ============================================================================

alter table public.outreach_opportunities
  add column if not exists last_send_at timestamptz;

alter table public.outreach_opportunities
  add column if not exists last_received_at timestamptz;

alter table public.outreach_opportunities
  add column if not exists reply_count integer not null default 0;

alter table public.outreach_opportunities
  add column if not exists sequence_active boolean not null default true;

-- Indices the sequence cron queries against.
create index if not exists idx_outreach_opps_seq_due
  on public.outreach_opportunities(stage, last_send_at)
  where sequence_active = true
    and last_received_at is null;

create index if not exists idx_outreach_opps_last_received
  on public.outreach_opportunities(last_received_at)
  where last_received_at is not null;

-- ============================================================================
-- Trigger: keep last_send_at / last_received_at / reply_count in sync
-- whenever the activity timeline gets a new entry.
-- ============================================================================

create or replace function public.sync_outreach_opp_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.kind = 'email_sent' then
    update public.outreach_opportunities
      set last_send_at = new.created_at
      where id = new.opportunity_id;
  elsif new.kind = 'email_received' then
    update public.outreach_opportunities
      set last_received_at = new.created_at,
          reply_count = reply_count + 1
      where id = new.opportunity_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_outreach_activity_sync on public.outreach_activity;
create trigger trg_outreach_activity_sync
  after insert on public.outreach_activity
  for each row execute function public.sync_outreach_opp_activity();

-- Backfill last_send_at / last_received_at / reply_count for opportunities
-- that already have activity rows (safe because of `if not exists` columns).
update public.outreach_opportunities o
set
  last_send_at = (
    select max(created_at) from public.outreach_activity a
    where a.opportunity_id = o.id and a.kind = 'email_sent'
  ),
  last_received_at = (
    select max(created_at) from public.outreach_activity a
    where a.opportunity_id = o.id and a.kind = 'email_received'
  ),
  reply_count = (
    select count(*) from public.outreach_activity a
    where a.opportunity_id = o.id and a.kind = 'email_received'
  )
where o.last_send_at is null
   and exists (
     select 1 from public.outreach_activity a
     where a.opportunity_id = o.id
   );

-- ============================================================================
-- outreach_email_events — pixel opens, link clicks, bounces
--
-- One row per event. tracking_id is the UUID we generate at send time
-- (BEFORE the Gmail send, since the tracking pixel URL has to be embedded
-- in the body). The Gmail message ID and thread ID land in the matching
-- outreach_activity.metadata block. We link by opportunity_id + tracking_id.
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'outreach_email_event_kind') then
    create type outreach_email_event_kind as enum (
      'open',
      'click',
      'bounce'
    );
  end if;
end $$;

create table if not exists public.outreach_email_events (
  id              uuid primary key default gen_random_uuid(),
  opportunity_id  uuid not null references public.outreach_opportunities(id) on delete cascade,
  contact_id      uuid references public.outreach_contacts(id) on delete set null,
  tracking_id     text,                          -- UUID generated at send-time, embedded in pixel/click URLs
  kind            outreach_email_event_kind not null,
  url             text,                          -- for clicks: the original (unwrapped) URL
  user_agent      text,
  ip_hash         text,                          -- sha256 hex (16 bytes truncated for storage)
  event_at        timestamptz not null default now()
);

create index if not exists idx_outreach_email_events_opp
  on public.outreach_email_events(opportunity_id, event_at desc);

create index if not exists idx_outreach_email_events_tracking
  on public.outreach_email_events(tracking_id)
  where tracking_id is not null;

create index if not exists idx_outreach_email_events_kind
  on public.outreach_email_events(kind, event_at desc);

alter table public.outreach_email_events enable row level security;

-- Admin read-only via UI. Inserts come from server routes using the
-- service-role client (the /api/outreach/track/* endpoints are public
-- by design — they're called from email clients).
drop policy if exists "Admins read outreach_email_events" on public.outreach_email_events;
create policy "Admins read outreach_email_events"
  on public.outreach_email_events for select
  using (public.is_admin());

-- ============================================================================
-- Updated pipeline summary view — adds reply + sequence counts.
-- ============================================================================
create or replace view public.outreach_pipeline_counts as
select
  stage,
  count(*)                                                            as total,
  count(*) filter (where next_action_at <= now())                     as overdue,
  count(*) filter (where stage = 'published')                         as published_count,
  count(*) filter (where reply_count > 0)                             as replied_count,
  count(*) filter (where sequence_active and last_received_at is null) as sequence_active_count
from public.outreach_opportunities
group by stage;

grant select on public.outreach_pipeline_counts to authenticated;

-- ============================================================================
-- Per-opportunity engagement summary view — used by the inbox + opp detail.
-- ============================================================================
create or replace view public.outreach_opp_engagement as
select
  o.id                                                                as opportunity_id,
  o.account_id,
  o.contact_id,
  o.stage,
  o.last_send_at,
  o.last_received_at,
  o.reply_count,
  o.sequence_active,
  (select count(*) from public.outreach_email_events e
    where e.opportunity_id = o.id and e.kind = 'open')                as open_count,
  (select count(*) from public.outreach_email_events e
    where e.opportunity_id = o.id and e.kind = 'click')               as click_count,
  (select count(*) from public.outreach_email_events e
    where e.opportunity_id = o.id and e.kind = 'bounce')              as bounce_count,
  (select max(e.event_at) from public.outreach_email_events e
    where e.opportunity_id = o.id)                                    as last_event_at
from public.outreach_opportunities o;

grant select on public.outreach_opp_engagement to authenticated;
