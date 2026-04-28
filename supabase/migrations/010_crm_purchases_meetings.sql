-- Hilton Ahead: CRM Phase 4 — surface purchases + meetings inside admin.
--
-- Two changes:
--   1. Open admin SELECT on `purchases` (was service-role only) so the
--      admin dashboard, lead detail, and /admin/purchases page can read
--      Stripe-paid revenue. Inserts/updates remain service-role only —
--      the Stripe webhook is still the only writer.
--   2. New `meetings` table holding Google Calendar + Calendly bookings,
--      keyed by (provider, provider_event_id). Service role writes from
--      the calendar sync action and the Calendly webhook. Admins read
--      and may edit (e.g. attach a lead manually) via RLS.
--
-- Depends on: 003_admin_crm.sql (is_admin), 002 (set_updated_at), 009
-- (purchases). Idempotent.

-- ============================================================================
-- 1. Admin read on purchases.
-- ============================================================================
drop policy if exists "Admins can read purchases" on public.purchases;
create policy "Admins can read purchases"
  on public.purchases for select
  using (public.is_admin());

-- ============================================================================
-- 2. meetings — unified Google Calendar + Calendly bookings.
-- ============================================================================
create table if not exists public.meetings (
  id                  uuid primary key default gen_random_uuid(),
  provider            text not null
                      check (provider in ('google_calendar', 'calendly')),
  -- Google: events.id; Calendly: scheduled_event uuid
  provider_event_id   text not null,
  -- Optional link back to a CRM lead. Resolved by attendee email match
  -- at sync time; nullable so we don't drop events for unknown emails.
  lead_table          lead_table_kind,
  lead_id             uuid,
  title               text,
  description         text,
  -- Stored lowercase for case-insensitive joins to lead.email columns.
  attendee_email      text,
  attendee_name       text,
  scheduled_at        timestamptz not null,
  end_at              timestamptz,
  -- Google: hangoutLink / htmlLink; Calendly: invitee.cancel_url or
  -- event.location.join_url.
  meeting_url         text,
  status              text not null default 'scheduled'
                      check (status in (
                        'scheduled', 'canceled', 'completed', 'no_show'
                      )),
  metadata            jsonb not null default '{}'::jsonb,
  synced_at           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique (provider, provider_event_id)
);

create index if not exists idx_meetings_attendee_email
  on public.meetings(attendee_email);
create index if not exists idx_meetings_scheduled_at
  on public.meetings(scheduled_at desc);
create index if not exists idx_meetings_lead
  on public.meetings(lead_table, lead_id);
create index if not exists idx_meetings_status
  on public.meetings(status);

alter table public.meetings enable row level security;

drop policy if exists "Admins can read meetings" on public.meetings;
create policy "Admins can read meetings"
  on public.meetings for select
  using (public.is_admin());

drop policy if exists "Admins can insert meetings" on public.meetings;
create policy "Admins can insert meetings"
  on public.meetings for insert
  with check (public.is_admin());

drop policy if exists "Admins can update meetings" on public.meetings;
create policy "Admins can update meetings"
  on public.meetings for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete meetings" on public.meetings;
create policy "Admins can delete meetings"
  on public.meetings for delete
  using (public.is_admin());

drop trigger if exists trg_meetings_updated_at on public.meetings;
create trigger trg_meetings_updated_at
  before update on public.meetings
  for each row
  execute function public.set_updated_at();
