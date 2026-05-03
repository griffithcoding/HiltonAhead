-- Hilton Ahead: direct-sponsorship impression + click tracking.
--
-- Display ad slots sold directly to local businesses (Featured Pin, Story
-- Sponsor, Page Display) write here so we can deliver advertisers a monthly
-- "you got X impressions and Y clicks" report. That report is the difference
-- between selling once and renewing.
--
-- Public anon-only insert via /api/sponsor/track. Service role for reads.
--
-- Depends on: 003_admin_crm.sql (is_admin). Idempotent.

create table if not exists public.sponsor_events (
  id              uuid primary key default gen_random_uuid(),
  -- Slot id from data/sponsorships.ts (e.g. 'local-restaurants-pin').
  slot_id         text not null,
  -- Sponsor id (advertiser) — null when the slot is unsold (house ad).
  sponsor_id      text,
  event_type      text not null
                  check (event_type in (
                    'sponsor_impression', 'sponsor_click'
                  )),
  ip_hash         text,
  user_agent      text,
  referrer        text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_sponsor_events_slot_created
  on public.sponsor_events (slot_id, created_at desc);
create index if not exists idx_sponsor_events_sponsor_created
  on public.sponsor_events (sponsor_id, created_at desc);
create index if not exists idx_sponsor_events_type_created
  on public.sponsor_events (event_type, created_at desc);

-- ============================================================================
-- RLS — deny by default. Service role bypasses RLS.
-- ============================================================================
alter table public.sponsor_events enable row level security;

drop policy if exists "Admins can read sponsor_events" on public.sponsor_events;
create policy "Admins can read sponsor_events"
  on public.sponsor_events for select
  using (public.is_admin());
