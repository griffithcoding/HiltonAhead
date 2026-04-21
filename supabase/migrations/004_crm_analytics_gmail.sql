-- Hilton Ahead: CRM Phase 2 (analytics) + Phase 3 (Gmail) foundations.
--
-- Phase 2 adds:
--   - first_contacted_at, converted_at, deal_value on itinerary_requests + leads
--   - triggers to auto-stamp those timestamps based on status transitions
--
-- Phase 3 adds:
--   - gmail_tokens table storing per-admin Gmail OAuth refresh tokens
--
-- Depends on: 001, 002, 003. Idempotent — safe to re-run.

-- ============================================================================
-- PHASE 2: Analytics columns
-- ============================================================================

-- itinerary_requests ------------------------------------------------------
alter table public.itinerary_requests
  add column if not exists first_contacted_at timestamptz;

alter table public.itinerary_requests
  add column if not exists converted_at timestamptz;

alter table public.itinerary_requests
  add column if not exists deal_value numeric(12, 2);

create index if not exists idx_itinerary_requests_converted_at
  on public.itinerary_requests(converted_at desc)
  where converted_at is not null;

-- leads (generic) ---------------------------------------------------------
alter table public.leads
  add column if not exists first_contacted_at timestamptz;

alter table public.leads
  add column if not exists converted_at timestamptz;

alter table public.leads
  add column if not exists deal_value numeric(12, 2);

create index if not exists idx_leads_converted_at
  on public.leads(converted_at desc)
  where converted_at is not null;

-- ============================================================================
-- PHASE 2: Status-transition triggers — auto-stamp timestamps.
-- Triggers run AFTER the status-change logging trigger from migration 003.
-- ============================================================================

create or replace function public.stamp_lead_transition_timestamps()
returns trigger
language plpgsql
as $$
begin
  -- First time the lead leaves 'new' → timestamp first_contacted_at
  if new.status is distinct from old.status
     and old.status = 'new'
     and new.first_contacted_at is null then
    new.first_contacted_at := now();
  end if;

  -- Moving into a terminal "won" state → timestamp converted_at
  if new.status is distinct from old.status
     and new.status in ('booked', 'converted')
     and new.converted_at is null then
    new.converted_at := now();
  end if;

  -- Moving OUT of a won state → clear converted_at (unlikely but possible)
  if new.status is distinct from old.status
     and old.status in ('booked', 'converted')
     and new.status not in ('booked', 'converted') then
    new.converted_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_itinerary_stamp_timestamps on public.itinerary_requests;
create trigger trg_itinerary_stamp_timestamps
  before update of status on public.itinerary_requests
  for each row
  execute function public.stamp_lead_transition_timestamps();

drop trigger if exists trg_leads_stamp_timestamps on public.leads;
create trigger trg_leads_stamp_timestamps
  before update of status on public.leads
  for each row
  execute function public.stamp_lead_transition_timestamps();

-- ============================================================================
-- PHASE 3: gmail_tokens — stores per-admin Gmail API credentials.
--
-- One row per admin. Holds the refresh token (long-lived) and the most
-- recent access token (short-lived; we refresh on demand).
--
-- Sensitive: locked to admins only via RLS.
-- ============================================================================
create table if not exists public.gmail_tokens (
  id             uuid primary key default gen_random_uuid(),
  -- Google account's email (usually same as the admin's email).
  email          text not null unique,
  refresh_token  text not null,
  access_token   text,
  expires_at     timestamptz,
  scope          text,
  token_type     text default 'Bearer',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_gmail_tokens_email on public.gmail_tokens(lower(email));

alter table public.gmail_tokens enable row level security;

drop policy if exists "Admins can read gmail tokens" on public.gmail_tokens;
create policy "Admins can read gmail tokens"
  on public.gmail_tokens for select
  using (public.is_admin());

drop policy if exists "Admins can manage gmail tokens" on public.gmail_tokens;
create policy "Admins can manage gmail tokens"
  on public.gmail_tokens for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists trg_gmail_tokens_updated_at on public.gmail_tokens;
create trigger trg_gmail_tokens_updated_at
  before update on public.gmail_tokens
  for each row
  execute function public.set_updated_at();
