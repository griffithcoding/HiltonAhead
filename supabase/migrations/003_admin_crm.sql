-- Hilton Ahead: in-house CRM foundations.
--
-- Adds admin whitelist table, is_admin() helper, lead_activity timeline,
-- and RLS updates so authenticated admins can read/update the lead tables
-- (itinerary_requests, newsletter_subscribers, leads).
--
-- Depends on: 001_itinerary_requests.sql, 002_newsletter_subscribers.sql.
-- Idempotent — safe to re-run.

create extension if not exists pgcrypto;

-- ============================================================================
-- admin_users — whitelist of emails allowed into /admin.
-- Created first (with RLS enabled but no policies yet) because is_admin()
-- needs to read it. Policies are added below after the function exists.
-- ============================================================================
create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  display_name  text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_admin_users_email on public.admin_users(lower(email));

alter table public.admin_users enable row level security;

-- Seed: hiltonahead@gmail.com is the founding admin.
-- Done BEFORE any policies bite so it always succeeds under service_role.
insert into public.admin_users (email, display_name)
values ('hiltonahead@gmail.com', 'Hilton Ahead')
on conflict (email) do nothing;

-- ============================================================================
-- is_admin() — RLS helper. Checks the calling user's email against
-- admin_users. SECURITY DEFINER so it bypasses RLS on admin_users itself,
-- avoiding a circular permission problem.
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

comment on function public.is_admin() is
  'True when the calling authenticated user''s email appears in admin_users. '
  'Used by RLS policies on CRM tables.';

-- ============================================================================
-- Now safe to define RLS policies that reference is_admin().
-- ============================================================================

-- --- admin_users ---
drop policy if exists "Admins can read admin_users" on public.admin_users;
create policy "Admins can read admin_users"
  on public.admin_users for select
  using (public.is_admin());

drop policy if exists "Admins can manage admin_users" on public.admin_users;
create policy "Admins can manage admin_users"
  on public.admin_users for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- itinerary_requests ---
drop policy if exists "Admins can read itinerary requests" on public.itinerary_requests;
create policy "Admins can read itinerary requests"
  on public.itinerary_requests for select
  using (public.is_admin());

drop policy if exists "Admins can update itinerary requests" on public.itinerary_requests;
create policy "Admins can update itinerary requests"
  on public.itinerary_requests for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete itinerary requests" on public.itinerary_requests;
create policy "Admins can delete itinerary requests"
  on public.itinerary_requests for delete
  using (public.is_admin());

-- --- newsletter_subscribers ---
drop policy if exists "Admins can read newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins can read newsletter subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

drop policy if exists "Admins can update newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins can update newsletter subscribers"
  on public.newsletter_subscribers for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins can delete newsletter subscribers"
  on public.newsletter_subscribers for delete
  using (public.is_admin());

-- --- leads (generic) ---
drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads for select
  using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads for delete
  using (public.is_admin());

-- ============================================================================
-- lead_activity — polymorphic timeline of everything that's happened
-- to a lead: status changes, manual notes, emails sent/received, calls,
-- meeting bookings. One table for all lead types so the feed is unified.
-- ============================================================================

-- Lead kinds we can attach activity to.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_table_kind') then
    create type lead_table_kind as enum (
      'itinerary_requests',
      'newsletter_subscribers',
      'leads'
    );
  end if;
end $$;

-- Activity kinds.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_activity_kind') then
    create type lead_activity_kind as enum (
      'note',
      'status_change',
      'email_sent',
      'email_received',
      'call',
      'meeting_booked',
      'payment',
      'system'
    );
  end if;
end $$;

create table if not exists public.lead_activity (
  id            uuid primary key default gen_random_uuid(),
  lead_table    lead_table_kind not null,
  lead_id       uuid not null,
  kind          lead_activity_kind not null,
  -- Who did it. For user actions, this is the admin's email from JWT.
  -- For system actions ('system' kind), nullable.
  actor_email   text,
  -- Human-readable body. For notes, the note text. For status_change,
  -- something like "new → contacted". For emails, the subject line.
  body          text,
  -- Freeform metadata. For email: thread_id, message_id, snippet.
  -- For call: duration_seconds, recording_url, direction.
  -- For status_change: { from, to }.
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists idx_lead_activity_lead
  on public.lead_activity(lead_table, lead_id, created_at desc);
create index if not exists idx_lead_activity_created_at
  on public.lead_activity(created_at desc);
create index if not exists idx_lead_activity_kind
  on public.lead_activity(kind);

alter table public.lead_activity enable row level security;

drop policy if exists "Admins can read lead activity" on public.lead_activity;
create policy "Admins can read lead activity"
  on public.lead_activity for select
  using (public.is_admin());

drop policy if exists "Admins can write lead activity" on public.lead_activity;
create policy "Admins can write lead activity"
  on public.lead_activity for insert
  with check (public.is_admin());

drop policy if exists "Admins can delete lead activity" on public.lead_activity;
create policy "Admins can delete lead activity"
  on public.lead_activity for delete
  using (public.is_admin());

-- ============================================================================
-- Trigger: auto-log status changes to lead_activity.
-- ============================================================================
create or replace function public.log_itinerary_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.lead_activity (lead_table, lead_id, kind, actor_email, body, metadata)
    values (
      'itinerary_requests',
      new.id,
      'status_change',
      coalesce(auth.jwt() ->> 'email', 'system'),
      old.status || ' → ' || new.status,
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_itinerary_log_status on public.itinerary_requests;
create trigger trg_itinerary_log_status
  after update of status on public.itinerary_requests
  for each row
  execute function public.log_itinerary_status_change();

create or replace function public.log_leads_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.lead_activity (lead_table, lead_id, kind, actor_email, body, metadata)
    values (
      'leads',
      new.id,
      'status_change',
      coalesce(auth.jwt() ->> 'email', 'system'),
      old.status || ' → ' || new.status,
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_leads_log_status on public.leads;
create trigger trg_leads_log_status
  after update of status on public.leads
  for each row
  execute function public.log_leads_status_change();
