-- Hilton Ahead: affiliate-link click tracking.
--
-- Logs outbound clicks on affiliate cards/links (Booking.com, Vrbo/EPS, Viator,
-- GetYourGuide, GolfNow, Amazon, etc.) so we can compare our internal click
-- counts against each program's dashboard, spot tracking gaps, and figure out
-- which placements actually convert.
--
-- Mirrors directory_events shape (003 + 012). Public, anon-only insert via
-- /api/affiliate/track. No public read; admins read via service role.
--
-- Depends on: 003_admin_crm.sql (is_admin). Idempotent.

create table if not exists public.affiliate_events (
  id              uuid primary key default gen_random_uuid(),
  -- Program identifier from data/affiliateLinks.ts (e.g. 'booking', 'viator').
  program_id      text not null,
  -- Optional grouping: which surface fired the click (e.g. 'golf-tier-list',
  -- 'neighborhood-sea-pines', 'blog/spring-break-on-hhi'). Free-form, capped
  -- length, used only for analytics — not validated.
  placement       text,
  -- Outbound destination (truncated). Lets us spot which deeplinks earn.
  destination     text,
  event_type      text not null
                  check (event_type in (
                    'affiliate_click'
                  )),
  ip_hash         text,
  user_agent      text,
  referrer        text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_aff_events_program_created
  on public.affiliate_events (program_id, created_at desc);
create index if not exists idx_aff_events_placement_created
  on public.affiliate_events (placement, created_at desc);

-- ============================================================================
-- RLS — deny by default. Service role bypasses RLS. Admin policy granted for
-- defense-in-depth even though dashboards use service role.
-- ============================================================================
alter table public.affiliate_events enable row level security;

drop policy if exists "Admins can read affiliate_events" on public.affiliate_events;
create policy "Admins can read affiliate_events"
  on public.affiliate_events for select
  using (public.is_admin());
