-- Hilton Ahead: "Funnel Pro" Phase A+B — next-follow-up tracking.
--
-- Adds next_action_at (timestamptz, nullable) to itinerary_requests + leads
-- so admins can schedule the next outreach per lead. Surfaced in the leads
-- list with overdue/today highlighting and on the dashboard as a "due"
-- counter.
--
-- Partial indexes only cover rows that actually have a date set, keeping
-- the index small (most leads will not have one scheduled at any moment).
--
-- Depends on: 001, 002, 003, 004, 005. Idempotent.

alter table public.itinerary_requests
  add column if not exists next_action_at timestamptz;

create index if not exists idx_itinerary_requests_next_action_at
  on public.itinerary_requests(next_action_at)
  where next_action_at is not null;

alter table public.leads
  add column if not exists next_action_at timestamptz;

create index if not exists idx_leads_next_action_at
  on public.leads(next_action_at)
  where next_action_at is not null;
