-- Hilton Ahead: unify lead status vocabulary + harden SECURITY DEFINER
-- search paths.
--
-- C1 fix: the CRM dropdown offers a unified pipeline
--   new → contacted → qualified → quoted → booked → converted, plus archived / lost.
-- Migrations 001 and 002 defined disjoint subsets on itinerary_requests vs
-- leads, so the dropdown's qualified/converted/lost writes would fail the
-- CHECK constraint. This widens both tables to the full union.
--
-- C4 fix: every SECURITY DEFINER function should pin search_path to
-- `pg_catalog, public` so built-ins cannot be shadowed via a crafted
-- temp schema. Migration 003's is_admin + log_* functions had
-- search_path = public, which leaves pg_catalog implicitly last.
--
-- Depends on: 001, 002, 003, 004. Idempotent.

-- ============================================================================
-- C1: widen status CHECK on itinerary_requests + leads to the full pipeline
-- ============================================================================

alter table public.itinerary_requests
  drop constraint if exists itinerary_requests_status_check;

alter table public.itinerary_requests
  add constraint itinerary_requests_status_check
  check (status in (
    'new', 'contacted', 'qualified', 'quoted',
    'booked', 'converted', 'archived', 'lost'
  ));

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (status in (
    'new', 'contacted', 'qualified', 'quoted',
    'booked', 'converted', 'archived', 'lost'
  ));

-- ============================================================================
-- C4: re-pin search_path on SECURITY DEFINER functions to pg_catalog, public
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.log_itinerary_status_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
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

create or replace function public.log_leads_status_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
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
