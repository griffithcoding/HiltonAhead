-- Hilton Ahead: Lead Email Engine
--
-- Mirrors migration 023 (outreach email engine) for the inbound leads
-- CRM. Adds:
--
--   1. lead_email_events  — pixel-tracked opens, link clicks, bounces
--                            for emails sent from /admin/leads
--   2. itinerary_requests / leads columns:
--        - last_send_at        — for sequence-cron's "+Nd" math
--        - last_received_at    — flips automatically on inbound reply
--        - reply_count
--        - sequence_active     — operator-toggleable kill switch
--   3. Auto-sync trigger on lead_activity inserts → keeps the
--      denormalized columns current without app-level wiring.
--   4. lead_engagement view — per-lead rollup of open/click/bounce/reply
--      counts. Sourced by the lead detail page and the inbox.
--
-- newsletter_subscribers is intentionally excluded — the existing send
-- action refuses to send to that table, so engagement tracking would
-- never populate anything.
--
-- Reuses public.is_admin() RLS helper from migration 003. Idempotent.

create extension if not exists pgcrypto;

-- ============================================================================
-- itinerary_requests — denormalized email-engine columns
-- ============================================================================

alter table public.itinerary_requests
  add column if not exists last_send_at timestamptz;
alter table public.itinerary_requests
  add column if not exists last_received_at timestamptz;
alter table public.itinerary_requests
  add column if not exists reply_count integer not null default 0;
alter table public.itinerary_requests
  add column if not exists sequence_active boolean not null default true;

create index if not exists idx_itinerary_requests_seq_due
  on public.itinerary_requests(status, last_send_at)
  where sequence_active = true and last_received_at is null;

create index if not exists idx_itinerary_requests_last_received
  on public.itinerary_requests(last_received_at)
  where last_received_at is not null;

-- ============================================================================
-- leads — same denorm columns
-- ============================================================================

alter table public.leads
  add column if not exists last_send_at timestamptz;
alter table public.leads
  add column if not exists last_received_at timestamptz;
alter table public.leads
  add column if not exists reply_count integer not null default 0;
alter table public.leads
  add column if not exists sequence_active boolean not null default true;

create index if not exists idx_leads_seq_due
  on public.leads(status, last_send_at)
  where sequence_active = true and last_received_at is null;

create index if not exists idx_leads_last_received
  on public.leads(last_received_at)
  where last_received_at is not null;

-- ============================================================================
-- Trigger — sync last_send_at / last_received_at / reply_count when
-- lead_activity gets a new row. Dispatches on lead_table to know which
-- parent to update.
-- ============================================================================

create or replace function public.sync_lead_activity_to_parent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.lead_table = 'itinerary_requests' then
    if new.kind = 'email_sent' then
      update public.itinerary_requests
        set last_send_at = new.created_at
        where id = new.lead_id;
    elsif new.kind = 'email_received' then
      update public.itinerary_requests
        set last_received_at = new.created_at,
            reply_count = reply_count + 1
        where id = new.lead_id;
    end if;
  elsif new.lead_table = 'leads' then
    if new.kind = 'email_sent' then
      update public.leads
        set last_send_at = new.created_at
        where id = new.lead_id;
    elsif new.kind = 'email_received' then
      update public.leads
        set last_received_at = new.created_at,
            reply_count = reply_count + 1
        where id = new.lead_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_lead_activity_sync on public.lead_activity;
create trigger trg_lead_activity_sync
  after insert on public.lead_activity
  for each row execute function public.sync_lead_activity_to_parent();

-- Backfill — itinerary_requests
update public.itinerary_requests t
set
  last_send_at = (
    select max(created_at) from public.lead_activity a
    where a.lead_table = 'itinerary_requests'
      and a.lead_id = t.id
      and a.kind = 'email_sent'
  ),
  last_received_at = (
    select max(created_at) from public.lead_activity a
    where a.lead_table = 'itinerary_requests'
      and a.lead_id = t.id
      and a.kind = 'email_received'
  ),
  reply_count = (
    select count(*) from public.lead_activity a
    where a.lead_table = 'itinerary_requests'
      and a.lead_id = t.id
      and a.kind = 'email_received'
  )
where t.last_send_at is null
  and exists (
    select 1 from public.lead_activity a
    where a.lead_table = 'itinerary_requests' and a.lead_id = t.id
  );

-- Backfill — leads
update public.leads t
set
  last_send_at = (
    select max(created_at) from public.lead_activity a
    where a.lead_table = 'leads'
      and a.lead_id = t.id
      and a.kind = 'email_sent'
  ),
  last_received_at = (
    select max(created_at) from public.lead_activity a
    where a.lead_table = 'leads'
      and a.lead_id = t.id
      and a.kind = 'email_received'
  ),
  reply_count = (
    select count(*) from public.lead_activity a
    where a.lead_table = 'leads'
      and a.lead_id = t.id
      and a.kind = 'email_received'
  )
where t.last_send_at is null
  and exists (
    select 1 from public.lead_activity a
    where a.lead_table = 'leads' and a.lead_id = t.id
  );

-- ============================================================================
-- lead_email_events — opens / clicks / bounces per (lead_table, lead_id)
--
-- Mirrors outreach_email_events but addresses lead rows. We don't FK to
-- itinerary_requests or leads directly because lead_table is polymorphic;
-- a CHECK constraint enforces the allowed values instead.
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_email_event_kind') then
    create type lead_email_event_kind as enum (
      'open',
      'click',
      'bounce'
    );
  end if;
end $$;

create table if not exists public.lead_email_events (
  id           uuid primary key default gen_random_uuid(),
  lead_table   text not null check (lead_table in ('itinerary_requests', 'leads')),
  lead_id      uuid not null,
  tracking_id  text,                          -- UUID minted at send-time
  kind         lead_email_event_kind not null,
  url          text,                          -- click: original (unwrapped) URL
  user_agent   text,
  ip_hash      text,                          -- sha256 hex (truncated)
  event_at     timestamptz not null default now()
);

create index if not exists idx_lead_email_events_target
  on public.lead_email_events(lead_table, lead_id, event_at desc);

create index if not exists idx_lead_email_events_tracking
  on public.lead_email_events(tracking_id)
  where tracking_id is not null;

create index if not exists idx_lead_email_events_kind
  on public.lead_email_events(kind, event_at desc);

alter table public.lead_email_events enable row level security;

drop policy if exists "Admins read lead_email_events" on public.lead_email_events;
create policy "Admins read lead_email_events"
  on public.lead_email_events for select
  using (public.is_admin());

-- ============================================================================
-- lead_engagement view — per-lead rollup. Used by the lead detail page's
-- engagement strip and by the inbox view.
-- ============================================================================
create or replace view public.lead_engagement as
select
  t.lead_table,
  t.lead_id,
  t.last_send_at,
  t.last_received_at,
  t.reply_count,
  t.sequence_active,
  (select count(*) from public.lead_email_events e
    where e.lead_table = t.lead_table
      and e.lead_id = t.lead_id
      and e.kind = 'open')                                              as open_count,
  (select count(*) from public.lead_email_events e
    where e.lead_table = t.lead_table
      and e.lead_id = t.lead_id
      and e.kind = 'click')                                             as click_count,
  (select count(*) from public.lead_email_events e
    where e.lead_table = t.lead_table
      and e.lead_id = t.lead_id
      and e.kind = 'bounce')                                            as bounce_count,
  (select max(e.event_at) from public.lead_email_events e
    where e.lead_table = t.lead_table
      and e.lead_id = t.lead_id)                                        as last_event_at
from (
  select 'itinerary_requests'::text as lead_table, id as lead_id,
         last_send_at, last_received_at, reply_count, sequence_active
    from public.itinerary_requests
  union all
  select 'leads'::text, id,
         last_send_at, last_received_at, reply_count, sequence_active
    from public.leads
) t;

grant select on public.lead_engagement to authenticated;
