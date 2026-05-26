-- 023_social_attribution_columns.sql
-- Additive: per-row UTM campaign attribution from IG bio link
-- → directory_events + purchases. Backward compatible (nullable, no defaults).
-- Paired with the social autopilot Phase 1 in migration 022.

alter table public.directory_events
  add column if not exists utm_campaign text;

alter table public.purchases
  add column if not exists utm_campaign text;

create index if not exists directory_events_utm_idx
  on public.directory_events (utm_campaign)
  where utm_campaign is not null;

create index if not exists purchases_utm_idx
  on public.purchases (utm_campaign)
  where utm_campaign is not null;
