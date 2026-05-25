-- Hilton Ahead: add info-product tier slugs to purchases CHECK.
--
-- Workstream E: two new $49 digital-download SKUs —
--   itinerary-pack-couples  — 5-day couples itinerary PDF
--   itinerary-pack-golf     — 4-day golf itinerary PDF
--
-- Idempotent — uses DROP CONSTRAINT IF EXISTS before re-adding.

alter table public.purchases
  drop constraint if exists purchases_tier_slug_check;

alter table public.purchases
  add constraint purchases_tier_slug_check
  check (tier_slug in (
    -- B2C — consumer travel consulting + Insider Club
    'compass',
    'charter',
    'heritage',
    'heritage-kit-vip',
    'insider-club-monthly',
    'insider-club-yearly',
    -- B2B — local-business directory tiers
    'listed',
    'featured',
    'signature',
    -- B2B-Ads — direct display ad SKUs
    'featured-pin',
    'story-sponsor',
    'page-display',
    'featured-villa',
    -- Info products — digital downloads (Workstream E)
    'itinerary-pack-couples',
    'itinerary-pack-golf'
  ));
